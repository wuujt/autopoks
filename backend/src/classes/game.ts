import { platform } from "os";
import { Maps } from "./maps";
import { Player } from "./player";
import { Pokemon } from "./pokemon";
import { Damage } from "./damage";

export class Game {
  static liveGames: Game[] = [];
  static nextId: number = 1;

  gameId: number;
  player1: Player;
  player2: Player;
  player1Pokemons: Pokemon[] = [];
  player2Pokemons: Pokemon[] = [];
  status: boolean; // true - active, false - ended
  result: string;
  player1Points: number = 0;
  player2Points: number = 0;
  isRoundOver: boolean = false;
  counter: number = 0;
  round: number; // bo3
  messages: string[] = [];
  requestCounter: boolean[] = [false, false];

  constructor(player1: Player, player2: Player) {
    this.gameId = Game.generateGameId();
    this.player1 = player1;
    this.player2 = player2;
    this.status = true; // Game starts as active
    this.result = "";
    this.round = 1; // Initial round
  }

  setPokemons(): void {
    this.player1Pokemons = this.player1.pokemons.map((pokemon) => ({
      ...pokemon,
    }));
    this.player2Pokemons = this.player2.pokemons.map((pokemon) => ({
      ...pokemon,
    }));
  }
  static generateGameId(): number {
    return this.nextId++;
  }

  Round(): void {
    this.isRoundOver = false;
    this.messages.splice(0, this.messages.length);
    this.setPokemons();
    while (!this.isRoundOver) {
      const player1Pokemon = this.player1Pokemons[0];
      const player2Pokemon = this.player2Pokemons[0];

      const player1PokemonAttack = Pokemon.drawAttack();
      const player2PokemonAttack = Pokemon.drawAttack();

      const player1Dmg = Damage.calculateDamage(
        player1Pokemon,
        player2Pokemon,
        player1PokemonAttack
      );
      const player2Dmg = Damage.calculateDamage(
        player2Pokemon,
        player1Pokemon,
        player2PokemonAttack
      );

      if (player1Pokemon.actualSpeed > player2Pokemon.actualSpeed) {
        this.turnBattle(
          player1Pokemon,
          player2Pokemon,
          player1Dmg,
          player2Dmg,
          "player1",
          "player2",
          player1PokemonAttack
        );
      } else if (player1Pokemon.actualSpeed < player2Pokemon.actualSpeed) {
        this.turnBattle(
          player2Pokemon,
          player1Pokemon,
          player2Dmg,
          player1Dmg,
          "player2",
          "player1",
          player2PokemonAttack
        );
      } else {
        if (Math.random() < 0.5) {
          this.turnBattle(
            player1Pokemon,
            player2Pokemon,
            player1Dmg,
            player2Dmg,
            "player1",
            "player2",
            player1PokemonAttack
          );
        } else {
          this.turnBattle(
            player2Pokemon,
            player1Pokemon,
            player2Dmg,
            player1Dmg,
            "player2",
            "player1",
            player2PokemonAttack
          );
        }
      }
    }
  }

  applyDamage(
    attacker: Pokemon,
    defender: Pokemon,
    damage: number,
    player: string,
    attackName: number
  ): void {
    defender.actualHp -= damage;
    this.generateAttackMessage(player, attacker.name, attackName, damage);

    if (defender.actualHp < 0) {
      defender.actualHp = 0;
    }
  }

  turnBattle(
    fasterPokemon: Pokemon,
    slowerPokemon: Pokemon,
    damageFaster: number,
    damageSlower: number,
    fasterPlayer: string,
    slowerPlayer: string,
    attackName: number
  ): void {
    this.applyDamage(
      fasterPokemon,
      slowerPokemon,
      damageFaster,
      fasterPlayer,
      attackName
    );
    if (slowerPokemon.actualHp <= 0) {
      this.changePokemon();
      return;
    }
    this.applyDamage(
      slowerPokemon,
      fasterPokemon,
      damageSlower,
      slowerPlayer,
      attackName
    );
    if (fasterPokemon.actualHp <= 0) {
      this.changePokemon();
      return;
    }
  }
  changePokemon(): void {
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
      if (this.player2Points === 2) this.generateGameEndMessage("player2");
      else this.generateRoundEndMessage("player2");
    }
    if (this.player2Pokemons.length === 0) {
      this.player1Points++;
      this.isRoundOver = true;
      if (this.player1Points === 2) this.generateGameEndMessage("player1");
      else this.generateRoundEndMessage("player1");
    }
  }
  startGame(): void {
    if (this.status) {
      console.log("Game already started!");
    } else {
      this.status = true;
      this.round = 1; // Reset to the first round
      this.result = "";
      console.log("Game started!");
    }
  }

  handleEvents(data: any, clientId: string): void {
    switch (data.type) {
      case "ReadyForGame":
        // this.handleReadyForGame(clientId);
        break;
      // Add more cases here if you have more events
    }
  }

  static createPokemonsFromJSON(data: pokemonsData): Pokemon[] {
    return data.pokemons.map((pokemon) => {
      // const twoMoves = data.moves[pokemon.name];
      // const pokemonMoves = pokemon.moves;

      return new Pokemon(
        pokemon.name,
        pokemon.hp,
        pokemon.attack,
        pokemon.level,
        pokemon.defense,
        pokemon.specialAttack,
        pokemon.specialDefense,
        pokemon.speed,
        pokemon.iconSelect,
        pokemon.type1,
        pokemon.type2
        // pokemonMoves[twoMoves[0]],
        // pokemonMoves[twoMoves[1]]
      );
    });
  }

  static playerSelectedPokemons(player: Player): void {
    player.isSelectedPokemons = true;
    const opponent = Maps.getPlayerOpponent(player);
    if (opponent?.isSelectedPokemons) {
      player.sendMessage("OpponentSelectedPokemons");
      opponent.sendMessage("OpponentSelectedPokemons");
    }
  }

  static playerSelectedMoves(player: Player): void {
    player.isSelectedMoves = true;
    const opponent = Maps.getPlayerOpponent(player);
    if (opponent?.isSelectedMoves) {
      player.sendMessage("OpponentSelectedMoves");
      opponent.sendMessage("OpponentSelectedMoves");
    }
  }

  static playerSelectedOrder(player: Player): void {
    player.isSelectedOrder = true;
    const opponent = Maps.getPlayerOpponent(player);
    if (opponent?.isSelectedOrder) {
      player.sendMessage("OpponentSelectedOrder");
      opponent.sendMessage("OpponentSelectedOrder");
    }
  }

  generateAttackMessage(
    player: string,
    attacker: string,
    attackName: number,
    damage: number
  ): void {
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

  generateChangePokemonMessage(changer: string): void {
    const message = {
      time: this.counter,
      event: "change",
      player: changer,
    };
    this.counter++;
    this.messages.push(JSON.stringify(message));
  }
  generateGameEndMessage(winner: string): void {
    const message = {
      time: this.counter,
      event: "game_end",
      winner: winner,
    };
    this.counter++;
    this.messages.push(JSON.stringify(message));
  }
  generateRoundEndMessage(winner: string): void {
    const message = {
      time: this.counter,
      event: "round_ended",
      winner: winner,
    };
    this.counter++;
    this.messages.push(JSON.stringify(message));
  }
  // generateScoreMessage(): void {
  //   const message = {
  //     time: this.counter,
  //     event: "score",
  //     player1_points: this.player1Points,
  //     player2_points: this.player2Points,
  //   };
  //   this.counter++;
  //   this.messages.push(JSON.stringify(message));
  // }
}

interface pokemonAndMovesData {
  pokemons: Pokemon[];
  moves: { [key: string]: number[] };
}

interface pokemonsData {
  pokemons: Pokemon[];
}
