# app/seed_data.py
import asyncio
from app.db.db_config import AsyncSessionLocal  # match what's in db_config.py
from app.db.models import User, Chatbot, APIKey


async def seed():
    async with AsyncSessionLocal() as session:
        # Create a test user
        user = User(
            id="u1",
            email="test@example.com",
            hashed_password="hashed_password",
        )
        session.add(user)
        await session.flush()  # so we get user.id

        # Create a chatbot for that user
        chatbot = Chatbot(
            id="c1",
            name="My First Chatbot",
            owner_id=user.id,
            llm_endpoint_url="http://localhost:8000"
        )
        session.add(chatbot)
        await session.flush()

        # Add an API key
        api_key = APIKey(
            chatbot_id=chatbot.id,
            key_hash="sample_api_key_123",
            revoked=False
        )
        session.add(api_key)

        await session.commit()
        print("✅ Seed data inserted!")


if __name__ == "__main__":
    asyncio.run(seed())
