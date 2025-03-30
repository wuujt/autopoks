import React, { useState, useEffect } from "react";
import IconGrid from "../components/pokemonGrid";
import MovesSelect from "../components/movesSelect/movesSelect";
import StartScreen from "../components/startScreen";
import OrderPokemons from "../components/orderPokemons";
import Fight from "../components/fight/fight.tsx";
import { Pokemon } from "../classes/pokemon";
import { useCustomWebSocket } from "../socketService.ts";
import "../components/startScreen.css";
import { modes } from "../classes/modes.tsx";
import "./styles.css";

const App: React.FC = () => {
  const [fetchedPokemons, setFetchedPokemons] = useState<Pokemon[]>([]);

  const [selectedPokemons, setSelectedPokemons] = useState<Pokemon[]>([]);
  const [opponentPokemons, setOpponentPokemons] = useState<Pokemon[]>([]);
  // const [pokemonChanged, setPokemonChanged] = useState<boolean>(false);
  // const [opponentPokemonsChanged, setOpponentPokemonsChanged] =
  //   useState<boolean>(false);

  const [mode, setMode] = useState<modes>(modes.start);
  const { lastMessage } = useCustomWebSocket();

  useEffect(() => {
    const fetchData = async () => {
      const pokemons = await Pokemon.getPokemonsFromApi("150");
      setFetchedPokemons(pokemons);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (lastMessage && lastMessage.data === "OpponentSelectedOrder") {
    }
  }, [lastMessage]);

  //Callbacks from child components

  //startScreenCallback
  const handlePlayClicked = () => {
    setMode((prevMode) => prevMode + 1);
  };

  //pokemonSelectScreenCallback
  const handleSelectPokemon = async (selectedPokemon: Pokemon[]) => {
    //mode changes after settingPokemons using useEffect
    setSelectedPokemons(selectedPokemon);
  };

  //SelectMovesScreenCallback
  const handleSelectMoves = async (
    selectedPokemon: Pokemon[],
    moves: { [key: string]: number[] }
  ) => {
    const pokemons = [...selectedPokemon];
    pokemons.forEach((pokemon) => {
      pokemon.primaryMove = pokemon.moves[moves[pokemon.name][0]];
      pokemon.secondaryMove = pokemon.moves[moves[pokemon.name][1]];
    });

    //mode changes after settingPokemons using useEffect
    setSelectedPokemons(pokemons);
  };

  //selectOrderScreenCallback
  const handleSelectOrder = async (
    selectedOrder: Pokemon[],
    opponentPokemons: Pokemon[]
  ) => {
    //mode changes after settingPokemons using useEffect
    selectedOrder = [...selectedOrder];
    opponentPokemons = [...opponentPokemons];
    setSelectedPokemons(selectedOrder);
    setOpponentPokemons(opponentPokemons);
  };

  //its to change
  // useEffect(() => {
  //   setOpponentPokemonsChanged(true);
  // }, [opponentPokemons]);

  // useEffect(() => {
  //   setPokemonChanged(true);
  // }, [selectedPokemons]);

  // useEffect(() => {
  //   if (mode != 0 && pokemonChanged && opponentPokemonsChanged) {
  //     setOpponentPokemonsChanged(false);
  //     setPokemonChanged(false);

  //     setMode((prevMode) => prevMode + 1);
  //   }

  // }, [pokemonChanged, opponentPokemonsChanged]);

  useEffect(() => {
    if (mode != 0) setMode((prevMode) => prevMode + 1);
  }, [selectedPokemons]);

  if (mode === 0) {
    return (
      <div className="container">
        <StartScreen playClickedCallback={handlePlayClicked}></StartScreen>
      </div>
    );
  }
  if (mode === 1) {
    return (
      <div className="container">
        <IconGrid
          pokemons={fetchedPokemons}
          onSelectPokemon={handleSelectPokemon}
        />
      </div>
    );
  }

  if (mode === 2) {
    return (
      <div className="container">
        <MovesSelect
          pokemons={selectedPokemons}
          onSelectMovesCallback={handleSelectMoves}
        ></MovesSelect>
      </div>
    );
  }
  if (mode === 3) {
    return (
      <div className="container">
        <OrderPokemons
          pokemons={selectedPokemons}
          onSelectOrderCallback={handleSelectOrder}
        ></OrderPokemons>
      </div>
    );
  }
  if (mode === 4) {
    return (
      <div className="container">
        <Fight
          pokemons={selectedPokemons}
          opponentPokemons={opponentPokemons}
        ></Fight>
      </div>
    );
  }
};

export default App;
