import { useState, useEffect } from "react";

export default function useWebSocket(wsUrl, onOpn, onMsg, onErr) {
  // initiazlize a ws with proper url
  // on component mount => set it's event handlers
  const [ws, setWs] = useState();
  const [isActive, setIsActive] = useState(true);
  // debugger;
  // setup ws handlers after initial render
  useEffect(() => {
    if (isActive) {
      const newSocket = new WebSocket(wsUrl);
      setWs(newSocket);
    }
  }, [isActive, wsUrl]);

  useEffect(() => {
    if (isActive && ws) {
      ws.onopen = onOpn;
      ws.onmessage = onMsg;
      ws.onerror = onErr;
    }
  }, [isActive, onErr, onOpn, onMsg, ws]);

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

  function reconnect() {
    setIsActive(true);
    return isActive;
  }

  return { ws, isActive, disconnect, reconnect };
}
