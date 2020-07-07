import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MarketTable from "./components/MarketTable";
import useWebSocket from "../../hooks/useWebSocket";

const markets = ["BNB", "BTC", "ALTS", "USDⓈ"];

const calcChange = (elem) => {
  elem.ch = (elem.c / elem.o - 1) * 100;
};

const restUrl =
  "https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products";
const wsUrl = "wss://stream.binance.com/stream?streams=!miniTicker@arr";

export default function MarketWidget() {
  const [marketData, setMarketData] = useState(new Map());
  const [tabFilter, setTabFilter] = useState(null);

  const subscribe = useCallback(() => {}, []);
  const onErr = useCallback(() => console.log("Error!"), []);
  const handleWsMsg = useCallback(
    (event) => {
      const { data } = JSON.parse(event.data);
      const newState = new Map(marketData);
      for (let update of data) {
        const { q, E, c, ...rest } = update;
        const updatedS = { ...newState.get(update.s), c: Number(c), ...rest };
        calcChange(updatedS);
        if (newState.has(update.s)) newState.set(update.s, updatedS);
      }
      setMarketData(newState);
    },
    [marketData]
  );
  const { isActive, disconnect, reconnect } = useWebSocket(
    wsUrl,
    subscribe,
    handleWsMsg,
    onErr
  );
  useEffect(() => {
    axios
      .get(restUrl)
      .then((res) => {
        res.data.data.forEach(calcChange);
        setMarketData(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <section className="market-widget">
      {isActive ? (
        <button
          className="btn btn--primary"
          onClick={({ nativeEvent }) => {
            if (nativeEvent.detail) document.activeElement.blur();
            disconnect();
          }}
        >
          Disconnect
        </button>
      ) : (
        <button
          className="btn btn--secondary"
          onClick={({ nativeEvent }) => {
            if (nativeEvent.detail) document.activeElement.blur();
            reconnect();
          }}
        >
          Reconnect
        </button>
      )}
      <h2>Market</h2>
      <div className="market-widget__tabs tabs">
        ,
        <button
          key={"ALL"}
          className={`tab${tabFilter === null ? " tab--active" : ""}`}
          onClick={() => setTabFilter(null)}
        >
          ALL
        </button>
        {markets.map((market_name) => (
          <button
            key={market_name}
            className={`tab${tabFilter === market_name ? " tab--active" : ""}`}
            onClick={() => setTabFilter(market_name)}
          >
            {market_name}
          </button>
        ))}
      </div>
      <MarketTable
        filter={tabFilter}
        marketData={Array.from(marketData.values())}
      />
    </section>
  );
}
