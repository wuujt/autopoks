import { modes } from "./modes";
import { GameModes } from "./modes";

enum Textes {
  startingScreen = `This is autobattler based on Super Auto Pets in Pokemon world.\n
            Game is in early state and some bugs might occur and there is no all functions implemented. \n
            Playing is only possible againts another player, might be possibly vs AI in some future. \n
            All copyrights to The Pokémon Company. \n
            Press z to continue.`,
  pokemonSelectInfo = ``,
  pokemonSelect = `It is the first stage of the game. \n
            In this screen you have to select your pokemons. \n 
            Press arrows to change selected pokemon and press z to confirm pokemons. \n
            Press on button to submit. \n
            Press z to continue.`,
}

enum TextesSurvival {
  startingScreen = `This is autobattler based on Super Auto Pets in Pokemon world.\n
            Game is in early state and some bugs might occur and there is no all functions implemented. \n
            Playing is only possible againts another player, might be possibly vs AI in some future. \n
            All copyrights to The Pokémon Company. \n
            Press z to continue.`,
  pokemonSelectInfo = `You will be fighting againts computer.
            Computer will randomly choose pokemons and moves
            He won't be able to change order of pokemons.
            Every fight he will choose new set of pokemons and you are able to change order.
            Your mission is to survive as along as possible.
            To make this a competetive we set levels of computer's pokemons on 65, your is on 50
            and he will choose pokemons of base stat 410+ and moves 50+ power.
            Press z to continue.`,
  pokemonSelect = `It is the first stage of the game. \n
            In this screen you have to select your pokemons. \n 
            Press arrows to change selected pokemon and press z to confirm pokemons. \n
            Press on button to submit. \n
            Press z to continue.`,
}

export default function getText(mode: modes, gameMode: GameModes): string {
  if (gameMode === 1) {
    switch (mode) {
      case 1:
        return Textes.startingScreen;
      case 2:
        return Textes.pokemonSelect;
      default:
        return "Invalid stage.";
    }
  } else if (gameMode === 2) {
    switch (mode) {
      case 0:
        return TextesSurvival.startingScreen;
      case 1:
        return TextesSurvival.pokemonSelect;
      case 2:
        return TextesSurvival.pokemonSelectInfo;
      default:
        return "Invalid stage.";
    }
  }
  return "Invalid mode.";
}
