import { Client } from "../server";
import { Game } from "../classes/game";
import { Player } from "./player";
import { Maps } from "./maps";

export class Queue {
  private static playersInQueue: Client[] = [];

  /**
   * Adds a player to the queue and attempts to find an opponent.
   * @param player - The player to be added to the queue.
   */
  static addPlayer(player: Client | undefined): void {
    if (!player) return;

    console.log(`Adding player to queue: ${player.id}`);
    this.playersInQueue.push(player);

    const opponent = this.findOpponent(player);

    if (opponent) {
      // Remove both players from the queue
      this.removePlayer(player);
      this.removePlayer(opponent);

      // Create player models
      const playerModel = new Player(player.id, player.ws);
      const opponentModel = new Player(opponent.id, opponent.ws);
      playerModel.sendMessage("OpponentFound");
      opponentModel.sendMessage("OpponentFound");
      console.log("Pairing players and adding them to the game");

      // Add players to the player map
      Maps.addPlayerSocket(player.ws, playerModel);
      Maps.addPlayerSocket(opponent.ws, opponentModel);

      Maps.addPlayerOpponent(playerModel, opponentModel);
      Maps.addPlayerOpponent(opponentModel, playerModel);
      // Start a new game with the paired players
      const game = new Game(playerModel, opponentModel);
      Game.liveGames.push(game);
      Maps.addPlayerToGameId(playerModel, game);
      Maps.addPlayerToGameId(opponentModel, game);
    }
  }

  /**
   * Removes a player from the queue.
   * @param player - The player to be removed.
   */
  static removePlayer(player: Client): void {
    this.playersInQueue = this.playersInQueue.filter((p) => p.id !== player.id);
  }

  /**
   * Returns the current list of players in the queue.
   */
  static getQueue(): Client[] {
    return [...this.playersInQueue];
  }

  /**
   * Finds a player in the queue by their ID.
   * @param id - The ID of the player to search for.
   */
  static getPlayerById(id: number): Client | undefined {
    return this.playersInQueue.find((player) => player.id === id);
  }

  /**
   * Finds an available opponent for the given player.
   * @param player - The player looking for an opponent.
   */
  static findOpponent(player: Client): Client | undefined {
    return this.playersInQueue.find((p) => p.id !== player.id);
  }
}
