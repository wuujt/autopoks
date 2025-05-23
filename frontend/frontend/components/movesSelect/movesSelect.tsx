import React, { useEffect, useState } from "react";
import { Pokemon } from "../../classes/pokemon";
import IconList from "../selectedList";
import MovesList from "../movesList/movesList";
import SelectedTwoMoves from "../selectedMove";
import { useCustomWebSocket } from "../../socketService";
import "./movesSelect.css";
import MoveInfo from "../moveInfo/moveInfo";
import AlertScreen from "../alertScreen";
import { GameModes } from "../../classes/modes";
interface MovesSelectProp {
  pokemons: Pokemon[];
  onSelectMovesCallback: (
    selectedPokemons: Pokemon[],
    moves: { [key: string]: number[] }
  ) => void;
  gameMode: GameModes;
}

const MovesSelect: React.FC<MovesSelectProp> = ({
  pokemons,
  onSelectMovesCallback,
  gameMode,
}) => {
  const [isAlert, setIsAlert] = useState(true);

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>(pokemons[0]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedMoves, setSelectedMoves] = useState<{
    [key: string]: number[];
  }>({});
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isFetchedOpponent, setIsFetchedOpponent] = useState<boolean>(false);

  const [settingMoveIndex, setSettingMoveIndex] = useState<number>(0);
  const initialMoves: { [key: string]: number[] } = {};
  const [opponentPokemons, setOpponentPokemons] = useState<Pokemon[]>([]);
  const { sendJsonMessage, lastMessage } = useCustomWebSocket();
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);

  pokemons.forEach((pokemon) => {
    initialMoves[pokemon.name] = [0, 0];
  });

  useEffect(() => {
    const initialMoves: { [key: string]: number[] } = {};
    pokemons.forEach((pokemon) => {
      initialMoves[pokemon.name] = [0, 0];
    });
    setSelectedMoves(initialMoves);
  }, [pokemons]);

  useEffect(() => {
    const fetchPokemons = async (names: string[]) => {
      try {
        const pokemons = await Promise.all(
          names.map((name: string) => Pokemon.fromAPI(name))
        );
        setOpponentPokemons(pokemons);
        setIsFetchedOpponent(true);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      }
    };
    if (lastMessage && lastMessage.data === "OpponentSelectedMoves") {
      onSelectMovesCallback(pokemons, selectedMoves);
    } else if (lastMessage && lastMessage.data) {
      console.log(lastMessage.data);

      const message = JSON.parse(lastMessage.data);

      if (message.type === "pokemonsName") fetchPokemons(message.names);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (gameMode == GameModes.SurviveVsComputer) {
      setIsFetchedOpponent(true);
    } else sendJsonMessage({ type: "get", status: "OpponentPokemons" });

    const fetchAllMoves = async () => {
      await Promise.all(pokemons.map((pokemon) => pokemon.fetchMoves()));

      pokemons.forEach((pokemon) => {
        pokemon.moves.sort((a, b) => a.name.localeCompare(b.name));
      });

      setIsFetched(true);
    };

    fetchAllMoves();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, selectedPokemon, settingMoveIndex]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        Math.min(prev + 1, selectedPokemon.moves.length - 1)
      );
    } else if (event.key === "z" || event.key === "Z") {
      if (isAlert) setIsAlert(false);
      else handleConfirmMove();
    }
  };

  const handleConfirmMove = () => {
    setSelectedMoves((prevMoves) => {
      const updatedMoves = { ...prevMoves };
      updatedMoves[selectedPokemon.name][settingMoveIndex] = selectedIndex;
      return updatedMoves;
    });
    setSettingMoveIndex((prev) => (prev + 1) % 2);
  };

  const handleConfirmAll = () => {
    sendJsonMessage({
      type: "game",
      status: "selectedMoves",
      primaryMoves: pokemons.map(
        (pokemon) => pokemon.moves[selectedMoves[pokemon.name][0]]
      ),
      secondaryMoves: pokemons.map(
        (pokemon) => pokemon.moves[selectedMoves[pokemon.name][0]]
      ),
    });
    if (gameMode === GameModes.SurviveVsComputer)
      onSelectMovesCallback(pokemons, selectedMoves);

    setIsWaitingForOpponent(true);
  };

  useEffect(() => {
    if (isWaitingForOpponent) alert("Waiting for opponent");
  }, [isWaitingForOpponent]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };
  if (!isFetchedOpponent) return <> Loading moves...</>;

  if (!isFetched) return <> Loading moves...</>;
  if (!opponentPokemons && gameMode == GameModes.vsPlayer)
    return <>Loading opponent moves...</>;

  return (
    <div className="movesSelectContainer">
      {/* <div className="spacer">
        <PokemonInfo
          pokemon={selectedPokemon}
          style={{ display: "none" }}
        ></PokemonInfo>
      </div> */}
      {isAlert && (
        <AlertScreen
          text={`In this stage you have to select moves to every pokemon. \n
            Now you see opponent's pokemons but you do not know his moves. \n
            Press left and right arrows to change pokemons and top and bottom arrow to change moves. \n
            Press z to select move. The index of primary and secondary are changed every move select. \n
            Primary moves have 80% chance to be selected during fight, secondary have 20%. \n
            Press z to continue.
            `}
        />
      )}
      <div className="pokemons-moves">
        <div className="pokemons">
          <IconList
            pokemons={pokemons}
            onSelectPokemon={handleSelectPokemon}
            isRow={true}
            imageStyle={{ transform: "scaleX(-1)" }}
            isReserved={true}
            withMoves={false}
          />
          <IconList
            pokemons={opponentPokemons}
            isRow={true}
            withMoves={false}
            isKeyboard={false}
          />
        </div>
        <div className="selectedMoves-button">
          <SelectedTwoMoves
            primaryMove={
              selectedPokemon.moves[selectedMoves[selectedPokemon.name][0]].name
            }
            secondaryMove={
              selectedPokemon.moves[selectedMoves[selectedPokemon.name][1]].name
            }
          />
          <div className="moves">
            <MovesList
              moves={selectedPokemon.moves}
              selectedIndex={selectedIndex}
              //style={{ marginLeft: "10%" }}
            />
            <MoveInfo move={selectedPokemon.moves[selectedIndex]}></MoveInfo>
          </div>
          <button
            className="confirmButton"
            id="bottom"
            onClick={handleConfirmAll}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovesSelect;
