from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional, Dict, Any
from app.db.db_config import get_db
from app.db.models import User, Chatbot, APIKey, UserSession
from app.services.auth_service import AuthService
import json
import google.generativeai as genai
import os
from fastapi import UploadFile, File, Form
from datetime import datetime
from app.api.schemas import (
    CreateChatbotRequest,
    CreateChatbotResponse,
    ChatRequest,
    ChatResponse,
    BusinessInfo,
)

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

# Authentication dependency
async def authenticate_api_key(
    x_api_key: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> APIKey:
    """Authenticate API key and return the associated API key object"""
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required"
        )
    
    api_key = await AuthService.validate_api_key(x_api_key, db)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked API key"
        )
    
    return api_key

# Main chatbot query endpoint - YOUR RESPONSIBILITY
@router.post("/chatbot/{chatbot_id}/query")
async def chatbot_query(
    chatbot_id: str,
    query: Dict[str, Any],  # {"message": "user message", "user_details": {...}, "context": "..."}
    api_key: APIKey = Depends(authenticate_api_key),
    db: AsyncSession = Depends(get_db)
):
    """
    Main chatbot query endpoint - YOUR RESPONSIBILITY
    Handles:
    1. Authentication (API key validation)
    2. User details storage
    3. Context preparation for LLM integration
    """
    
    # Verify the API key belongs to the requested chatbot
    if api_key.chatbot_id != chatbot_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="API key does not have access to this chatbot"
        )
    
    # Fetch chatbot details
    chatbot = await AuthService.get_chatbot_by_id(chatbot_id, db)
    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )
    
    # Extract data from query
    user_message = query.get("message", "")
    user_details = query.get("user_details", {})
    conversation_context = query.get("context", "")
    
    if not user_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message is required"
        )
    
    # YOUR RESPONSIBILITY 1: Save user details if provided
    if user_details:
        # Get user ID from chatbot owner
        user_id = chatbot.owner_id
        success = await AuthService.save_user_details(user_id, user_details, db)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save user details"
            )
    
    # YOUR RESPONSIBILITY 2: Update conversation context
    if conversation_context:
        user_id = chatbot.owner_id
        await AuthService.update_conversation_context(user_id, conversation_context, db)
    
    # YOUR RESPONSIBILITY 3: Prepare user context for LLM integration
    user_id = chatbot.owner_id
    user_context = await AuthService.get_user_context_for_llm(user_id, db)
    
    # Prepare response for LLM integration team
    response_data = {
        "chatbot_id": chatbot_id,
        "chatbot_name": chatbot.name,
        "user_message": user_message,
        "user_context": user_context,  # This goes to your LLM team
        "chatbot_config": chatbot.chatbot_config or {},
        "api_key_info": {
            "key_id": api_key.id,
            "last_used": api_key.last_used.isoformat() if api_key.last_used else None
        },
        "timestamp": "2025-08-09T12:00:00Z"
    }
    
    return response_data

# User management endpoints
@router.post("/users/{user_id}/details")
async def save_user_details(
    user_id: str,
    details: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Save or update user details"""
    success = await AuthService.save_user_details(user_id, details, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save user details"
        )
    return {"message": "User details saved successfully"}

@router.get("/users/{user_id}/context")
async def get_user_context(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get user context for LLM integration"""
    context = await AuthService.get_user_context_for_llm(user_id, db)
    return context

@router.post("/users/{user_id}/context")
async def update_user_context(
    user_id: str,
    context_data: str,
    db: AsyncSession = Depends(get_db)
):
    """Update conversation context"""
    success = await AuthService.update_conversation_context(user_id, context_data, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update context"
        )
    return {"message": "Context updated successfully"}

# User endpoints
@router.get("/users", response_model=List[dict])
async def get_users(db: AsyncSession = Depends(get_db)):
    """Get all users"""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [
        {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "company": user.company,
            "role": user.role,
            "created_at": user.created_at
        }
        for user in users
    ]

@router.get("/users/{user_id}", response_model=dict)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific user by ID"""
    user = await AuthService.get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "company": user.company,
        "role": user.role,
        "preferences": user.preferences,
        "profile_data": user.profile_data,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }

# Chatbot endpoints
@router.get("/chatbots", response_model=List[dict])
async def get_chatbots(db: AsyncSession = Depends(get_db)):
    """Get all chatbots"""
    result = await db.execute(select(Chatbot))
    chatbots = result.scalars().all()
    return [
        {
            "id": chatbot.id,
            "name": chatbot.name,
            "owner_id": chatbot.owner_id,
            "llm_endpoint_url": chatbot.llm_endpoint_url,
            "chatbot_config": chatbot.chatbot_config,
            "created_at": chatbot.created_at
        }
        for chatbot in chatbots
    ]

@router.get("/chatbots/{chatbot_id}", response_model=dict)
async def get_chatbot(chatbot_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific chatbot by ID"""
    chatbot = await AuthService.get_chatbot_by_id(chatbot_id, db)
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    
    return {
        "id": chatbot.id,
        "name": chatbot.name,
        "owner_id": chatbot.owner_id,
        "llm_endpoint_url": chatbot.llm_endpoint_url,
        "chatbot_config": chatbot.chatbot_config,
        "created_at": chatbot.created_at
    }

@router.get("/users/{user_id}/chatbots", response_model=List[dict])
async def get_user_chatbots(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get all chatbots for a specific user"""
    result = await db.execute(select(Chatbot).where(Chatbot.owner_id == user_id))
    chatbots = result.scalars().all()
    return [
        {
            "id": chatbot.id,
            "name": chatbot.name,
            "owner_id": chatbot.owner_id,
            "llm_endpoint_url": chatbot.llm_endpoint_url,
            "chatbot_config": chatbot.chatbot_config,
            "created_at": chatbot.created_at
        }
        for chatbot in chatbots
    ]

# API Key endpoints
@router.get("/chatbots/{chatbot_id}/api-keys", response_model=List[dict])
async def get_chatbot_api_keys(chatbot_id: str, db: AsyncSession = Depends(get_db)):
    """Get all API keys for a specific chatbot"""
    result = await db.execute(select(APIKey).where(APIKey.chatbot_id == chatbot_id))
    api_keys = result.scalars().all()
    return [
        {
            "id": api_key.id,
            "chatbot_id": api_key.chatbot_id,
            "key_hash": api_key.key_hash,
            "revoked": api_key.revoked,
            "last_used": api_key.last_used,
            "created_at": api_key.created_at
        }
        for api_key in api_keys
    ]

# Database status endpoint
@router.get("/db-status")
async def get_db_status(db: AsyncSession = Depends(get_db)):
    """Get database status and record counts"""
    try:
        # Count records in each table
        user_count = await db.execute(select(User))
        user_count = len(user_count.scalars().all())
        
        chatbot_count = await db.execute(select(Chatbot))
        chatbot_count = len(chatbot_count.scalars().all())
        
        api_key_count = await db.execute(select(APIKey))
        api_key_count = len(api_key_count.scalars().all())
        
        session_count = await db.execute(select(UserSession))
        session_count = len(session_count.scalars().all())
        
        return {
            "status": "connected",
            "tables": {
                "users": user_count,
                "chatbots": chatbot_count,
                "api_keys": api_key_count,
                "user_sessions": session_count
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


# Frontend expected endpoints

@router.post("/chatbot/create", response_model=CreateChatbotResponse)
async def create_chatbot(
    # Support both multipart and JSON by using Form/UploadFile as optional, fallback to body parse
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    website_url: Optional[str] = Form(None),
    tone: Optional[str] = Form(None),
    faqs: Optional[str] = Form(None),  # JSON string if multipart
    knowledge_files: Optional[List[UploadFile]] = None,
    db: AsyncSession = Depends(get_db)
):
    # If name is None, assume JSON body
    if name is None:
        # FastAPI will already have parsed JSON body into request state; re-declare endpoint if needed
        raise HTTPException(status_code=415, detail="Only multipart/form-data supported for now")

    # Create a minimal chatbot owned by the first user (demo). In real app, supply owner_id
    # Find any user to own the bot (for demo). In real scenario, you'd use auth user id.
    result = await db.execute(select(User))
    owner = result.scalars().first()
    if not owner:
        raise HTTPException(status_code=400, detail="No user exists to own the chatbot")

    chatbot = Chatbot(
        name=name,
        owner_id=owner.id,
        llm_endpoint_url=None,
        chatbot_config={
            "name": name,
            "description": description,
            "website_url": website_url,
            "tone": tone,
            "faqs": json.loads(faqs) if faqs else [],
            "bot_display_name": name,
        },
    )
    db.add(chatbot)
    await db.commit()
    await db.refresh(chatbot)

    response: CreateChatbotResponse = CreateChatbotResponse(
        chatbot_id=chatbot.id,
        embed_script_url=f"{website_url or ''}/widget.js" if website_url else "/widget.js",
        created_at=datetime.utcnow().isoformat(),
        config=BusinessInfo(
            name=name,
            description=description or "",
            website_url=website_url,
            tone=tone or "friendly",
            faqs=json.loads(faqs) if faqs else [],
            bot_display_name=name,
        ),
    )
    return response


@router.post("/chatbot/respond", response_model=ChatResponse)
async def chatbot_respond(payload: ChatRequest, db: AsyncSession = Depends(get_db)):
        # Validate chatbot exists
        result = await db.execute(select(Chatbot).where(Chatbot.id == payload.chatbot_id))
        chatbot = result.scalar_one_or_none()
        if not chatbot:
            raise HTTPException(status_code=404, detail="Chatbot not found")

        # Validate message
        text = payload.message.strip()
        if not text:
            return ChatResponse(reply="Please enter a message.")

        # Configure Gemini
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-2.5-flash')

        # Build prompt using chatbot config
        config = chatbot.chatbot_config or {}
        business_name = config.get("name", chatbot.name)
        description = config.get("description", "")
        tone = config.get("tone", "friendly")
        faqs = config.get("faqs", [])

        # Create FAQ context
        faq_text = ""
        if faqs:
            faq_text = "\nFrequently Asked Questions:\n"
            for faq in faqs:
                if isinstance(faq, dict):
                    faq_text += f"Q: {faq.get('q', '')}\nA: {faq.get('a', '')}\n"

        # Create context prompt
        prompt = f"""You are a helpful chatbot for {business_name}.
    Business Description: {description}
    Tone: Please respond in a {tone} manner.
    {faq_text}

    User message: {text}

    Please provide a helpful response based on the business information above."""

        try:
            response = model.generate_content(prompt)
            return ChatResponse(reply=response.text)
        except Exception as e:
            return ChatResponse(reply="I'm sorry, I'm having trouble responding right now. Please try again later.")
