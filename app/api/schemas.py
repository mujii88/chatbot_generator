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