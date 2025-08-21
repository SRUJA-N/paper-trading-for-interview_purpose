from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from routers.auth import get_current_user
from typing import Annotated

router = APIRouter(tags=["Portfolio"])

@router.get("/portfolio", response_model=list[schemas.Portfolio])
def get_portfolio(
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return db.query(models.Portfolio).filter_by(user_id=current_user.id).all()

@router.get("/trade-history", response_model=list[schemas.Trade])
def get_trade_history(
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return (
        db.query(models.Trade)
        .filter_by(user_id=current_user.id)
        .order_by(models.Trade.timestamp.desc())
        .all()
    )
