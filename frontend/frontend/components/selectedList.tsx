import React, { useEffect, useState } from "react";
import { Pokemon } from "../classes/pokemon";
import "./selectedList.css";
import PokemonInfo from "./pokemonInfo";
import SelectedTwoMoves from "./selectedMove";
type IconListProps = {
  pokemons: Pokemon[];
  onSelectPokemon?: (selectedPokemon: Pokemon) => void;
  isRow?: boolean;
  imageStyle?: React.CSSProperties;
  isReserved?: boolean;
  isHover?: boolean;
  withMoves?: boolean;
  isKeyboard?: boolean;
};

const IconList: React.FC<IconListProps> = ({
  pokemons,
  onSelectPokemon = () => {},
  isRow = false,
  imageStyle,
  isReserved,
  isHover = true,
  withMoves = true,
  isKeyboard = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const reversedInt = [5, 4, 3, 2, 1, 0];

  const iconCount = 6;
  let filledIcons: (Pokemon | "?")[] = [
    ...pokemons,
    ...Array(iconCount - pokemons.length).fill("?"),
  ];
  if (isReserved) filledIcons = [...filledIcons].reverse();
  const handleKeyDownColumn = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, filledIcons.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const handleKeyDownRow = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, filledIcons.length - 1)
      );
    } else if (event.key === "ArrowLeft") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };
  useEffect(() => {
    if (pokemons[reversedInt[selectedIndex]]) {
      onSelectPokemon(pokemons[reversedInt[selectedIndex]]);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (isKeyboard) {
      if (isRow) window.addEventListener("keydown", handleKeyDownRow);
      else window.addEventListener("keydown", handleKeyDownColumn);
    }
    return () => {
      if (isRow) window.removeEventListener("keydown", handleKeyDownRow);
      else window.removeEventListener("keydown", handleKeyDownColumn);
    };
  });
  return (
    <div className="selectedList" id={isRow === true ? "row" : "column"}>
      {filledIcons.map((icon, index) => (
        <div className="list" key={index}>
          {icon === "?" ? (
            <p
              className="questionMark"
              id={index === selectedIndex ? "selected" : ""}
            >
              ?
            </p>
          ) : (
            <div className="icon-moves">
              <img
                className="pokemonIcon"
                id={index === selectedIndex ? "selected" : ""}
                src={icon.iconSelect}
                alt={`icon-${index}`}
                style={imageStyle}
              />
              {isHover && (
                <div className="pokemonInfoHover" id="hover">
                  <PokemonInfo
                    pokemon={icon}
                    style={{
                      backgroundColor: "azure",
                      borderRadius: "5%",
                      fontSize: "5px",
                    }}
                  ></PokemonInfo>
                </div>
              )}

              {withMoves && (
                <div className="primarySecondaryMove">
                  <SelectedTwoMoves
                    primaryMove={icon.primaryMove?.name}
                    secondaryMove={icon.secondaryMove?.name}
                  ></SelectedTwoMoves>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IconList;
