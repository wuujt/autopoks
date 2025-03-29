import useWebSocket from "react-use-websocket";

const WS_URL = "ws://localhost:3000";

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
