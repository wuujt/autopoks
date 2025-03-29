import { Move } from "./moves";
import PokemonType from "./type";

export class Pokemon {
  name: string;
  level: number;
  //base
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
  moves: Move[] = [];
  primaryMove: Move | null = null; // Set default to null
  secondaryMove: Move | null = null; // Set default to null
  type1: PokemonType;
  type2: PokemonType;
  constructor(
    name: string,
    hp: number,
    attack: number,
    level: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number,
    iconSelect: string,

    type1: PokemonType,
    type2: PokemonType,
    primaryMove?: Move,
    secondaryMove?: Move
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

    this.primaryMove = primaryMove || null;
    this.secondaryMove = secondaryMove || null;

    this.type1 = type1;
    this.type2 = type2;
    this.level = 50;

    this.actualHp =
      Math.floor((2 * this.hp * this.level) / 100) + this.level + 10;
    this.actualAttack = Pokemon.calculateOtherStats(this.attack, this.level);
    this.actualDefense = Pokemon.calculateOtherStats(this.defense, this.level);
    this.actualSpecialAttack = Pokemon.calculateOtherStats(
      this.specialAttack,
      this.level
    );
    this.actualSpecialDefense = Pokemon.calculateOtherStats(
      this.specialDefense,
      this.level
    );
    this.actualSpeed = Pokemon.calculateOtherStats(this.speed, this.level);
  }

  static calculateOtherStats(base: number, level: number): number {
    const stat = Math.floor((2 * base * level) / 100) + 5;
    return stat;
  }
  //0 if primary 1 if secondary
  static drawAttack(): number {
    return Math.random() < 0.8 ? 0 : 1;
  }
}
