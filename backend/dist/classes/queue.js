"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const game_1 = require("../classes/game");
const player_1 = require("./player");
const maps_1 = require("./maps");
class Queue {
    /**
     * Adds a player to the queue and attempts to find an opponent.
     * @param player - The player to be added to the queue.
     */
    static addPlayer(player) {
        if (!player)
            return;
        console.log(`Adding player to queue: ${player.id}`);
        this.playersInQueue.push(player);
        const opponent = this.findOpponent(player);
        if (opponent) {
            // Remove both players from the queue
            this.removePlayer(player);
            this.removePlayer(opponent);
            // Create player models
            const playerModel = new player_1.Player(player.id, player.ws);
            const opponentModel = new player_1.Player(opponent.id, opponent.ws);
            playerModel.sendMessage("OpponentFound");
            opponentModel.sendMessage("OpponentFound");
            console.log("Pairing players and adding them to the game");
            // Add players to the player map
            maps_1.Maps.addPlayerSocket(player.ws, playerModel);
            maps_1.Maps.addPlayerSocket(opponent.ws, opponentModel);
            maps_1.Maps.addPlayerOpponent(playerModel, opponentModel);
            maps_1.Maps.addPlayerOpponent(opponentModel, playerModel);
            // Start a new game with the paired players
            const game = new game_1.Game(playerModel, opponentModel);
            game_1.Game.liveGames.push(game);
            maps_1.Maps.addPlayerToGameId(playerModel, game);
            maps_1.Maps.addPlayerToGameId(opponentModel, game);
        }
    }
    /**
     * Removes a player from the queue.
     * @param player - The player to be removed.
     */
    static removePlayer(player) {
        this.playersInQueue = this.playersInQueue.filter((p) => p.id !== player.id);
    }
    /**
     * Returns the current list of players in the queue.
     */
    static getQueue() {
        return [...this.playersInQueue];
    }
    /**
     * Finds a player in the queue by their ID.
     * @param id - The ID of the player to search for.
     */
    static getPlayerById(id) {
        return this.playersInQueue.find((player) => player.id === id);
    }
    /**
     * Finds an available opponent for the given player.
     * @param player - The player looking for an opponent.
     */
    static findOpponent(player) {
        return this.playersInQueue.find((p) => p.id !== player.id);
    }
}
exports.Queue = Queue;
Queue.playersInQueue = [];
