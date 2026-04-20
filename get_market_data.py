#!/usr/bin/env python3
"""
获取市场数据 - 供日知录文章使用
输出 JSON 格式，方便 Node.js 读取
"""
import yfinance as yf
import json
from datetime import datetime

def get_price(symbol, name=None):
    """获取单个标的的最新价格"""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period='1d')
        if hist.empty:
            return None
        price = hist['Close'].iloc[-1]
        return round(price, 2)
    except Exception as e:
        print(f"Error fetching {symbol}: {e}", flush=True)
        return None

def get_market_data():
    """获取所有市场数据"""
    data = {
        "update_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "crypto": {},
        "us_stocks": {},
        "gold": {},
        "oil": {},
        "indices": {}
    }
    
    # 加密货币
    crypto_pairs = [
        ("BTC-USD", "BTC"),
        ("ETH-USD", "ETH"),
    ]
    for symbol, name in crypto_pairs:
        price = get_price(symbol)
        if price:
            data["crypto"][name] = price
    
    # 美股
    us_stocks = [
        ("AAPL", "苹果"),
        ("TSLA", "特斯拉"),
        ("NVDA", "英伟达"),
        ("MSFT", "微软"),
        ("GOOGL", "谷歌"),
    ]
    for symbol, name in us_stocks:
        price = get_price(symbol)
        if price:
            data["us_stocks"][symbol] = {"name": name, "price": price}
    
    # 黄金期货 (GC=F)
    gc_price = get_price("GC=F")
    if gc_price:
        data["gold"] = {"GC=F": gc_price, "unit": "USD/盎司", "name": "黄金期货"}
    
    # 白银期货 (SI=F)
    si_price = get_price("SI=F")
    if si_price:
        data["silver"] = {"SI=F": si_price, "unit": "USD/盎司", "name": "白银期货"}
    
    # 原油：使用 USO ETF（暂无活跃期货合约）
    uso_price = get_price("USO")
    if uso_price:
        data["oil"] = {"USO": uso_price, "unit": "USD/桶", "note": "USO ETF，暂无活跃期货合约"}
    
    # 指数
    indices = [
        ("^GSPC", "标普500"),
        ("^DJI", "道琼斯"),
        ("^IXIC", "纳斯达克"),
        ("^OVX", "原油波动率指数"),
    ]
    for symbol, name in indices:
        price = get_price(symbol)
        if price:
            data["indices"][symbol] = {"name": name, "price": price}
    
    return data

if __name__ == "__main__":
    data = get_market_data()
    print(json.dumps(data, ensure_ascii=False, indent=2))
