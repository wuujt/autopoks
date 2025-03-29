"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const moves_1 = require("./moves");
const ws_1 = require("ws");
class Player {
    constructor(id, socket, pokemons = []) {
        this.isSelectedPokemons = false;
        this.isSelectedMoves = false;
        this.isSelectedOrder = false;
        this.id = id;
        this.socket = socket;
        this.pokemons = pokemons;
        // this.socket.onmessage = (event) => {
        //   this.handleMessage(event.data);
        // };
    }
    set _pokemons(_pokemons) {
        this.pokemons = _pokemons;
    }
    sendMessage(message) {
        if (this.socket.readyState === ws_1.WebSocket.OPEN)
            this.socket.send(message);
    }
    handleMessage(message) {
        console.log(`Received message:`, message);
    }
    changeOrder(data) {
        const newOrder = [];
        data.indexes.forEach((index) => {
            if (index < this.pokemons.length) {
                newOrder.push(this.pokemons[index]);
            }
        });
        this.pokemons = newOrder;
    }
    setMovesFromJSON(data) {
        this.pokemons.forEach((pokemon, index) => {
            const primaryMoveData = data.primaryMoves[index];
            const secondaryMoveData = data.secondaryMoves[index];
            pokemon.primaryMove = new moves_1.Move(primaryMoveData.name, "", // Assuming an empty string is needed here for some reason
            primaryMoveData.power, primaryMoveData.accuracy, primaryMoveData.type, primaryMoveData.damageClass.name);
            pokemon.secondaryMove = new moves_1.Move(secondaryMoveData.name, "", secondaryMoveData.power, secondaryMoveData.accuracy, secondaryMoveData.type, primaryMoveData.damageClass.name);
        });
    }
}
exports.Player = Player;
