# Your Responsibilities - Authentication & User Management

## 🎯 **Your Role in the Team Project**

You are responsible for the **backend authentication and user management** part of the RAG chatbot system. Your team members will handle the LLM integration.

## 📋 **Your Specific Responsibilities**

### 1. **Authentication (API Key Validation)**
- ✅ Validate API keys for each request
- ✅ Track API key usage (last_used timestamp)
- ✅ Handle revoked/invalid API keys
- ✅ Ensure API keys belong to the correct chatbot

### 2. **User Details Storage**
- ✅ Save user profile information (name, company, role, etc.)
- ✅ Store user preferences as JSON
- ✅ Handle profile data updates
- ✅ Link user details to chatbot owners

### 3. **Context Preparation for LLM Integration**
- ✅ Prepare comprehensive user context for your LLM team
- ✅ Manage conversation context/sessions
- ✅ Provide structured data for LLM processing
- ✅ Track user sessions and activity

## 🚀 **How to Use Your System**

### **Start the Server**
```bash
cd /home/one/Project
source myvenv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Test Your System**
```bash
python test_auth_system.py
```

### **Main Endpoint for Your Team**
```
POST /chatbot/{chatbot_id}/query
```

**Request Format:**
```json
{
  "message": "User's message",
  "user_details": {
    "first_name": "John",
    "last_name": "Doe", 
    "company": "Tech Corp",
    "role": "Software Engineer",
    "preferences": {
      "language": "English",
      "timezone": "UTC"
    },
    "profile_data": "Additional user information"
  },
  "context": "Conversation context"
}
```

**Headers:**
```
X-API-Key: sample_api_key_123
Content-Type: application/json
```

**Response (for your LLM team):**
```json
{
  "chatbot_id": "c1",
  "chatbot_name": "My First Chatbot",
  "user_message": "User's message",
  "user_context": {
    "user_id": "u1",
    "user_profile": {
      "email": "test@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "company": "Tech Corp",
      "role": "Software Engineer",
      "preferences": {...},
      "profile_data": "..."
    },
    "session_data": {...},
    "conversation_context": "...",
    "timestamp": "2025-08-09T12:00:00Z"
  },
  "chatbot_config": {...},
  "api_key_info": {
    "key_id": 1,
    "last_used": "2025-08-09T12:00:00Z"
  },
  "timestamp": "2025-08-09T12:00:00Z"
}
```

## 🔧 **Database Schema**

### **Users Table** (Enhanced)
```sql
- id (Primary Key)
- email (Unique)
- hashed_password
- first_name
- last_name
- company
- role
- preferences (JSON)
- profile_data (Text)
- created_at
- updated_at
```

### **User Sessions Table** (New)
```sql
- id (Primary Key)
- user_id (Foreign Key)
- session_data (JSON)
- context_data (Text)
- created_at
- last_activity
- is_active
```

### **API Keys Table** (Enhanced)
```sql
- id (Primary Key)
- chatbot_id (Foreign Key)
- key_hash
- revoked
- created_at
- last_used (New)
```

## 📊 **What Your LLM Team Receives**

The `user_context` object contains everything your LLM team needs:

1. **User Profile**: Complete user information
2. **Session Data**: Current session state
3. **Conversation Context**: Previous conversation history
4. **Preferences**: User-specific settings
5. **Timestamp**: When the context was prepared

## 🧪 **Testing Your System**

### **1. Test Authentication**
```bash
# Valid API key
curl -X POST "http://localhost:8000/chatbot/c1/query" \
  -H "X-API-Key: sample_api_key_123" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Invalid API key
curl -X POST "http://localhost:8000/chatbot/c1/query" \
  -H "X-API-Key: invalid_key" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### **2. Test User Details Storage**
```bash
curl -X POST "http://localhost:8000/chatbot/c1/query" \
  -H "X-API-Key: sample_api_key_123" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "user_details": {
      "first_name": "John",
      "last_name": "Doe",
      "company": "Tech Corp",
      "role": "Developer"
    }
  }'
```

### **3. Test Context Retrieval**
```bash
curl "http://localhost:8000/users/u1/context"
```

## 🔄 **Integration with Your LLM Team**

### **Data Flow:**
1. **Client** → Sends query with user details
2. **Your System** → Authenticates, stores user data, prepares context
3. **LLM Team** → Receives structured user_context for processing
4. **LLM Team** → Returns response to client

### **What You Provide to LLM Team:**
- ✅ **Authentication Status**: Validated API key info
- ✅ **User Profile**: Complete user information
- ✅ **Session Context**: Conversation history
- ✅ **User Preferences**: Personalization data
- ✅ **Structured Data**: Ready for LLM processing

## 📈 **Monitoring & Debugging**

### **Database Status**
```bash
curl "http://localhost:8000/db-status"
```

### **API Documentation**
Visit: `http://localhost:8000/docs`

### **Check Database in DBeaver**
- Connect to `chatbot_db`
- Check tables: `users`, `user_sessions`, `api_keys`, `chatbots`

## 🎯 **Success Criteria**

Your system is working correctly when:

1. ✅ **Authentication**: Valid API keys work, invalid ones are rejected
2. ✅ **User Storage**: User details are saved and retrievable
3. ✅ **Context Preparation**: LLM team receives complete user context
4. ✅ **Session Management**: Conversation context is maintained
5. ✅ **Error Handling**: Proper error responses for invalid requests

## 🚀 **Next Steps for Your Team**

1. **Test the system** with `python test_auth_system.py`
2. **Share the API documentation** with your LLM team
3. **Provide the user_context structure** to your LLM team
4. **Coordinate on the data format** for LLM integration
5. **Set up monitoring** for API usage and errors

## 📞 **Support**

If you need help:
- Check the API documentation at `/docs`
- Review the test script for examples
- Check database status at `/db-status`
- Monitor logs for error details

---

**You've successfully built a robust authentication and user management system! 🎉** 