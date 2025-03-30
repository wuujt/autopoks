import React, { useState, useEffect } from "react";
import IconList from "./selectedList";
import { Pokemon } from "../classes/pokemon";
import PokemonInfo from "./pokemonInfo";
import { useCustomWebSocket } from "../socketService";
import "./pokemonGrid.css";
import AlertScreen from "./alertScreen";
interface IconGridProps {
  pokemons: Pokemon[];
  onSelectPokemon: (selectedPokemon: Pokemon[]) => void;
}

const IconGrid: React.FC<IconGridProps> = ({ pokemons, onSelectPokemon }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedPokemons, setSelectedPokemons] = useState<Pokemon[]>([]);
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);
  const [isAlert, setIsAlert] = useState(true);
  const { sendJsonMessage, lastMessage } = useCustomWebSocket();

  const handleConfirm = () => {
    const selectedPokemon = pokemons[selectedIndex];
    if (!selectedPokemons.includes(selectedPokemon)) {
      if (selectedPokemons.length < 6) {
        setSelectedPokemons((prevPokemons) => [
          ...prevPokemons,
          selectedPokemon,
        ]);
      }
    } else {
      setSelectedPokemons((prevPokemons) =>
        prevPokemons.filter((pokemon) => pokemon !== selectedPokemon)
      );
    }
  };

  const handleConfirmAll = () => {
    sendJsonMessage({
      type: "game",
      status: "selectedPokemons",
      pokemons: selectedPokemons.map((pokemon) => ({
        ...pokemon,
        type1: pokemon.type1.name,
        type2: pokemon.type2.name,
      })),
    });
  };

  useEffect(() => {
    if (isWaitingForOpponent) alert("Waiting for opponent");
  }, [isWaitingForOpponent]);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.data === "selectedPokemons") {
        setIsWaitingForOpponent(true);
      }
      if (lastMessage.data === "OpponentSelectedPokemons") {
        onSelectPokemon(selectedPokemons);
      }
    }
  }, [lastMessage, onSelectPokemon]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setSelectedIndex((prev) => Math.min(prev + 1, pokemons.length - 1));
      } else if (event.key === "ArrowLeft") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(prev + 10, pokemons.length - 1));
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 10, 0));
      } else if (event.key === "z" || event.key === "Z") {
        if (isAlert) setIsAlert(false);
        else handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPokemons, pokemons, selectedIndex]);

  return (
    <div className="selectPokemonsContainer">
      {isAlert && (
        <AlertScreen
          text={`It is the first stage of the game. \n
            In this screen you have to select your pokemons. \n 
            Press arrows to change selected pokemon and press z to confirm pokemons. \n
            Press on button to submit. \n
            Press z to continue.`}
        />
      )}
      <div className="selectPokemonsItems">
        <div className="pokemonInfo">
          <PokemonInfo pokemon={pokemons[selectedIndex]}></PokemonInfo>
        </div>
        <div className="pokemonsGrid">
          {pokemons.map((Pokemon, index) => (
            <div key={index}>
              <img
                id={index === selectedIndex ? "pokemon-selected" : ""}
                src={Pokemon.iconSelect}
              />
            </div>
          ))}
        </div>

        <div className="pokemonsList-button">
          <div className="pokemonList">
            <IconList
              pokemons={selectedPokemons}
              withMoves={false}
              isKeyboard={false}
              isHover={false}
            ></IconList>
          </div>
          <button
            className="confirmButton"
            id="pokemonSelect"
            onClick={handleConfirmAll}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconGrid;
