from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Integer, Text, JSON
from sqlalchemy.orm import declarative_base, relationship
import uuid
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    company = Column(String, nullable=True)
    role = Column(String, nullable=True)
    preferences = Column(JSON, nullable=True)  # Store user preferences as JSON
    profile_data = Column(Text, nullable=True)  # Additional profile information
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    chatbots = relationship("Chatbot", back_populates="owner")
    user_sessions = relationship("UserSession", back_populates="user")


class Chatbot(Base):
    __tablename__ = "chatbots"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    owner_id = Column(String, ForeignKey("users.id"))
    llm_endpoint_url = Column(String, nullable=True)
    chatbot_config = Column(JSON, nullable=True)  # Store chatbot-specific configuration
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="chatbots")
    api_keys = relationship("APIKey", back_populates="chatbot")


class APIKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, autoincrement=True)
    chatbot_id = Column(String, ForeignKey("chatbots.id"))
    key_hash = Column(String, nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used = Column(DateTime, nullable=True)

    chatbot = relationship("Chatbot", back_populates="api_keys")


class UserSession(Base):
    __tablename__ = "user_sessions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    session_data = Column(JSON, nullable=True)  # Store session-specific data
    context_data = Column(Text, nullable=True)  # Store conversation context
    created_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="user_sessions")
