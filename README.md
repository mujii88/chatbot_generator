# Chatbot Backend API

A FastAPI-based backend for managing chatbots, users, and API keys.

## Features

- **User Management**: Create and manage users
- **Chatbot Management**: Create and manage chatbots for users
- **API Key Management**: Generate and manage API keys for chatbots
- **Database**: PostgreSQL with async SQLAlchemy
- **Migrations**: Alembic for database schema management

## Project Structure

```
Project/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── seed_data.py         # Database seeding script
│   ├── api/
│   │   ├── routes.py        # API routes
│   │   └── schemas.py       # Pydantic models
│   ├── db/
│   │   ├── db_config.py     # Database configuration
│   │   └── models.py        # SQLAlchemy models
│   └── services/            # Business logic services
├── migrations/              # Alembic migrations
├── alembic.ini             # Alembic configuration
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── README.md              # This file
```

## Setup

### 1. Prerequisites

- Python 3.8+
- PostgreSQL
- pip

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/database_name
SECRET_KEY=your_secret_key_here
```

### 3. Install Dependencies

```bash
# Create virtual environment
python -m venv myvenv
source myvenv/bin/activate  # On Windows: myvenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Database Setup

```bash
# Run migrations
alembic upgrade head

# Seed the database with initial data
python -m app.seed_data
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## Available Endpoints

### Health Check
- `GET /health` - Check API health

### Database Status
- `GET /db-status` - Get database connection status and record counts

### Users
- `GET /users` - Get all users
- `GET /users/{user_id}` - Get specific user

### Chatbots
- `GET /chatbots` - Get all chatbots
- `GET /chatbots/{chatbot_id}` - Get specific chatbot
- `GET /users/{user_id}/chatbots` - Get chatbots for specific user

### API Keys
- `GET /chatbots/{chatbot_id}/api-keys` - Get API keys for specific chatbot

## Database Models

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `hashed_password`: Hashed password
- `created_at`: Creation timestamp

### Chatbot
- `id`: Unique identifier
- `name`: Chatbot name
- `owner_id`: Reference to user
- `llm_endpoint_url`: LLM endpoint URL
- `created_at`: Creation timestamp

### APIKey
- `id`: Auto-incrementing ID
- `chatbot_id`: Reference to chatbot
- `key_hash`: Hashed API key
- `revoked`: Whether key is revoked
- `created_at`: Creation timestamp

## Development

### Running Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Seeding Data

```bash
python -m app.seed_data
```

### Testing the API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test database status
curl http://localhost:8000/db-status

# Get all users
curl http://localhost:8000/users

# Get all chatbots
curl http://localhost:8000/chatbots
```

## Next Steps

1. **Authentication**: Add JWT-based authentication
2. **Password Hashing**: Implement proper password hashing with bcrypt
3. **CRUD Operations**: Add POST, PUT, DELETE endpoints
4. **Validation**: Add input validation and error handling
5. **Testing**: Add unit and integration tests
6. **Logging**: Add proper logging configuration
7. **Rate Limiting**: Implement API rate limiting
8. **Documentation**: Add more detailed API documentation 