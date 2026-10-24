from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import AIUsageLog
from app.schemas import AIUsageLogRead

router = APIRouter(prefix="/ai-logs", tags=["AI Audit & Privacy Gateway Logs"])

@router.get("", response_model=List[AIUsageLogRead])
def list_ai_logs(db: Session = Depends(get_db)):
    logs = db.query(AIUsageLog).order_by(AIUsageLog.created_at.desc()).limit(100).all()
    return logs
