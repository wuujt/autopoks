"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const maps_1 = require("./maps");
const pokemon_1 = require("./pokemon");
const damage_1 = require("./damage");
class Game {
    constructor(player1, player2) {
        this.player1Pokemons = [];
        this.player2Pokemons = [];
        this.player1Points = 0;
        this.player2Points = 0;
        this.isRoundOver = false;
        this.counter = 0;
        this.messages = [];
        this.requestCounter = [false, false];
        this.gameId = Game.generateGameId();
        this.player1 = player1;
        this.player2 = player2;
        this.status = true; // Game starts as active
        this.result = "";
        this.round = 1; // Initial round
    }
    setPokemons() {
        this.player1Pokemons = this.player1.pokemons.map((pokemon) => (Object.assign({}, pokemon)));
        this.player2Pokemons = this.player2.pokemons.map((pokemon) => (Object.assign({}, pokemon)));
    }
    static generateGameId() {
        return this.nextId++;
    }
    Round() {
        this.isRoundOver = false;
        this.messages.splice(0, this.messages.length);
        this.setPokemons();
        while (!this.isRoundOver) {
            const player1Pokemon = this.player1Pokemons[0];
            const player2Pokemon = this.player2Pokemons[0];
            const player1PokemonAttack = pokemon_1.Pokemon.drawAttack();
            const player2PokemonAttack = pokemon_1.Pokemon.drawAttack();
            const player1Dmg = damage_1.Damage.calculateDamage(player1Pokemon, player2Pokemon, player1PokemonAttack);
            const player2Dmg = damage_1.Damage.calculateDamage(player2Pokemon, player1Pokemon, player2PokemonAttack);
            if (player1Pokemon.actualSpeed > player2Pokemon.actualSpeed) {
                this.turnBattle(player1Pokemon, player2Pokemon, player1Dmg, player2Dmg, "player1", "player2", player1PokemonAttack);
            }
            else if (player1Pokemon.actualSpeed < player2Pokemon.actualSpeed) {
                this.turnBattle(player2Pokemon, player1Pokemon, player2Dmg, player1Dmg, "player2", "player1", player2PokemonAttack);
            }
            else {
                if (Math.random() < 0.5) {
                    this.turnBattle(player1Pokemon, player2Pokemon, player1Dmg, player2Dmg, "player1", "player2", player1PokemonAttack);
                }
                else {
                    this.turnBattle(player2Pokemon, player1Pokemon, player2Dmg, player1Dmg, "player2", "player1", player2PokemonAttack);
                }
            }
        }
    }
    applyDamage(attacker, defender, damage, player, attackName) {
        defender.actualHp -= damage;
        this.generateAttackMessage(player, attacker.name, attackName, damage);
        if (defender.actualHp < 0) {
            defender.actualHp = 0;
        }
    }
    turnBattle(fasterPokemon, slowerPokemon, damageFaster, damageSlower, fasterPlayer, slowerPlayer, attackName) {
        this.applyDamage(fasterPokemon, slowerPokemon, damageFaster, fasterPlayer, attackName);
        if (slowerPokemon.actualHp <= 0) {
            this.changePokemon();
            return;
        }
        this.applyDamage(slowerPokemon, fasterPokemon, damageSlower, slowerPlayer, attackName);
        if (fasterPokemon.actualHp <= 0) {
            this.changePokemon();
            return;
        }
    }
    changePokemon() {
        const player1Pokemon = this.player1Pokemons[0];
        const player2Pokemon = this.player2Pokemons[0];
        if (player1Pokemon.actualHp === 0) {
            this.player1Pokemons.shift();
            //console.log(this.player1.pokemons.length);
            this.generateChangePokemonMessage("player1");
        }
        if (player2Pokemon.actualHp === 0) {
            this.player2Pokemons.shift();
            this.generateChangePokemonMessage("player2");
        }
        if (this.player1Pokemons.length === 0) {
            this.player2Points++;
            this.isRoundOver = true;
            if (this.player2Points === 2)
                this.generateGameEndMessage("player2");
            else
                this.generateRoundEndMessage("player2");
        }
        if (this.player2Pokemons.length === 0) {
            this.player1Points++;
            this.isRoundOver = true;
            if (this.player1Points === 2)
                this.generateGameEndMessage("player1");
            else
                this.generateRoundEndMessage("player1");
        }
    }
    startGame() {
        if (this.status) {
            console.log("Game already started!");
        }
        else {
            this.status = true;
            this.round = 1; // Reset to the first round
            this.result = "";
            console.log("Game started!");
        }
    }
    handleEvents(data, clientId) {
        switch (data.type) {
            case "ReadyForGame":
                // this.handleReadyForGame(clientId);
                break;
            // Add more cases here if you have more events
        }
    }
    static createPokemonsFromJSON(data) {
        return data.pokemons.map((pokemon) => {
            // const twoMoves = data.moves[pokemon.name];
            // const pokemonMoves = pokemon.moves;
            return new pokemon_1.Pokemon(pokemon.name, pokemon.hp, pokemon.attack, pokemon.level, pokemon.defense, pokemon.specialAttack, pokemon.specialDefense, pokemon.speed, pokemon.iconSelect, pokemon.type1, pokemon.type2
            // pokemonMoves[twoMoves[0]],
            // pokemonMoves[twoMoves[1]]
            );
        });
    }
    static playerSelectedPokemons(player) {
        player.isSelectedPokemons = true;
        const opponent = maps_1.Maps.getPlayerOpponent(player);
        if (opponent === null || opponent === void 0 ? void 0 : opponent.isSelectedPokemons) {
            player.sendMessage("OpponentSelectedPokemons");
            opponent.sendMessage("OpponentSelectedPokemons");
        }
    }
    static playerSelectedMoves(player) {
        player.isSelectedMoves = true;
        const opponent = maps_1.Maps.getPlayerOpponent(player);
        if (opponent === null || opponent === void 0 ? void 0 : opponent.isSelectedMoves) {
            player.sendMessage("OpponentSelectedMoves");
            opponent.sendMessage("OpponentSelectedMoves");
        }
    }
    static playerSelectedOrder(player) {
        player.isSelectedOrder = true;
        const opponent = maps_1.Maps.getPlayerOpponent(player);
        if (opponent === null || opponent === void 0 ? void 0 : opponent.isSelectedOrder) {
            player.sendMessage("OpponentSelectedOrder");
            opponent.sendMessage("OpponentSelectedOrder");
        }
    }
    generateAttackMessage(player, attacker, attackName, damage) {
        const message = {
            time: this.counter,
            event: "attack",
            player: player,
            user: attacker,
            attack: attackName,
            damage: damage,
        };
        this.counter++;
        this.messages.push(JSON.stringify(message));
    }
    generateChangePokemonMessage(changer) {
        const message = {
            time: this.counter,
            event: "change",
            player: changer,
        };
        this.counter++;
        this.messages.push(JSON.stringify(message));
    }
    generateGameEndMessage(winner) {
        const message = {
            time: this.counter,
            event: "game_end",
            winner: winner,
        };
        this.counter++;
        this.messages.push(JSON.stringify(message));
    }
    generateRoundEndMessage(winner) {
        const message = {
            time: this.counter,
            event: "round_ended",
            winner: winner,
        };
        this.counter++;
        this.messages.push(JSON.stringify(message));
    }
}
exports.Game = Game;
Game.liveGames = [];
Game.nextId = 1;
