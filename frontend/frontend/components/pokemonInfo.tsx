import React from "react";
import { Pokemon } from "../classes/pokemon";
import "./pokemonInfo.css";
interface pokemonInfoProp {
  pokemon: Pokemon;
  style?: React.CSSProperties;
}

const PokemonInfo: React.FC<pokemonInfoProp> = ({ pokemon, style }) => {
  return (
    <div className="pokemonInfoContainer" style={style}>
      <img className="pokemonIconInfo" src={pokemon.iconSelect}></img>
      <div className="pokemonStats">
        <p>Name : {pokemon.name}</p>
        <p>
          Type:{" "}
          <img className="pokemonTypeIcon" src={pokemon.type1.iconUrl}></img>
          {pokemon.type2 && (
            <img className="pokemonTypeIcon" src={pokemon.type2.iconUrl}></img>
          )}
        </p>

        <p>Hp: {pokemon.hp} </p>
        <p>Attack: {pokemon.attack}</p>
        <p>Defense: {pokemon.defense}</p>
        <p>Special attack: {pokemon.specialAttack}</p>
        <p>Special defense: {pokemon.specialDefense}</p>
        <p>Speed: {pokemon.speed}</p>
      </div>
    </div>
  );
};

export default PokemonInfo;
