class PokemonType {
  name: string;
  iconApi: string;
  iconUrl!: string;

  constructor(name: string, iconApi: string) {
    this.name = name;
    this.iconApi = iconApi;
    this.fetchIconUrl(iconApi);
  }

  async fetchIconUrl(iconApi: string): Promise<void> {
    try {
      const response = await fetch(iconApi);
      const data: IconApiData = await response.json();
      console.log(data);
      this.iconUrl = data.sprites["generation-iii"].emerald.name_icon;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch Pokémon ikon");
    }
  }
  static types: Map<string, PokemonType> = new Map();
}
interface IconApiData {
  sprites: {
    "generation-iii": {
      emerald: {
        name_icon: string;
      };
    };
  };
}

export default PokemonType;
