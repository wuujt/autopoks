import useWebSocket from "react-use-websocket";

const WS_URL = "ws://localhost:3000";

//const WS_URL = "wss://autopoks.onrender.com";

export function useCustomWebSocket() {
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    share: true,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  return { sendJsonMessage, lastMessage, readyState };
}
