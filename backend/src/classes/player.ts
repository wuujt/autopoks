import { Move } from "./moves";
import { Pokemon } from "./pokemon";
import { WebSocketServer, WebSocket } from "ws";

export class Player {
  id: number;
  socket: WebSocket;
  pokemons: Pokemon[];
  isSelectedPokemons: boolean = false;
  isSelectedMoves: boolean = false;

  isSelectedOrder: boolean = false;
  order: number[] = [];
  reversedInt = [5, 4, 3, 2, 1, 0];

  constructor(id: number, socket: WebSocket, pokemons: Pokemon[] = []) {
    this.id = id;
    this.socket = socket;
    this.pokemons = pokemons;

    // this.socket.onmessage = (event) => {
    //   this.handleMessage(event.data);
    // };
  }

  public set _pokemons(_pokemons: Pokemon[]) {
    this.pokemons = _pokemons;
  }
  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) this.socket.send(message);
  }

  private handleMessage(message: string) {
    console.log(`Received message:`, message);
  }

  public changeOrder(data: indexesData): void {
    this.order = data.indexes;
    const newOrder: Pokemon[] = [];
    data.indexes.forEach((index) => {
      if (index < this.pokemons.length) {
        newOrder.push(this.pokemons[index]);
      }
    });
    this.pokemons = newOrder;
  }
  setMovesFromJSON(data: movesData): void {
    this.pokemons.forEach((pokemon, index) => {
      const primaryMoveData = data.primaryMoves[index];
      const secondaryMoveData = data.secondaryMoves[index];

      pokemon.primaryMove = new Move(
        primaryMoveData.name,
        "", // Assuming an empty string is needed here for some reason
        primaryMoveData.power,
        primaryMoveData.accuracy,
        primaryMoveData.type,
        primaryMoveData.damageClass.name
      );
      pokemon.secondaryMove = new Move(
        secondaryMoveData.name,
        "",
        secondaryMoveData.power,
        secondaryMoveData.accuracy,
        secondaryMoveData.type,
        primaryMoveData.damageClass.name
      );
    });
  }
}

interface indexesData {
  indexes: number[];
}

interface moves {
  name: string;
  power: number;
  accuracy: number;
  type: string;
  damageClass: { name: string };
}

interface movesData {
  data: string;
  status: string;
  primaryMoves: moves[];
  secondaryMoves: moves[];
}
