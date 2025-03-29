import React from "react";
import "../movesList/movesList";
import "./moveInfo.css";
import { Move } from "../../classes/moves";

interface MovesInfoProp {
  move: Move;
}

const MoveInfo: React.FC<MovesInfoProp> = ({ move }) => {
  return (
    <div className="moveInfo">
      <p>Type: {move.type}</p>
      <p>Class: {move.damageClass.name}</p>

      <p>Power: {move.power}</p>
      <p>Accuracy: {move.accuracy}</p>
    </div>
  );
};

export default MoveInfo;
