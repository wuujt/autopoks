import { Move } from "./moves";
import PokemonType from "./type";
interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}
interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}
interface PokemonAPIResponse {
  name: string;
  stats: Stat[];
  sprites: {
    front_default: string;
  };
  types: Type[];
}
interface PokemonAPIResponseNumber {
  results: Result[];
}
interface Result {
  name: string;
}
export class Pokemon {
  level: number;
  name: string;
  //base stats
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;

  //actual stats
  actualHp: number;
  actualAttack: number;
  actualDefense: number;
  actualSpecialAttack: number;
  actualSpecialDefense: number;
  actualSpeed: number;
  iconSelect: string;
  moves: Move[];
  primaryMove: Move | undefined;
  secondaryMove: Move | undefined;
  type1: PokemonType;
  type2: PokemonType;
  constructor(
    name: string = "",
    hp: number = 0,
    attack: number = 0,
    level: number = 0,
    defense: number = 0,
    specialAttack: number = 0,
    specialDefense: number = 0,
    speed: number = 0,
    iconSelect: string = "",
    type1: PokemonType,
    type2: PokemonType,
    moves: Move[] = []
  ) {
    this.name = name;
    this.hp = hp;
    this.attack = attack;
    this.level = level;
    this.defense = defense;
    this.specialAttack = specialAttack;
    this.specialDefense = specialDefense;
    this.speed = speed;
    this.iconSelect = iconSelect;
    this.moves = moves;
    this.type1 = type1;
    this.type2 = type2;
    this.level = 50;
    this.actualHp =
      Math.floor((2 * this.hp * this.level) / 100) + this.level + 10;
    this.actualAttack = this.calculateOtherStats(this.attack);
    this.actualDefense = this.calculateOtherStats(this.defense);
    this.actualSpecialAttack = this.calculateOtherStats(this.specialAttack);
    this.actualSpecialDefense = this.calculateOtherStats(this.specialDefense);
    this.actualSpeed = this.calculateOtherStats(this.speed);
  }

  static async fromAPI(pokemonName: string): Promise<Pokemon> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      const data = (await response.json()) as PokemonAPIResponse;

      const name = data.name;
      const hp =
        data.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0;
      const attack =
        data.stats.find((stat) => stat.stat.name === "attack")?.base_stat || 0;
      const defense =
        data.stats.find((stat) => stat.stat.name === "defense")?.base_stat || 0;
      const specialAttack =
        data.stats.find((stat) => stat.stat.name === "special-attack")
          ?.base_stat || 0;
      const specialDefense =
        data.stats.find((stat) => stat.stat.name === "special-defense")
          ?.base_stat || 0;
      const speed =
        data.stats.find((stat) => stat.stat.name === "speed")?.base_stat || 0;
      const iconSelect = data.sprites.front_default;
      console.log(data.types);
      const type1 = data.types.find((type) => type.slot === 1)?.type || {
        name: "",
        url: "",
      };
      const type2 = data.types.find((type) => type.slot === 2)?.type || {
        name: "",
        url: "",
      };
      if (type1 && PokemonType.types.get(type1.name) === undefined) {
        const type = new PokemonType(type1?.name, type1?.url);
        PokemonType.types.set(type.name, type);
      }

      if (type2 && PokemonType.types.get(type2.name) === undefined) {
        const type = new PokemonType(type2?.name, type2?.url);
        PokemonType.types.set(type.name, type);
      }
      const _type1 =
        PokemonType.types.get(type1?.name) ?? new PokemonType("unknown", "");
      const _type2 =
        PokemonType.types.get(type2?.name) ?? new PokemonType("unknown", "");

      return new Pokemon(
        name,
        hp,
        attack,
        50,
        defense,
        specialAttack,
        specialDefense,
        speed,
        iconSelect,
        _type1,
        _type2
      );
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch Pokémon data");
    }
  }

  static async getPokemonsFromApi(count: string): Promise<Pokemon[]> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${count}&offset=0`
      );
      const data = (await response.json()) as PokemonAPIResponseNumber;

      const pokemons: Pokemon[] = [];
      for (const result of data.results) {
        const pokemon = await this.fromAPI(result.name);
        pokemons.push(pokemon);
      }
      return pokemons;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch Pokémon data");
    }
  }

  set _moves(value: Move[]) {
    this.moves = value;
  }

  set _primaryMove(value: Move) {
    this.primaryMove = value;
  }

  set _secondaryMove(value: Move) {
    this.secondaryMove = value;
  }

  calculateOtherStats(base: number): number {
    const stat = Math.floor((2 * base * this.level) / 100) + 5;
    return stat;
  }
  async fetchMoves(): Promise<void> {
    this.moves = await Move.GetMovesFromApi(this.name);
  }
}
