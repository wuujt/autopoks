import React from "react";
import "./selectedMove.css";
interface SelectedTwoMovesProp {
  primaryMove?: string;
  secondaryMove?: string;
}

const SelectedTwoMoves: React.FC<SelectedTwoMovesProp> = ({
  primaryMove = "",
  secondaryMove = "",
}) => {
  return (
    <div className="selectedTwoMoves">
      <p>Primary move: </p>

      <p>{primaryMove}</p>
      <p>Secondary move: </p>

      <p>{secondaryMove}</p>
    </div>
  );
};

export default SelectedTwoMoves;
