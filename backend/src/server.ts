import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Game } from "./classes/game";
import { Queue } from "./classes/queue";
import { Player } from "./classes/player";
import { Maps } from "./classes/maps";
import { Pokemon } from "./classes/pokemon";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const EventEmitter = require("events");
const gameEvent = new EventEmitter();

export interface Client {
  id: number;
  ws: WebSocket;
}

var id = 0;
const clients = new Map<number, Client>();
const clients2 = new Map<WebSocket, Client>();

function getClientById(id: number): Client | undefined {
  const client = clients.get(id);
  if (client) {
    return client;
  }
  return undefined;
}

function getClientBySocket(ws: WebSocket): Client | undefined {
  const client = clients2.get(ws);
  if (client) {
    return client;
  }
  return undefined;
}

wss.on("connection", (ws: WebSocket) => {
  // Przypisanie id klienta i przechowywanie go w mapie
  clients.set(id, { id: id, ws });
  clients2.set(ws, { id: id, ws });

  id++;
  clients
    .get(0)
    ?.ws.send(JSON.stringify({ type: "chat", text: "Hello from server!" }));
  ws.send("test");
  console.log("Client connected");

  ws.on("message", async (message: string) => {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case "selected":

        case "queue":
          if (data.status === "add") {
            var p = getClientBySocket(ws);
            Queue.addPlayer(p);
          }
        case "game":
          if (data.status == "selectedPokemons") {
            const player = Maps.getPlayerFromPlayerSocket(ws);
            const pokemons = Game.createPokemonsFromJSON(data);
            if (player) player._pokemons = pokemons;
            if (player) player.sendMessage("selectedPokemons");
            if (player) Game.playerSelectedPokemons(player);
          }

          if (data.status == "selectedMoves") {
            const player = Maps.getPlayerFromPlayerSocket(ws);
            const game = Maps.getGameFromWebsocket(ws);
            if (player) player.setMovesFromJSON(data);
            if (player) Game.playerSelectedMoves(player);
          }
          if (data.status === "selectedOrder") {
            const player = Maps.getPlayerFromPlayerSocket(ws);
            const game = Maps.getGameFromWebsocket(ws);
            if (player) player.changeOrder(data);

            if (player) Game.playerSelectedOrder(player);
          }
        case "get":
          if (data.status == "OpponentPokemons") {
            const player = Maps.getPlayerFromPlayerSocket(ws);
            const opponent = Maps.getOpponentFromWebsocket(ws);

            player?.sendMessage(
              JSON.stringify({
                type: "pokemonsName",
                names: opponent?.pokemons.map((pokemon) => pokemon.name),
              })
            );
          }
          if (data.status == "OpponentOrder") {
            const player = Maps.getPlayerFromPlayerSocket(ws);
            const opponent = Maps.getOpponentFromWebsocket(ws);

            player?.sendMessage(
              JSON.stringify({
                type: "pokemonsOrder",
                names: opponent?.pokemons.map((pokemon) => pokemon.name),
                primaryMoves: opponent?.pokemons.map(
                  (pokemon) => pokemon.primaryMove
                ),
                secondaryMoves: opponent?.pokemons.map(
                  (pokemon) => pokemon.secondaryMove
                ),
              })
            );
          }

          if (data.status == "FightResult") {
            const game = Maps.getGameFromWebsocket(ws);
            console.log(game?.player2.isSelectedOrder);
            console.log(game?.player1.isSelectedOrder);
            if (
              ws === game?.player2.socket &&
              game.player1.isSelectedOrder &&
              game.player2.isSelectedOrder
            ) {
              game.requestCounter[1] = true;
              gameEvent.emit("fightReady", game);
            }

            if (ws === game?.player1.socket) {
              gameEvent.once("fightReady", (game: Game) => {
                const p1 = game.player1Points;
                const p2 = game.player2Points;
                game?.Round();

                game?.player1.sendMessage(
                  JSON.stringify({
                    type: "fightResult",
                    player: "player1",
                    messages: game.messages,
                    player1_points: p1,
                    player2_points: p2,
                    order: game.player2.order,
                  })
                );
                game?.player2.sendMessage(
                  JSON.stringify({
                    type: "fightResult",
                    player: "player2",
                    messages: game.messages,
                    player1_points: p1,
                    player2_points: p2,
                    order: game.player1.order,
                  })
                );
              });
            }
          }

        default:
        // console.log("Unknown event type:", data.type);
      }
    } catch (error) {
      //console.error("Invalid JSON message received:", message);
    }
  });

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
