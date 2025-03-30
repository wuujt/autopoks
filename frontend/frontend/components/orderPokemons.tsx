import React, { useEffect, useState } from "react";
import IconList from "./selectedList";
import { Pokemon } from "../classes/pokemon";
import { useCustomWebSocket } from "../socketService";
import { Move } from "../classes/moves";
import "./orderPokemon.css";
import AlertScreen from "./alertScreen";
interface OrderPokemonsProps {
  pokemons: Pokemon[];
  onSelectOrderCallback: (
    selectedOrder: Pokemon[],
    opponentPokemons: Pokemon[]
  ) => void;
}
interface movesFromServer {
  name: string;
  description: string;
  power: number;
  accuracy: number;
  type: string;
}
const OrderPokemon: React.FC<OrderPokemonsProps> = ({
  pokemons,
  onSelectOrderCallback,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [pokemonsOrder, setPokemonsOrder] = useState<Pokemon[]>(pokemons);
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [opponentPokemons, setOpponentPokemons] = useState<Pokemon[]>([]);

  const { sendJsonMessage, lastMessage } = useCustomWebSocket();

  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);

  const [isFetchedOpponent, setIsFetchedOpponent] = useState<boolean>(false);
  // const [pokemonsReversed, setPokemonsReversed] = useState<Pokemon[]>(
  //   [...pokemons].reverse()
  // );
  const reversedInt = [5, 4, 3, 2, 1, 0];
  const [isAlert, setIsAlert] = useState(true);

  useEffect(() => {
    sendJsonMessage({ type: "get", status: "OpponentOrder" });
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, selectedIndex]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "ArrowRight") {
      setCurrentIndex((prev) => Math.min(prev + 1, pokemons.length - 1));
    } else if (event.key === "z" || event.key === "Z") {
      if (isAlert) setIsAlert(false);
      else handleConfirmPokemon();
    }
  };
  const handleConfirmPokemon = () => {
    if (isSelected) {
      const newPokemonsOrder = [...pokemonsOrder];
      newPokemonsOrder[reversedInt[currentIndex]] =
        pokemonsOrder[reversedInt[selectedIndex]];
      newPokemonsOrder[reversedInt[selectedIndex]] =
        pokemonsOrder[reversedInt[currentIndex]];
      const newOrder = [...order];
      newOrder[reversedInt[currentIndex]] = order[reversedInt[selectedIndex]];
      newOrder[reversedInt[selectedIndex]] = order[reversedInt[currentIndex]];
      setPokemonsOrder(newPokemonsOrder);
      console.log(newOrder);

      setOrder(newOrder);
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(currentIndex);
    }
    console.log(selectedIndex);

    setIsSelected(!isSelected);
  };

  const handleConfirmAll = () => {
    sendJsonMessage({ type: "game", status: "selectedOrder", indexes: order });
    setIsWaitingForOpponent(true);
  };

  useEffect(() => {
    console.log(lastMessage);

    if (lastMessage && lastMessage.data === "OpponentSelectedOrder") {
      onSelectOrderCallback(pokemonsOrder, opponentPokemons);
    } else if (lastMessage && lastMessage.data) {
      const message = JSON.parse(lastMessage.data);
      if (message.type === "pokemonsOrder")
        fetchPokemonsAndMoves(
          message.names,
          message.primaryMoves,
          message.secondaryMoves
        );
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isWaitingForOpponent) alert("Waiting for opponent");
  }, [isWaitingForOpponent]);

  const fetchPokemonsAndMoves = async (
    names: string[],
    primaryMoves: movesFromServer[],
    secondaryMoves: movesFromServer[]
  ) => {
    try {
      const pokemons = await Promise.all(
        names.map((name: string) => Pokemon.fromAPI(name))
      );

      const fetchedPrimaryMoves = await Promise.all(
        primaryMoves.map(
          (move: movesFromServer) =>
            new Move(
              move.name,
              move.description,
              move.power,
              move.accuracy,
              move.type
            )
        )
      );

      const fetchedSecondaryMoves = await Promise.all(
        secondaryMoves.map(
          (move: movesFromServer) =>
            new Move(
              move.name,
              move.description,
              move.power,
              move.accuracy,
              move.type
            )
        )
      );

      pokemons.forEach((pokemon, index) => {
        console.log(index);
        pokemon.primaryMove = fetchedPrimaryMoves[index];
        pokemon.secondaryMove = fetchedSecondaryMoves[index];
      });

      setOpponentPokemons(pokemons);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    }
  };
  useEffect(() => {
    setIsFetchedOpponent(true);
  }, [opponentPokemons]);

  if (!isFetchedOpponent) return <> Loading...</>;

  return (
    <div className="orderPokemonsContainer">
      {isAlert && (
        <AlertScreen
          text={`In this stage you have to select order of your pokemons. This is the last stage before fight \n
            You see opponent's pokemons and their moves but you do not know his order. \n
            Press left and right arrows to change pokemons. \n
            Press z to select pokemon and press again to change order with another pokemons. \n
            Press z to continue.`}
        />
      )}
      <div className="pokemons-moves">
        <div className="pokemons">
          <IconList
            pokemons={pokemonsOrder}
            isRow={true}
            imageStyle={{ transform: "scaleX(-1)" }}
            isReserved={true}
          />
          <IconList
            pokemons={opponentPokemons}
            isRow={true}
            isKeyboard={false}
          />
        </div>
        <button className="confirmButton" id="top" onClick={handleConfirmAll}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default OrderPokemon;
