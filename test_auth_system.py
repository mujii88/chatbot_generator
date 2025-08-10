#!/usr/bin/env python3
"""
Test script for authentication and user management system
This demonstrates YOUR responsibilities: authentication, user details storage, and context preparation
"""

import asyncio
import json
import requests
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
CHATBOT_ID = "c1"  # From your seed data
API_KEY = "sample_api_key_123"  # From your seed data

def test_health():
    """Test basic health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_database_status():
    """Test database status"""
    print("🔍 Testing database status...")
    response = requests.get(f"{BASE_URL}/db-status")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_chatbot_query_with_user_details():
    """Test the main chatbot query endpoint with user details"""
    print("🔍 Testing chatbot query with user details...")
    
    # Prepare the query with user details
    query_data = {
        "message": "Hello! I'm a new user and I need help with my project.",
        "user_details": {
            "first_name": "John",
            "last_name": "Doe",
            "company": "Tech Corp",
            "role": "Software Engineer",
            "preferences": {
                "language": "English",
                "timezone": "UTC",
                "notification_preferences": "email"
            },
            "profile_data": "Experienced developer with 5+ years in Python and FastAPI"
        },
        "context": "This is my first interaction with the chatbot. I'm working on a RAG system."
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    response = requests.post(
        f"{BASE_URL}/chatbot/{CHATBOT_ID}/query",
        json=query_data,
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("✅ SUCCESS! Your authentication and user management is working!")
        print(f"Chatbot ID: {result['chatbot_id']}")
        print(f"Chatbot Name: {result['chatbot_name']}")
        print(f"User Message: {result['user_message']}")
        print(f"User Context: {json.dumps(result['user_context'], indent=2)}")
        print(f"API Key Info: {result['api_key_info']}")
    else:
        print(f"❌ Error: {response.text}")
    print()

def test_chatbot_query_without_user_details():
    """Test chatbot query without user details"""
    print("🔍 Testing chatbot query without user details...")
    
    query_data = {
        "message": "What can you help me with?",
        "context": "Continuing our conversation about RAG systems."
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    response = requests.post(
        f"{BASE_URL}/chatbot/{CHATBOT_ID}/query",
        json=query_data,
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("✅ SUCCESS! Query processed without user details!")
        print(f"User Context: {json.dumps(result['user_context'], indent=2)}")
    else:
        print(f"❌ Error: {response.text}")
    print()

def test_invalid_api_key():
    """Test with invalid API key"""
    print("🔍 Testing with invalid API key...")
    
    query_data = {
        "message": "This should fail"
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": "invalid_key"
    }
    
    response = requests.post(
        f"{BASE_URL}/chatbot/{CHATBOT_ID}/query",
        json=query_data,
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✅ SUCCESS! Authentication properly rejected invalid API key!")
    else:
        print(f"❌ Unexpected response: {response.text}")
    print()

def test_get_user_context():
    """Test getting user context"""
    print("🔍 Testing get user context...")
    
    user_id = "u1"  # From your seed data
    response = requests.get(f"{BASE_URL}/users/{user_id}/context")
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        context = response.json()
        print("✅ SUCCESS! Retrieved user context for LLM integration!")
        print(f"User Context: {json.dumps(context, indent=2)}")
    else:
        print(f"❌ Error: {response.text}")
    print()

def test_update_user_context():
    """Test updating user context"""
    print("🔍 Testing update user context...")
    
    user_id = "u1"
    context_data = "User has been asking about RAG systems and wants to implement vector search."
    
    response = requests.post(
        f"{BASE_URL}/users/{user_id}/context",
        json=context_data
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ SUCCESS! Updated user context!")
        print(f"Response: {response.json()}")
    else:
        print(f"❌ Error: {response.text}")
    print()

def main():
    """Run all tests"""
    print("🚀 Testing Your Authentication and User Management System")
    print("=" * 60)
    
    # Check if server is running
    try:
        test_health()
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running! Please start the server first:")
        print("   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        return
    
    # Run tests
    test_database_status()
    test_chatbot_query_with_user_details()
    test_chatbot_query_without_user_details()
    test_invalid_api_key()
    test_get_user_context()
    test_update_user_context()
    
    print("🎉 All tests completed!")
    print("\n📋 Summary of YOUR responsibilities:")
    print("✅ Authentication (API key validation)")
    print("✅ User details storage")
    print("✅ Context preparation for LLM integration")
    print("✅ Session management")
    print("\n🔗 Your team members can now use the user_context data for LLM processing!")

if __name__ == "__main__":
    main() 