/**
 * Servicio para interactuar con la API de Pokémon
 * Maneja llamadas a https://pokeapi.co/api/v2/
 */

import axios, { AxiosInstance } from "axios";
import {
  Pokemon,
  PokemonListResponse,
  TypeResponse,
} from "../types/pokemon.types";

class PokemonService {
  private api: AxiosInstance;
  private readonly BASE_URL = "https://pokeapi.co/api/v2";
  private readonly RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 1000; // 1 segundo

  constructor() {
    this.api = axios.create({
      baseURL: this.BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Reintenta una operación asincrónica con un número máximo de intentos
   * @param fn - Función asincrónica a ejecutar
   * @param attempts - Número de intentos
   * @returns Resultado de la función
   */
  private async retry<T>(
    fn: () => Promise<T>,
    attempts: number = this.RETRY_ATTEMPTS,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempts <= 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
      return this.retry(fn, attempts - 1);
    }
  }

  /**
   * Obtiene la lista de Pokémon con paginación
   * @param limit - Número de resultados por página (defecto: 20)
   * @param offset - Desplazamiento (defecto: 0)
   * @returns Lista de Pokémon
   */
  async getPokemonList(
    limit: number = 20,
    offset: number = 0,
  ): Promise<PokemonListResponse> {
    return this.retry(() =>
      this.api
        .get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`)
        .then((res) => res.data),
    );
  }

  /**
   * Obtiene los detalles de un Pokémon específico
   * @param nameOrId - Nombre o ID del Pokémon
   * @returns Objeto Pokemon con todos los detalles
   */
  async getPokemonDetails(nameOrId: string | number): Promise<Pokemon> {
    return this.retry(() =>
      this.api.get<Pokemon>(`/pokemon/${nameOrId}`).then((res) => res.data),
    );
  }

  /**
   * Obtiene todos los tipos de Pokémon disponibles
   * @returns Lista de tipos
   */
  async getTypes(): Promise<string[]> {
    return this.retry(async () => {
      const response = await this.api.get<TypeResponse>("/type");
      return response.data.results.map((type) => type.name);
    });
  }

  /**
   * Obtiene los Pokémon de un tipo específico
   * @param typeName - Nombre del tipo
   * @returns Lista de nombres de Pokémon del tipo
   */
  async getPokemonByType(typeName: string): Promise<string[]> {
    return this.retry(async () => {
      const response = await this.api.get<any>(`/type/${typeName}`);
      return response.data.pokemon.map((p: any) => p.pokemon.name);
    });
  }

  /**
   * Obtiene detalles de múltiples Pokémon en paralelo
   * @param names - Array de nombres de Pokémon
   * @returns Array de objetos Pokemon
   */
  async getPokemonBatch(names: string[]): Promise<Pokemon[]> {
    return this.retry(() =>
      Promise.all(names.map((name) => this.getPokemonDetails(name))),
    );
  }
}

export default new PokemonService();
