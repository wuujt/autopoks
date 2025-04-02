interface PokemonAPIResponse {
  moves: MoveApi[];
}

interface MoveApi {
  move: {
    name: string;
    url: string;
  };
}
interface TypeApi {
  name: string;
  url: string;
}
// interface damageClass {
//   name: string;
//   url: string;
// }
interface MoveDataByUrl {
  accuracy: number;
  power: number;
  type: TypeApi;
  name: string;
  description: string;
  damage_class: DamageClass;
}
class DamageClass {
  name: string;
  icon: string;
  constructor(name: string, icon: string) {
    this.icon = icon;
    this.name = name;
  }
  static damageClasses: Map<string, DamageClass> = new Map();
}

export class Move {
  name: string;
  description: string;
  power: number;
  accuracy: number;
  type: string;
  damageClass: DamageClass;

  constructor(
    name: string,
    description: string,
    power: number,
    accuracy: number,
    type: string,
    damageClass?: DamageClass
  ) {
    this.name = name;
    this.description = description;
    this.power = power;
    this.accuracy = accuracy;
    this.type = type;

    this.damageClass = damageClass || new DamageClass("", "");
  }

  static async GetMovesFromApi(pokemonName: string): Promise<Move[]> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );

      const moves: Move[] = [];
      const data = (await response.json()) as PokemonAPIResponse;
      for (const move of data.moves) {
        const moveData = await this.GetMovesFromApiByUrl(move.move.url);

        moves.push(moveData);
      }
      return moves;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch Move data");
    }
  }

  static async GetMovesFromApiByUrl(url: string): Promise<Move> {
    try {
      const response = await fetch(`${url}`);

      const data = (await response.json()) as MoveDataByUrl;
      const damageClassName = data.damage_class.name;
      let damageClass;
      if (DamageClass.damageClasses.get(damageClassName))
        damageClass = DamageClass.damageClasses.get(damageClassName);
      else {
        const damageClassConst = new DamageClass(
          data.damage_class.name,
          data.damage_class.icon
        );
        DamageClass.damageClasses.set(damageClassConst.name, damageClassConst);
        damageClass = damageClassConst;
      }
      return new Move(
        data.name,
        data.description,
        data.power,
        data.accuracy,
        data.type.name,
        damageClass
      );
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch Move data");
    }
  }
}
