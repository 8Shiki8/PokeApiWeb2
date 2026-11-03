/**
 * Tipos de datos para la aplicación PokeAPI
 */

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  other?: {
    "official-artwork"?: {
      front_default: string;
      front_shiny: string;
    };
  };
}

export interface PokemonCries {
  latest: string;
  legacy: string;
}

export interface Pokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: PokemonSprites;
  types: Array<{
    slot: number;
    type: PokemonType;
  }>;
  cries: PokemonCries;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface Type {
  id: number;
  name: string;
  pokemon: Array<{
    pokemon: PokemonListItem;
    slot: number;
  }>;
}

export interface TypeResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}
