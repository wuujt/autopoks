export class Move {
  name: string;
  description: string;
  power: number;
  accuracy: number;
  type: string;
  damageClass: string;
  constructor(
    name: string,
    despription: string,
    power: number,
    accuracy: number,
    type: string,
    damageClass: string
  ) {
    this.name = name;
    this.description = despription;
    this.power = power;
    this.accuracy = accuracy;
    this.type = type;
    this.damageClass = damageClass;
  }
}
