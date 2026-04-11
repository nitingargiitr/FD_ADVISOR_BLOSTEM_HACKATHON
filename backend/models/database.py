import os
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "fd_advisor.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"


class Base(DeclarativeBase):
    pass


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(String(64), index=True)
    role: Mapped[str] = mapped_column(String(16))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class BookingState(Base):
    __tablename__ = "booking_states"

    booking_session_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    language: Mapped[str] = mapped_column(String(8), default="hi")
    step: Mapped[str] = mapped_column(String(32), default="bank")
    bank_slug: Mapped[str | None] = mapped_column(String(64), nullable=True)
    principal: Mapped[float | None] = mapped_column(Float, nullable=True)
    tenor_months: Mapped[int | None] = mapped_column(Integer, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
