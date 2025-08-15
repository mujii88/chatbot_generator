from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Chatbot schemas
class ChatbotBase(BaseModel):
    name: str
    llm_endpoint_url: Optional[str] = None

class ChatbotCreate(ChatbotBase):
    owner_id: str

class ChatbotResponse(ChatbotBase):
    id: str
    owner_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# API Key schemas
class APIKeyBase(BaseModel):
    chatbot_id: str

class APIKeyCreate(APIKeyBase):
    key_hash: str

class APIKeyResponse(APIKeyBase):
    id: int
    key_hash: str
    revoked: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Database status schema
class DatabaseStatus(BaseModel):
    status: str
    tables: dict
    error: Optional[str] = None 


# Frontend-aligned schemas
class FAQ(BaseModel):
    q: str
    a: str


class BusinessInfo(BaseModel):
    name: str
    description: str
    website_url: Optional[str] = None
    tone: str
    faqs: List[FAQ]
    bot_display_name: Optional[str] = None


class CreateChatbotRequest(BaseModel):
    name: str
    description: str
    website_url: Optional[str] = None
    tone: str
    faqs: List[FAQ]


class CreateChatbotResponse(BaseModel):
    chatbot_id: str
    embed_script_url: str
    created_at: str
    config: BusinessInfo


class ChatRequest(BaseModel):
    chatbot_id: str
    message: str


class ChatMeta(BaseModel):
    confidence: Optional[float] = None


class ChatResponse(BaseModel):
    reply: str
    meta: Optional[ChatMeta] = None


class ChatbotInfo(BaseModel):
    chatbot_id: str
    name: str
    description: str
    tone: str
    faqs: List[FAQ]