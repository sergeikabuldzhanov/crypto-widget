import { useState, useEffect } from "react";

/**
 * Custom hook taking all the websocket callbacks and exposes ws itself, it's status, and connect/disconnect functions
 * @param wsUrl subscription url for the webscoket
 * @param onOpn onopen callback
 * @param onMsg onmessage callback
 * @param onErr onerror callback
 * @param onCls onclose callback
 */
export default function useWebSocket(
  wsUrl: string,
  onOpn: (e: Event) => void,
  onMsg: (e: MessageEvent) => void,
  onErr: (e: Event) => void,
  onCls: (e: CloseEvent) => void
) {
  const [ws, setWs] = useState<WebSocket | undefined>();
  const [isActive, setIsActive] = useState(false);

  // create new websocket when need to connect
  useEffect(() => {
    if (isActive) {
      const WS = new WebSocket(wsUrl);
      setWs(WS);
    }
  }, [isActive, wsUrl]);

  // setup all the cb's
  useEffect(() => {
    if (isActive && ws) {
      ws.onopen = onOpn;
      ws.onclose = onCls;
      ws.onmessage = onMsg;
      ws.onerror = onErr;
    }
  }, [isActive, onCls, onErr, onMsg, onOpn, ws]);

  // connect/disconnect based on status
  useEffect(() => {
    if (!isActive && ws) ws.close();
    return () => {
      if (ws) ws.close();
    };
  }, [isActive, ws]);

  function disconnect() {
    setIsActive(false);
    return isActive;
  }

  function connect() {
    setIsActive(true);
    return isActive;
  }

  return { ws, isActive, disconnect, connect };
}
