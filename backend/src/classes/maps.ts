import { WebSocketServer, WebSocket } from "ws";
import { Player } from "./player";
import { Game } from "./game";

export class Maps {
  private static playerSocket: Map<WebSocket, Player> = new Map();
  private static playerOpponent: Map<Player, Player> = new Map();
  private static playerToGame: Map<Player, Game> = new Map();

  //playerSocket
  static addPlayerSocket(socket: WebSocket, player: Player): void {
    this.playerSocket.set(socket, player);
  }

  static removePlayerSocket(socket: WebSocket): void {
    this.playerSocket.delete(socket);
  }

  static getPlayerFromPlayerSocket(socket: WebSocket): Player | undefined {
    return this.playerSocket.get(socket);
  }

  //playerOpponent
  static addPlayerOpponent(player1: Player, player2: Player): void {
    this.playerOpponent.set(player1, player2);
    this.playerOpponent.set(player2, player1);
  }

  static removePlayerOpponent(player: Player): void {
    const opponent = this.playerOpponent.get(player);
    if (opponent) {
      this.playerOpponent.delete(opponent);
    }
    this.playerOpponent.delete(player);
  }

  static getPlayerOpponent(player: Player): Player | undefined {
    return this.playerOpponent.get(player);
  }

  //playerGameId
  static addPlayerToGameId(player: Player, game: Game): void {
    this.playerToGame.set(player, game);
  }

  static removerPlayerToGame(player: Player): void {
    this.playerToGame.delete(player);
  }

  static getPlayerToGame(player: Player): Game | undefined {
    return this.playerToGame.get(player);
  }

  //operations between maps
  static getGameFromWebsocket(ws: WebSocket): Game | undefined {
    const player = this.getPlayerFromPlayerSocket(ws);
    if (player) return this.getPlayerToGame(player);
  }

  static getOpponentFromWebsocket(ws: WebSocket): Player | undefined {
    const player = this.getPlayerFromPlayerSocket(ws);
    if (player) return this.getPlayerOpponent(player);
  }
}
