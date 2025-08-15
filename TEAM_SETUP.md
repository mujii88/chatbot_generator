# 🚀 Team Setup Guide - Chatbot Generator

This guide will get your development environment up and running in minutes!

## 📋 Prerequisites

- **Python 3.8+** (3.11+ recommended)
- **Node.js 18+** (with npm)
- **Git**

## 🎯 Quick Start (5 minutes)

### 1. Clone & Setup
```bash
# Clone the repository
git clone <your-github-repo-url>
cd chatbot_generator

# Create and activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
echo "DATABASE_URL=sqlite+aiosqlite:///./chatbot.db" > .env
echo "SECRET_KEY=dev_secret_key_123" >> .env

# Setup database
python -m alembic upgrade head
python -m app.seed_data

# Start backend (keep running in terminal)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup (new terminal)
```bash
# Navigate to frontend
cd chat-craft-frontend

# Install dependencies
npm install

# Create frontend environment
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
echo "VITE_USE_MOCK=false" >> .env

# Build widget
npx vite build --config vite.widget.config.ts

# Start frontend dev server
npm run dev
```

### 3. Test Everything Works
- **Backend**: http://localhost:8000/health
- **Frontend**: http://localhost:5173/
- **API Docs**: http://localhost:8000/docs
- **Widget**: http://localhost:8000/widget.js

## 🔧 Detailed Setup

### Backend Configuration

#### Environment Variables (.env)
```env
DATABASE_URL=sqlite+aiosqlite:///./chatbot.db
SECRET_KEY=your_secret_key_here
```

#### Database Setup
```bash
# Run migrations
python -m alembic upgrade head

# Seed sample data
python -m app.seed_data
```

#### Start Backend Server
```bash
# Development mode (auto-reload)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Production mode
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Configuration

#### Environment Variables (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=false
```

#### Build Widget
```bash
# Build widget for production
npx vite build --config vite.widget.config.ts

# This creates: public/widget.js
```

#### Start Development Server
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

## 🧪 Testing Your Setup

### 1. Backend Health Check
```bash
curl http://localhost:8000/health
# Should return: {"status": "ok"}
```

### 2. Database Status
```bash
curl http://localhost:8000/db-status
# Should show connected status with table counts
```

### 3. Widget Loading
```bash
curl http://localhost:8000/widget.js | head -n 5
# Should show widget JavaScript code
```

### 4. Create Test Chatbot
```bash
curl -X POST -H "Content-Type: application/json" \
  http://localhost:8000/chatbot/create \
  -d '{"name":"Test Bot","description":"Test","tone":"friendly","faqs":[]}'
```

### 5. Test Widget Embed
Create a test HTML file:
```html
<!DOCTYPE html>
<html>
<head><title>Widget Test</title></head>
<body>
    <h1>Test Page</h1>
    <script src="http://localhost:8000/widget.js" 
            data-chatbot-id="YOUR_CHATBOT_ID"></script>
</body>
</html>
```

## 🏗️ Project Structure

```
chatbot_generator/
├── app/                          # Backend Python code
│   ├── main.py                  # FastAPI app entry point
│   ├── api/                     # API routes and schemas
│   ├── db/                      # Database models and config
│   └── services/                # Business logic
├── chat-craft-frontend/         # Frontend React app
│   ├── src/                     # Source code
│   ├── public/                  # Static assets
│   └── package.json            # Node dependencies
├── migrations/                  # Database migrations
├── requirements.txt             # Python dependencies
└── .env                        # Environment variables
```

## 🚨 Common Issues & Solutions

### Backend Issues

#### Port Already in Use
```bash
# Find process using port 8000
ss -ltnp | grep :8000

# Kill the process
kill -9 <PID>

# Or use different port
python -m uvicorn app.main:app --port 8001
```

#### Database Errors
```bash
# Delete database and recreate
rm chatbot.db
python -m alembic upgrade head
python -m app.seed_data
```

#### Import Errors
```bash
# Ensure PYTHONPATH is set
export PYTHONPATH=/path/to/chatbot_generator

# Or run from project root
cd /path/to/chatbot_generator
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Issues

#### Widget Not Loading
```bash
# Rebuild widget
npx vite build --config vite.widget.config.ts

# Check backend serves widget.js
curl http://localhost:8000/widget.js
```

#### API Connection Failed
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check VITE_API_BASE_URL in .env
cat .env
```

#### Build Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🔄 Development Workflow

### 1. Daily Development
```bash
# Terminal 1: Backend
cd chatbot_generator
source .venv/bin/activate
python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
cd chat-craft-frontend
npm run dev
```

### 2. Testing Changes
```bash
# Test backend endpoints
python -m pytest  # if tests exist
curl http://localhost:8000/health

# Test frontend
npm run build
npm run preview
```

### 3. Database Changes
```bash
# Create new migration
python -m alembic revision --autogenerate -m "Description"

# Apply migration
python -m alembic upgrade head

# Rollback if needed
python -m alembic downgrade -1
```

## 🌐 Production Deployment

### Environment Variables
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host:port/db
SECRET_KEY=your_secure_secret_key
```

### Build Commands
```bash
# Backend
pip install -r requirements.txt
python -m alembic upgrade head

# Frontend
npm run build
npx vite build --config vite.widget.config.ts
```

### Serve Widget
The backend automatically serves `widget.js` at `/widget.js` endpoint.

## 📚 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `GET /db-status` - Database status
- `POST /chatbot/create` - Create new chatbot
- `POST /chatbot/respond` - Chat with bot
- `GET /widget.js` - Widget JavaScript

### Full API Documentation
Visit: http://localhost:8000/docs

## 🆘 Getting Help

### Debug Mode
```bash
# Backend with debug logging
python -m uvicorn app.main:app --log-level debug

# Frontend with verbose output
npm run dev -- --debug
```

### Logs
- **Backend**: Check `backend.log` file
- **Frontend**: Check browser console
- **Database**: Check Alembic logs

### Team Communication
- Check GitHub Issues
- Review recent commits
- Ask in team chat

## ✅ Success Checklist

- [ ] Backend runs on http://localhost:8000
- [ ] Frontend runs on http://localhost:5173
- [ ] Database migrations completed
- [ ] Widget.js loads from backend
- [ ] Can create chatbots via web interface
- [ ] Embed codes are generated correctly
- [ ] Widget appears on test pages

## 🎉 You're Ready!

Once you've completed the setup:
1. **Create your first chatbot** via the web interface
2. **Test the embed code** on a test page
3. **Start developing** new features
4. **Deploy to production** when ready

Happy coding! 🚀

---

**Need help?** Check the troubleshooting section above or ask your team lead.
