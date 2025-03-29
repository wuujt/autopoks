import React, { useEffect, useState } from "react";
import IconList from "../selectedList";
import { Pokemon } from "../../classes/pokemon";
import { useCustomWebSocket } from "../../socketService";
import TextBox from "../textBox";
import "./fight.css";
interface FightProp {
  pokemons: Pokemon[];
  opponentPokemons: Pokemon[];
}

const Fight: React.FC<FightProp> = ({ pokemons, opponentPokemons }) => {
  const [hp, setHp] = useState<number>(0);
  const [opponentHp, setOpponentHp] = useState<number>(0);

  const [maxHp, setMaxHp] = useState<number>(0);
  const [opponentMaxHp, setOpponentMaxHp] = useState<number>(0);

  const [points, setPoints] = useState<number>(0);
  const [opponentPoints, setOpponentPoints] = useState<number>(0);

  const [currentPokemon, setCurrentPokemon] = useState<Pokemon>(pokemons[0]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);

  const [isFetchedFight, setIsFetchedFight] = useState(false);
  const [fightResult, setFightResult] = useState([]);
  const [player, setPlayer] = useState("");
  const [textToDisplay, setTextToDisplay] = useState("");
  const [pokemonsReversed, setPokemonsReversed] = useState<Pokemon[]>(
    [...pokemons].reverse()
  );
  const { sendJsonMessage, lastMessage, readyState } = useCustomWebSocket();

  useEffect(() => {
    console.log("Sending JSON...");
    sendJsonMessage({ type: "get", status: "FightResult" });
    setHp(pokemons[0].actualHp);
    setMaxHp(pokemons[0].actualHp);

    setOpponentHp(opponentPokemons[0].actualHp);
    setOpponentMaxHp(opponentPokemons[0].actualHp);
  }, []);

  useEffect(() => {
    if (currentMessageIndex < fightResult.length) {
      const msg = fightResult[currentMessageIndex];
      setCurrentMessage(msg);
    }
  }, [currentMessageIndex]);

  useEffect(() => {
    if (!currentMessage) return;
    const playerMessage = currentMessage.player;

    let attack;

    switch (currentMessage.event) {
      case "attack":
        const attackNumber = currentMessage.attack;

        if (player === playerMessage) {
          setOpponentHp((prev) => Math.max(0, prev - currentMessage.damage));
          if (attackNumber == "0") attack = pokemons[0].primaryMove?.name;
          if (attackNumber == "1") attack = pokemons[0].secondaryMove?.name;
        } else {
          setHp((prev) => Math.max(0, prev - currentMessage.damage));
          if (attackNumber == "0")
            attack = opponentPokemons[0].primaryMove?.name;
          if (attackNumber == "1")
            attack = opponentPokemons[0].secondaryMove?.name;
        }

        const text = `${currentMessage.user} used ${attack}, damage done ${currentMessage.damage}`;
        setTextToDisplay(text);

        break;
      case "change":
        if (player === playerMessage) {
          if (pokemons.length === 1) {
            const pokemonName = pokemons[0].name;

            pokemons.shift();

            const text = `Pokemon ${pokemonName} has been perished \n There is no more available pokemons.`;
            setTextToDisplay(text);
          } else {
            const pokemonName = pokemons[0].name;
            const pokemonToChange = pokemons[1].name;
            const text = `Pokemon ${pokemonName} has been perished \n Change to ${pokemonToChange}`;
            setTextToDisplay(text);
            pokemons.shift();
            setHp(pokemons[0].actualHp);
            setMaxHp(pokemons[0].actualHp);
          }
        } else {
          if (opponentPokemons.length === 1) {
            const pokemonName = opponentPokemons[0].name;

            opponentPokemons.shift();
            const text = `Pokemon ${pokemonName} has been perished \n There is no more available pokemons.`;
            setTextToDisplay(text);
          } else {
            const pokemonName = opponentPokemons[0].name;
            const pokemonToChange = opponentPokemons[1].name;
            const text = `Pokemon ${pokemonName} has been perished \n Change to ${pokemonToChange}`;
            setTextToDisplay(text);
            opponentPokemons.shift();
            setOpponentHp(opponentPokemons[0].actualHp);
            setOpponentMaxHp(opponentPokemons[0].actualHp);
          }
        }
        break;
      case "game_ended":
        // Handle game ended event
        break;
      default:
        // Optionally handle unknown events
        break;
    }
  }, [currentMessage]);

  useEffect(() => {
    console.log(lastMessage);
    if (lastMessage && lastMessage.data) {
      const message = JSON.parse(lastMessage.data);
      if (message.type === "fightResult") {
        const player = message.player;
        setPlayer(player);
        const parsedMessages = message.messages.map((msg) => JSON.parse(msg));
        setFightResult(parsedMessages);
        setIsFetchedFight(true);
        if (message.player === "player1") {
          setPoints(message.player1_points);
          setOpponentPoints(message.player2_points);
        } else {
          setPoints(message.player1_points);
          setOpponentPoints(message.player2_points);
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "z" || event.key === "Z") {
        setCurrentMessageIndex((prev) => prev + 1);
      }
      if (event.key === "x" || event.key === "X")
        setCurrentMessageIndex((prev) => prev - 1);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isFetchedFight) return <p>waiting for data</p>;
  else
    return (
      <div className="fightContainer">
        <div className="healthBars-score">
          <div className="healthBarFull" id="your">
            <div
              className="healthBarPercent"
              style={{ width: `${(hp / maxHp) * 100}%` }}
            ></div>
            <p className="hpPoints">
              {hp}/{maxHp}
            </p>
          </div>
          <div className="score">
            <p>
              {points}:{opponentPoints}
            </p>
          </div>
          <div className="healthBarFull" id="opponent">
            <div
              className="healthBarPercent"
              style={{ width: `${(opponentHp / opponentMaxHp) * 100}%` }}
            ></div>
            <p className="hpPoints" id="opponentHpPoints">
              {opponentHp}/{opponentMaxHp}
            </p>
          </div>
        </div>
        <div className="pokemons-moves">
          <div className="pokemons">
            <IconList
              pokemons={pokemons}
              isRow={true}
              imageStyle={{ transform: "scaleX(-1)" }}
              isReserved={true}
            ></IconList>
            <IconList pokemons={opponentPokemons} isRow={true}></IconList>
          </div>
        </div>
        <TextBox text={textToDisplay}></TextBox>
      </div>
    );
};

export default Fight;
