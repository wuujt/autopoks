"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const game_1 = require("./classes/game");
const queue_1 = require("./classes/queue");
const maps_1 = require("./classes/maps");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const EventEmitter = require("events");
const gameEvent = new EventEmitter();
var id = 0;
const clients = new Map();
const clients2 = new Map();
function getClientById(id) {
    const client = clients.get(id);
    if (client) {
        return client;
    }
    return undefined;
}
function getClientBySocket(ws) {
    const client = clients2.get(ws);
    if (client) {
        return client;
    }
    return undefined;
}
wss.on("connection", (ws) => {
    var _a;
    // Przypisanie id klienta i przechowywanie go w mapie
    clients.set(id, { id: id, ws });
    clients2.set(ws, { id: id, ws });
    id++;
    (_a = clients
        .get(0)) === null || _a === void 0 ? void 0 : _a.ws.send(JSON.stringify({ type: "chat", text: "Hello from server!" }));
    ws.send("test");
    console.log("Client connected");
    ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = JSON.parse(message);
            switch (data.type) {
                case "selected":
                case "queue":
                    if (data.status === "add") {
                        var p = getClientBySocket(ws);
                        queue_1.Queue.addPlayer(p);
                    }
                case "game":
                    if (data.status == "selectedPokemons") {
                        const player = maps_1.Maps.getPlayerFromPlayerSocket(ws);
                        const pokemons = game_1.Game.createPokemonsFromJSON(data);
                        if (player)
                            player._pokemons = pokemons;
                        if (player)
                            player.sendMessage("selectedPokemons");
                        if (player)
                            game_1.Game.playerSelectedPokemons(player);
                    }
                    if (data.status == "selectedMoves") {
                        const player = maps_1.Maps.getPlayerFromPlayerSocket(ws);
                        const game = maps_1.Maps.getGameFromWebsocket(ws);
                        if (player)
                            player.setMovesFromJSON(data);
                        if (player)
                            game_1.Game.playerSelectedMoves(player);
                    }
                    if (data.status === "selectedOrder") {
                        const player = maps_1.Maps.getPlayerFromPlayerSocket(ws);
                        const game = maps_1.Maps.getGameFromWebsocket(ws);
                        if (player)
                            player.changeOrder(data);
                        if (player)
                            game_1.Game.playerSelectedOrder(player);
                    }
                case "get":
                    if (data.status == "OpponentPokemons") {
                        const player = maps_1.Maps.getPlayerFromPlayerSocket(ws);
                        const opponent = maps_1.Maps.getOpponentFromWebsocket(ws);
                        player === null || player === void 0 ? void 0 : player.sendMessage(JSON.stringify({
                            type: "pokemonsName",
                            names: opponent === null || opponent === void 0 ? void 0 : opponent.pokemons.map((pokemon) => pokemon.name),
                        }));
                    }
                    if (data.status == "OpponentOrder") {
                        const player = maps_1.Maps.getPlayerFromPlayerSocket(ws);
                        const opponent = maps_1.Maps.getOpponentFromWebsocket(ws);
                        player === null || player === void 0 ? void 0 : player.sendMessage(JSON.stringify({
                            type: "pokemonsOrder",
                            names: opponent === null || opponent === void 0 ? void 0 : opponent.pokemons.map((pokemon) => pokemon.name),
                            primaryMoves: opponent === null || opponent === void 0 ? void 0 : opponent.pokemons.map((pokemon) => pokemon.primaryMove),
                            secondaryMoves: opponent === null || opponent === void 0 ? void 0 : opponent.pokemons.map((pokemon) => pokemon.secondaryMove),
                        }));
                    }
                    if (data.status == "FightResult") {
                        const game = maps_1.Maps.getGameFromWebsocket(ws);
                        if (ws === (game === null || game === void 0 ? void 0 : game.player2.socket)) {
                            game.requestCounter[1] = true;
                            gameEvent.emit("fightReady", game);
                        }
                        if (ws === (game === null || game === void 0 ? void 0 : game.player1.socket)) {
                            gameEvent.once("fightReady", (game) => {
                                const p1 = game.player1Points;
                                const p2 = game.player2Points;
                                game === null || game === void 0 ? void 0 : game.Round();
                                game === null || game === void 0 ? void 0 : game.player1.sendMessage(JSON.stringify({
                                    type: "fightResult",
                                    player: "player1",
                                    messages: game.messages,
                                    player1_points: p1,
                                    player2_points: p2,
                                }));
                                game === null || game === void 0 ? void 0 : game.player2.sendMessage(JSON.stringify({
                                    type: "fightResult",
                                    player: "player2",
                                    messages: game.messages,
                                    player1_points: p1,
                                    player2_points: p2,
                                }));
                            });
                        }
                    }
                default:
                // console.log("Unknown event type:", data.type);
            }
        }
        catch (error) {
            //console.error("Invalid JSON message received:", message);
        }
    }));
    ws.on("close", () => {
        console.log("Client disconnected");
        // Opcjonalnie usuwamy klienta z mapy, kiedy się rozłączy
        for (let [clientId, client] of clients.entries()) {
            if (client.ws === ws) {
                clients.delete(clientId);
                break;
            }
        }
    });
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
