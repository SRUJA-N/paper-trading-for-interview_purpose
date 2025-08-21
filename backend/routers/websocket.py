from fastapi import APIRouter, WebSocket
import asyncio, random
from typing import Dict

router = APIRouter(tags=["WebSocket"])

active_tickers: Dict[str, Dict] = {}

@router.websocket("/ws/{ticker}")
async def websocket_endpoint(websocket: WebSocket, ticker: str):
    await websocket.accept()

    if ticker not in active_tickers:
        active_tickers[ticker] = {
            "price": round(random.uniform(50, 500), 2),
            "volume": random.randint(10000, 50000)
        }

    try:
        while True:
            state = active_tickers[ticker]
            change = round(random.uniform(-1, 1), 2)
            price = round(state["price"] + change, 2)
            if price < 0: price = 0.01
            change_percent = round((change / price) * 100, 2)
            volume = max(0, state["volume"] + random.randint(-200, 300))
            active_tickers[ticker]["price"] = price
            active_tickers[ticker]["volume"] = volume

            await websocket.send_json({
                "stock": ticker.upper(),
                "price": price,
                "volume": volume,
                "change_percent": change_percent
            })

            await asyncio.sleep(1)

    except Exception as e:
        print(f"WebSocket Error for {ticker}: {e}")
    finally:
        print(f"Client for {ticker} disconnected")
