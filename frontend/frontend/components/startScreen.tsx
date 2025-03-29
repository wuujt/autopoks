import React, { useState, useEffect } from "react";
import { useCustomWebSocket } from "../socketService";
interface StartScreenProps {
  playClickedCallback: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ playClickedCallback }) => {
  const { sendJsonMessage, lastMessage } = useCustomWebSocket();
  const [isQueued, setIsQueued] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.data === "OpponentFound") {
        playClickedCallback();
        setIsQueued(false);
      }
    }
  }, [lastMessage, playClickedCallback]);

  const handlePlayClick = () => {
    sendJsonMessage({ type: "queue", status: "add" });
    setIsQueued(true);
  };

  return (
    <div className="startScreen">
      <button onClick={handlePlayClick} disabled={isQueued}>
        Play
      </button>
      {isQueued && <p>Waiting in queue...</p>}
    </div>
  );
};

export default StartScreen;
