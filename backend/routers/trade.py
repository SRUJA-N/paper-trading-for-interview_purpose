from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from routers.auth import get_current_user
from typing import Annotated

router = APIRouter(tags=["Trade"])

@router.post("/trade")
def trade(
    trade: schemas.TradeBase,
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    cost = trade.quantity * trade.price

    if trade.trade_type.upper() == "BUY":
        holding = db.query(models.Portfolio).filter_by(
            user_id=current_user.id, symbol=trade.symbol
        ).first()
        if holding:
            total_cost = holding.quantity * holding.avg_price + cost
            holding.quantity += trade.quantity
            holding.avg_price = total_cost / holding.quantity
        else:
            holding = models.Portfolio(
                user_id=current_user.id,
                symbol=trade.symbol,
                quantity=trade.quantity,
                avg_price=trade.price
            )
            db.add(holding)

    elif trade.trade_type.upper() == "SELL":
        holding = db.query(models.Portfolio).filter_by(
            user_id=current_user.id, symbol=trade.symbol
        ).first()
        if not holding or holding.quantity < trade.quantity:
            raise HTTPException(status_code=400, detail="Not enough shares to sell")
        holding.quantity -= trade.quantity
        if holding.quantity == 0:
            db.delete(holding)
    else:
        raise HTTPException(status_code=400, detail="Invalid trade type")

    new_trade = models.Trade(
        user_id=current_user.id,
        symbol=trade.symbol,
        trade_type=trade.trade_type.upper(),
        quantity=trade.quantity,
        price=trade.price
    )
    db.add(new_trade)
    db.commit()
    return {"message": f"{trade.trade_type} executed successfully"}
