"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maps = void 0;
class Maps {
    //playerSocket
    static addPlayerSocket(socket, player) {
        this.playerSocket.set(socket, player);
    }
    static removePlayerSocket(socket) {
        this.playerSocket.delete(socket);
    }
    static getPlayerFromPlayerSocket(socket) {
        return this.playerSocket.get(socket);
    }
    //playerOpponent
    static addPlayerOpponent(player1, player2) {
        this.playerOpponent.set(player1, player2);
        this.playerOpponent.set(player2, player1);
    }
    static removePlayerOpponent(player) {
        const opponent = this.playerOpponent.get(player);
        if (opponent) {
            this.playerOpponent.delete(opponent);
        }
        this.playerOpponent.delete(player);
    }
    static getPlayerOpponent(player) {
        return this.playerOpponent.get(player);
    }
    //playerGameId
    static addPlayerToGameId(player, game) {
        this.playerToGame.set(player, game);
    }
    static removerPlayerToGame(player) {
        this.playerToGame.delete(player);
    }
    static getPlayerToGame(player) {
        return this.playerToGame.get(player);
    }
    //operations between maps
    static getGameFromWebsocket(ws) {
        const player = this.getPlayerFromPlayerSocket(ws);
        if (player)
            return this.getPlayerToGame(player);
    }
    static getOpponentFromWebsocket(ws) {
        const player = this.getPlayerFromPlayerSocket(ws);
        if (player)
            return this.getPlayerOpponent(player);
    }
}
exports.Maps = Maps;
Maps.playerSocket = new Map();
Maps.playerOpponent = new Map();
Maps.playerToGame = new Map();
