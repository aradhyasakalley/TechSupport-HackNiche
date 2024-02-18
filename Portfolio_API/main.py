from fastapi import FastAPI, Query
from pydantic import BaseModel
import os
import datetime as dt
from pyotp import TOTP
import urllib
import pandas as pd
import logzero
import json
import websocket
from SmartApi import SmartConnect
from SmartApi.smartWebSocketV2 import SmartWebSocketV2


from typing import Dict
from pydantic import BaseModel
from typing import List

app = FastAPI()

key_path = os.getcwd()  # Assuming secret.txt is in the same directory as main.py
os.chdir(key_path)

key_secret = open("secret.txt", "r").read().split()
obj = SmartConnect(api_key=key_secret[0])
data = obj.generateSession(key_secret[2], key_secret[3], TOTP(key_secret[4]).now())

instrument_url = "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json"
response = urllib.request.urlopen(instrument_url)
instrument_list = json.loads(response.read())


class CandleDataRequest(BaseModel):
    tickers: List[str]
    duration: int
    interval: str



class CandleDataResponseItem(BaseModel):
    open: float
    high: float
    low: float
    close: float
    volume: int

class CandleDataResponse(BaseModel):
    data: Dict[str, List[CandleDataResponseItem]]

def token_lookup(ticker, instrument_list, exchange="NSE"):
    for instrument in instrument_list:
        if (
            instrument["name"] == ticker
            and instrument["exch_seg"] == exchange
            and instrument["symbol"].split("-")[-1] == "EQ"
        ):
            return instrument["token"]

#HISTORICAL DATA
def hist_data(
    tickers, duration, interval, instrument_list, exchange="NSE"
):
    hist_data_tickers = {}
    for ticker in tickers:
        params = {
            "exchange": exchange,
            "symboltoken": token_lookup(ticker, instrument_list),
            "interval": interval,
            "fromdate": (
                dt.date.today() - dt.timedelta(duration)
            ).strftime("%Y-%m-%d %H:%M"),
            "todate": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        }
        hist_data = obj.getCandleData(params)
        df_data = pd.DataFrame(
            hist_data["data"],
            columns=["date", "open", "high", "low", "close", "volume"],
        )
        df_data.set_index("date", inplace=True)
        df_data.index = pd.to_datetime(df_data.index)
        df_data.index = df_data.index.tz_localize(None)
        hist_data_tickers[ticker] = df_data.to_dict(orient="records")

    return hist_data_tickers

# {
#     tickers:["ADANIENT","HCLTECH"], 
#     duraton:5, 
#     interval"FIVE_MINUTE", 
# }

@app.post("/get_candle_data", response_model=CandleDataResponse)
async def get_candle_data(request: CandleDataRequest):
    candle_data = hist_data(
        request.tickers, request.duration, request.interval, instrument_list
    )
    response_model = CandleDataResponse(data=candle_data)
    return response_model

#RST VALUES
class StockRequest(BaseModel):
    symbols: list[str]

class RSIValues(BaseModel):
    rsi: Dict[str, List[float]]
    ema_10: Dict[str, List[float]]
    ema_20: Dict[str, List[float]]
    sma_20: Dict[str, List[float]]

class RSIResponse(BaseModel):
    analysis: Dict[str, RSIValues]

from fastapi import FastAPI, HTTPException


async def calculate_ema(data, window=10):
    ema = data['close'].ewm(span=window, adjust=False).mean()
    return ema

async def calculate_sma(data, window=20):
    sma = data['close'].rolling(window=window).mean()
    return sma

@app.post("/calculate_rsi", response_model=RSIResponse)
async def calculate_rsi(request: StockRequest):
    try:
        stock_symbols = request.symbols
        candle_data = hist_data(stock_symbols, 500, "ONE_DAY", instrument_list)

        rsi_data = {}
        for ticker, data in candle_data.items():
            rsi_values = {
                "rsi": calculate_rsi(data),
                "ema_10": await calculate_ema(data, window=10),
                "ema_20": await calculate_ema(data, window=20),
                "sma_20": await calculate_sma(data, window=20)
            }
            rsi_data[ticker] = rsi_values

        return {"analysis": rsi_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

RSI_DATA=[
  {
    "ADANIENT": {
      "RSI": {
        "2022-10-01": None,
        "2022-10-02": None,
        "2022-10-03": None,
        "2022-10-04": None,
        "2022-10-05": None,
        "2022-10-06": 67.213754,
        "2022-10-07": 75.368932,
        "2022-10-08": 78.290025,
        "2022-10-09": 77.775722,
        "2022-10-10": 69.911061,
        "2022-10-11": 72.154872,
        "2022-10-12": 70.901234,
        "2022-10-13": 68.345678,
        "2022-10-14": 75.123456,
        "2022-10-15": 76.789012
      },
      "EMA_10": {
        "2022-10-01": 3285.0,
        "2022-10-02": 3283.654545,
        "2022-10-03": 3276.853719,
        "2022-10-04": 3276.32577,
        "2022-10-05": 3266.748357,
        "2022-10-06": 3153.532143,
        "2022-10-07": 3158.062662,
        "2022-10-08": 3166.996724,
        "2022-10-09": 3171.870047,
        "2022-10-10": 3181.275493,
        "2022-10-11": 3185.246811,
        "2022-10-12": 3180.789012,
        "2022-10-13": 3172.345678,
        "2022-10-14": 3165.567901,
        "2022-10-15": 3160.901234
      },
      "EMA_20": {
        "2022-10-01": 3285.0,
        "2022-10-02": 3284.295238,
        "2022-10-03": 3280.671882,
        "2022-10-04": 3280.031703,
        "2022-10-05": 3274.662017,
        "2022-10-06": 3094.529341,
        "2022-10-07": 3102.521785,
        "2022-10-08": 3112.491139,
        "2022-10-09": 3120.23484,
        "2022-10-10": 3130.079141,
        "2022-10-11": 3132.567901,
        "2022-10-12": 3128.456789,
        "2022-10-13": 3122.901234,
        "2022-10-14": 3117.567901,
        "2022-10-15": 3113.901234
      },
      "SMA_20": {
        "2022-10-01": None,
        "2022-10-02": None,
        "2022-10-03": None,
        "2022-10-04": None,
        "2022-10-05": None,
        "2022-10-06": 3070.12,
        "2022-10-07": 3074.5675,
        "2022-10-08": 3082.1025,
        "2022-10-09": 3093.24,
        "2022-10-10": 3108.475,
        "2022-10-11": 3110.789012,
        "2022-10-12": 3105.901234,
        "2022-10-13": 3099.789012,
        "2022-10-14": 3095.567901,
        "2022-10-15": 3091.901234
      }
    }
  },
  {
    "NHPC": {
      "RSI": {
        "2022-10-01": None,
        "2022-10-02": None,
        "2022-10-03": None,
        "2022-10-04": None,
        "2022-10-05": None,
        "2022-10-06": 42.345678,
        "2022-10-07": 39.987654,
        "2022-10-08": 41.123456,
        "2022-10-09": 38.456789,
        "2022-10-10": 40.567901,
        "2022-10-11": 42.901234,
        "2022-10-12": 43.567901,
        "2022-10-13": 44.123456,
        "2022-10-14": 43.789012,
        "2022-10-15": 45.901234,
        "2022-10-16": 46.567901,
        "2022-10-17": 45.123456,
        "2022-10-18": 47.789012,
        "2022-10-19": 48.123456,
        "2022-10-20": 50.345678,
        "2022-10-21": 51.987654,
        "2022-10-22": 52.123456,
        "2022-10-23": 53.567901,
        "2022-10-24": 55.789012,
        "2022-10-25": 54.567901,
        "2022-10-26": 56.123456,
        "2022-10-27": 57.789012,
        "2022-10-28": 58.123456,
        "2022-10-29": 59.345678,
        "2022-10-30": 60.987654,
        "2022-10-31": 61.123456,
        "2022-11-01": 62.567901,
        "2022-11-02": 64.789012,
        "2022-11-03": 65.567901,
        "2022-11-04": 66.123456,
        "2022-11-05": 68.789012,
        "2022-11-06": 69.123456,
        "2022-11-07": 70.345678,
        "2022-11-08": 71.987654,
        "2022-11-09": 72.123456,
        "2022-11-10": 73.567901
      },
      "EMA_10": {
        "2022-10-01": 1298.0,
        "2022-10-02": 1300.654545,
        "2022-10-03": 1299.853719,
        "2022-10-04": 1298.32577,
        "2022-10-05": 1297.748357,
        "2022-10-06": 1302.532143,
        "2022-10-07": 1306.062662,
        "2022-10-08": 1308.996724,
        "2022-10-09": 1310.870047,
        "2022-10-10": 1313.275493,
        "2022-10-11": 1315.246811,
        "2022-10-12": 1318.789012,
        "2022-10-13": 1322.345678,
        "2022-10-14": 1326.567901,
        "2022-10-15": 1331.901234,
        "2022-10-16": 1336.567901,
        "2022-10-17": 1342.789012,
        "2022-10-18": 1348.123456,
        "2022-10-19": 1352.345678,
        "2022-10-20": 1355.987654,
        "2022-10-21": 1361.123456,
        "2022-10-22": 1365.567901,
        "2022-10-23": 1372.789012,
        "2022-10-24": 1380.123456,
        "2022-10-25": 1388.567901,
        "2022-10-26": 1396.123456,
        "2022-10-27": 1404.789012,
        "2022-10-28": 1412.123456,
        "2022-10-29": 1418.345678,
        "2022-10-30": 1423.987654,
        "2022-10-31": 1428.123456,
        "2022-11-01": 1432.567901,
        "2022-11-02": 1437.789012,
        "2022-11-03": 1443.567901,
        "2022-11-04": 1449.123456,
        "2022-11-05": 1454.789012,
        "2022-11-06": 1460.123456,
        "2022-11-07": 1465.345678,
        "2022-11-08": 1470.987654,
        "2022-11-09": 1476.123456,
        "2022-11-10": 1481.567901
      },
      "EMA_20": {
        "2022-10-01": 1298.0,
        "2022-10-02": 1299.295238,
        "2022-10-03": 1299.671882,
        "2022-10-04": 1300.031703,
        "2022-10-05": 1300.662017,
        "2022-10-06": 1290.529341,
        "2022-10-07": 1282.521785,
        "2022-10-08": 1273.491139,
        "2022-10-09": 1265.23484,
        "2022-10-10": 1256.079141,
        "2022-10-11": 1249.567901,
        "2022-10-12": 1244.456789,
        "2022-10-13": 1240.901234,
        "2022-10-14": 1236.567901,
        "2022-10-15": 1232.901234,
        "2022-10-16": 1228.567901,
        "2022-10-17": 1223.789012,
        "2022-10-18": 1218.123456,
        "2022-10-19": 1212.345678,
        "2022-10-20": 1207.987654,
        "2022-10-21": 1203.123456,
        "2022-10-22": 1198.567901,
        "2022-10-23": 1192.789012,
        "2022-10-24": 1186.123456,
        "2022-10-25": 1178.567901,
        "2022-10-26": 1171.123456,
        "2022-10-27": 1163.789012,
        "2022-10-28": 1156.123456,
        "2022-10-29": 1148.345678,
        "2022-10-30": 1140.987654,
        "2022-10-31": 1133.123456,
        "2022-11-01": 1125.567901,
        "2022-11-02": 1117.789012,
        "2022-11-03": 1109.567901,
        "2022-11-04": 1101.123456,
        "2022-11-05": 1093.789012,
        "2022-11-06": 1086.123456,
        "2022-11-07": 1078.345678,
        "2022-11-08": 1070.987654,
        "2022-11-09": 1063.123456,
        "2022-11-10": 1055.567901
      },
      "SMA_20": {
        "2022-10-01": None,
        "2022-10-02": None,
        "2022-10-03": None,
        "2022-10-04": None,
        "2022-10-05": None,
        "2022-10-06": 1293.12,
        "2022-10-07": 1295.5675,
        "2022-10-08": 1297.1025,
        "2022-10-09": 1300.24,
        "2022-10-10": 1303.475,
        "2022-10-11": 1305.789012,
        "2022-10-12": 1305.901234,
        "2022-10-13": 1305.789012,
        "2022-10-14": 1305.567901,
        "2022-10-15": 1305.901234,
        "2022-10-16": 1306.567901,
        "2022-10-17": 1307.789012,
        "2022-10-18": 1309.123456,
        "2022-10-19": 1309.345678,
        "2022-10-20": 1310.567901,
        "2022-10-21": 1312.789012,
        "2022-10-22": 1313.123456,
        "2022-10-23": 1314.567901,
        "2022-10-24": 1315.789012,
        "2022-10-25": 1317.123456,
        "2022-10-26": 1318.567901,
        "2022-10-27": 1319.789012,
        "2022-10-28": 1321.123456,
        "2022-10-29": 1322.345678,
        "2022-10-30": 1323.789012,
        "2022-10-31": 1325.123456,
        "2022-11-01": 1326.567901,
        "2022-11-02": 1327.789012,
        "2022-11-03": 1329.567901,
        "2022-11-04": 1330.123456,
        "2022-11-05": 1330.789012,
        "2022-11-06": 1331.123456,
        "2022-11-07": 1332.345678,
        "2022-11-08": 1333.987654,
        "2022-11-09": 1335.123456,
        "2022-11-10": 1336.567901
      }
    }
  }
]

@app.get("/ent_score")
async def get_ent_score(company_name: str):
    for item in RSI_DATA:
        if company_name in item:
            return item[company_name]

    return {"detail": "Company not found"}
