import React, { useState, useEffect } from "react";
import { useCustomWebSocket } from "../socketService";
import AlertScreen from "./alertScreen";
import { GameModes } from "../classes/modes";
interface StartScreenProps {
  playClickedCallback: (gameMode: GameModes) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ playClickedCallback }) => {
  const { sendJsonMessage, lastMessage } = useCustomWebSocket();
  const [isAlert, setIsAlert] = useState(true);

  const [isQueued, setIsQueued] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "z" || event.key === "Z") {
      if (isAlert) setIsAlert(false);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.data === "OpponentFound") {
        playClickedCallback(GameModes.vsPlayer);
        setIsQueued(false);
      }
      if (lastMessage.data === "GameCreated")
        playClickedCallback(GameModes.SurviveVsComputer);
    }
  }, [lastMessage, playClickedCallback]);

  const handlePlayClick = () => {
    sendJsonMessage({ type: "queue", status: "add" });
    setIsQueued(true);
  };

  const handlePlayVsComputerClick = () => {
    sendJsonMessage({ type: "game", status: "survival" });
  };
  return (
    <div className="startScreen">
      {isAlert && (
        <AlertScreen
          text={`This is autobattler based on Super Auto Pets in Pokemon world.\n
            Game is in early state and some bugs might occur and there is no all functions implemented. \n
            Playing is only possible againts another player, might be possibly vs AI in some future. \n
            All copyrights to The Pokémon Company. \n
            Press z to continue.`}
        />
      )}
      <button onClick={handlePlayClick} disabled={isQueued}>
        Play
      </button>
      <button onClick={handlePlayVsComputerClick}>Play survive</button>
      {isQueued && <p>Waiting in queue...</p>}
    </div>
  );
};

export default StartScreen;
