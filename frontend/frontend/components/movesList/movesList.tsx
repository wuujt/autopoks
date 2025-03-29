import React from "react";
import "./movesList.css";
import { Move } from "../../classes/moves";
interface MovesListProp {
  moves: Move[];
  selectedIndex: number;
  style?: React.CSSProperties;
}

const MovesList: React.FC<MovesListProp> = ({
  moves,
  selectedIndex,
  style,
}) => {
  const numberOfMoves = 4;
  const startIndex = Math.max(0, selectedIndex - numberOfMoves);
  const endIndex = Math.max(selectedIndex + 1, numberOfMoves + 1);

  const selectedMoves = moves.slice(startIndex, endIndex);
  let indexToColor = selectedIndex;
  if (indexToColor >= numberOfMoves + 1) indexToColor = numberOfMoves;
  return (
    <div className="movesListContainer" style={style}>
      <ul className="movesList">
        {selectedMoves.map((move, index) => (
          <li
            className={`moveElement ${
              index === indexToColor ? "selected" : ""
            }`}
            key={move.name}
          >
            <p>{move.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovesList;
