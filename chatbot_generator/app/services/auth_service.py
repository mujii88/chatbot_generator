from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.db.models import User, APIKey, UserSession, Chatbot
from datetime import datetime
import json

class AuthService:
    """
    Authentication and user management service
    Handles API key validation, user sessions, and user details
    """
    
    @staticmethod
    async def validate_api_key(api_key_hash: str, db: AsyncSession) -> Optional[APIKey]:
        """
        Validate API key and return the API key object if valid
        """
        result = await db.execute(
            select(APIKey).where(APIKey.key_hash == api_key_hash)
        )
        api_key = result.scalar_one_or_none()
        
        if not api_key or api_key.revoked:
            return None
        
        # Update last used timestamp
        await db.execute(
            update(APIKey)
            .where(APIKey.id == api_key.id)
            .values(last_used=datetime.utcnow())
        )
        await db.commit()
        
        return api_key
    
    @staticmethod
    async def get_user_by_id(user_id: str, db: AsyncSession) -> Optional[User]:
        """
        Get user by ID with all details
        """
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_chatbot_by_id(chatbot_id: str, db: AsyncSession) -> Optional[Chatbot]:
        """
        Get chatbot by ID with configuration
        """
        result = await db.execute(select(Chatbot).where(Chatbot.id == chatbot_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_user_session(
        user_id: str, 
        session_data: Dict[str, Any] = None,
        context_data: str = None,
        db: AsyncSession = None
    ) -> UserSession:
        """
        Create a new user session
        """
        session = UserSession(
            user_id=user_id,
            session_data=session_data or {},
            context_data=context_data or "",
            last_activity=datetime.utcnow()
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def update_user_session(
        session_id: str,
        session_data: Dict[str, Any] = None,
        context_data: str = None,
        db: AsyncSession = None
    ) -> Optional[UserSession]:
        """
        Update an existing user session
        """
        result = await db.execute(select(UserSession).where(UserSession.id == session_id))
        session = result.scalar_one_or_none()
        
        if not session:
            return None
        
        if session_data is not None:
            session.session_data = session_data
        if context_data is not None:
            session.context_data = context_data
        
        session.last_activity = datetime.utcnow()
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def get_user_context_for_llm(user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """
        Get all user context data that will be sent to LLM integration
        This is the data your team members will use for LLM processing
        """
        # Get user details
        user = await AuthService.get_user_by_id(user_id, db)
        if not user:
            return {}
        
        # Get active session
        result = await db.execute(
            select(UserSession)
            .where(UserSession.user_id == user_id, UserSession.is_active == True)
            .order_by(UserSession.last_activity.desc())
        )
        active_session = result.scalar_one_or_none()
        
        # Prepare context data for LLM
        context = {
            "user_id": user.id,
            "user_profile": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "company": user.company,
                "role": user.role,
                "preferences": user.preferences or {},
                "profile_data": user.profile_data
            },
            "session_data": active_session.session_data if active_session else {},
            "conversation_context": active_session.context_data if active_session else "",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return context
    
    @staticmethod
    async def save_user_details(
        user_id: str,
        details: Dict[str, Any],
        db: AsyncSession
    ) -> bool:
        """
        Save or update user details
        """
        try:
            # Update user with new details
            update_data = {}
            
            if "first_name" in details:
                update_data["first_name"] = details["first_name"]
            if "last_name" in details:
                update_data["last_name"] = details["last_name"]
            if "company" in details:
                update_data["company"] = details["company"]
            if "role" in details:
                update_data["role"] = details["role"]
            if "preferences" in details:
                update_data["preferences"] = details["preferences"]
            if "profile_data" in details:
                update_data["profile_data"] = details["profile_data"]
            
            if update_data:
                update_data["updated_at"] = datetime.utcnow()
                
                await db.execute(
                    update(User)
                    .where(User.id == user_id)
                    .values(**update_data)
                )
                await db.commit()
            
            return True
        except Exception as e:
            await db.rollback()
            print(f"Error saving user details: {e}")
            return False
    
    @staticmethod
    async def update_conversation_context(
        user_id: str,
        context_data: str,
        db: AsyncSession
    ) -> bool:
        """
        Update conversation context for the user's active session
        """
        try:
            # Get active session
            result = await db.execute(
                select(UserSession)
                .where(UserSession.user_id == user_id, UserSession.is_active == True)
                .order_by(UserSession.last_activity.desc())
            )
            session = result.scalar_one_or_none()
            
            if session:
                session.context_data = context_data
                session.last_activity = datetime.utcnow()
            else:
                # Create new session if none exists
                session = UserSession(
                    user_id=user_id,
                    context_data=context_data,
                    last_activity=datetime.utcnow()
                )
                db.add(session)
            
            await db.commit()
            return True
        except Exception as e:
            await db.rollback()
            print(f"Error updating conversation context: {e}")
            return False 