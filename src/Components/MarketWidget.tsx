import React, { useState, useEffect, useCallback } from "react";
import useWebSocket from "../Hooks/UseWebSocket";
import Tabs from "./Tabs";
import MarketTable from "./MarketTable";

// REST API url
const restUrl = "https://binance-proxy.herokuapp.com/api";
// Websocket API url
const wsUrl = "wss://stream.binance.com/stream?streams=!miniTicker@arr";
// potential market categories
const markets = ["BNB", "BTC", "ALTS", "USDⓈ"];

export type PairData = { [key: string]: any };
export type MarketData = Map<string, PairData>;

export default function MarketWidget() {
  const [marketData, setMarketData] = useState<MarketData>(new Map());
  const [tabFilter, setTabFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // we are not required to do anything to subscribe to this endpoint
  const subscribe = useCallback(() => {}, []);
  const handeError = useCallback((e) => console.log("Error!", e), []);
  const handleDisconnect = useCallback(
    (e) => console.log("Disconnected from server!", e),
    []
  );
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const { data } = JSON.parse(event.data);
      setMarketData(updateState(marketData, data));
    },
    [marketData]
  );

  const { isActive, disconnect, connect } = useWebSocket(
    wsUrl,
    subscribe,
    handleMessage,
    handeError,
    handleDisconnect
  );

  useEffect(() => {
    setLoading(true);
    fetch(restUrl)
      .then((res) => res.json())
      .then((res) => {
        res.data.forEach(setChange);
        setMarketData(
          new Map(res.data.map((elem: PairData) => [elem.s, elem]))
        );
        connect();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="market-widget">
      {isActive ? (
        <button
          className="btn btn--primary"
          onClick={({ nativeEvent }) => {
            if (nativeEvent.detail && document?.activeElement)
              (document.activeElement as HTMLInputElement).blur();
            disconnect();
          }}>
          Disconnect
        </button>
      ) : (
        <button
          className="btn btn--secondary"
          onClick={({ nativeEvent }) => {
            if (nativeEvent.detail && document?.activeElement)
              (document.activeElement as HTMLInputElement).blur();
            connect();
          }}>
          Reconnect
        </button>
      )}
      <h2>Market</h2>
      <Tabs tabs={markets} tabFilter={tabFilter} setTabFilter={setTabFilter} />
      <MarketTable
        filter={tabFilter}
        marketData={Array.from(marketData.values())}
      />
    </section>
  );
}

/**
 * calculates the relative change from market opening and sets it to the element
 * @param elem
 */
function setChange(elem: PairData) {
  elem.ch = (elem.c / elem.o - 1) * 100;
}

/**
 * Updates the state with values coming from WS stream and returns the new state
 * @param oldState
 * @param updateData
 */
function updateState(oldState: MarketData, updateData: PairData[]) {
  const newState = new Map(oldState);
  for (let update of updateData) {
    const { q, E, c, ...rest } = update;
    const updatedPair = { ...newState.get(update.s), c: Number(c), ...rest };
    setChange(updatedPair);
    if (newState.has(update.s)) newState.set(update.s, updatedPair);
  }
  return newState;
}
