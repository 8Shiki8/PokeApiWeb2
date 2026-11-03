/**
 * Componente App - Principal de la aplicación
 * Orquesta la carga de Pokémon, filtrado y renderizado de la interfaz
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Grid,
  CircularProgress,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Button,
  Pagination,
} from "@mui/material";
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import { useTheme } from "./context/ThemeContext";
import { PokemonCard } from "./components/PokemonCard";
import { PokemonFilter } from "./components/PokemonFilter";
import pokemonService from "./services/pokemonService";
import { Pokemon } from "./types/pokemon.types";

/**
 * Componente principal de la aplicación
 */
const App: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const ITEMS_PER_PAGE = 20;

  /**
   * Carga la lista inicial de Pokémon
   * Carga los 151 Pokémon de la primera generación
   */
  useEffect(() => {
    const loadInitialPokemon = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar lista de Pokémon (primeros 151 de la generación 1)
        const listResponse = await pokemonService.getPokemonList(151, 0);
        const pokemonNames = listResponse.results.map((p) => p.name);

        // Cargar detalles en lotes
        const pokemonDetails =
          await pokemonService.getPokemonBatch(pokemonNames);
        setAllPokemon(pokemonDetails);

        // Calcular total de páginas
        setTotalPages(Math.ceil(pokemonDetails.length / ITEMS_PER_PAGE));
        setCurrentPage(1);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al cargar Pokémon: ${errorMessage}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPokemon();
  }, []);

  /**
   * Filtra Pokémon por tipos seleccionados
   */
  const filterPokemon = useCallback(
    (types: string[]): void => {
      setSelectedTypes(types);
      setCurrentPage(1); // Reiniciar a la primera página

    if (types.length === 0) {
        setFilteredPokemon(allPokemon);
        setTotalPages(Math.ceil(allPokemon.length / ITEMS_PER_PAGE));
        return;
      }

      const filtered = allPokemon.filter((pokemon) =>
        pokemon.types.some((typeSlot) => types.includes(typeSlot.type.name)),
      );

      setFilteredPokemon(filtered);
      setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    },
    [allPokemon],
  );

  /**
   * Obtiene los Pokémon para la página actual
   */
  const getPaginatedPokemon = (): Pokemon[] => {
    const pokemon = selectedTypes.length > 0 ? filteredPokemon : allPokemon;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return pokemon.slice(startIndex, endIndex);
  };

  /**
   * Maneja el cambio de página
   */
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedPokemon = getPaginatedPokemon();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* AppBar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🔴 Pokédex
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            title={isDarkMode ? "Modo claro" : "Modo oscuro"}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {/* Filtros */}
        <PokemonFilter onFiltersChange={filterPokemon} disabled={isLoading} />

        {/* Mensaje de error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Estado de carga */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : paginatedPokemon.length === 0 ? (
          <Alert severity="info">
            No se encontraron Pokémon con los filtros seleccionados
          </Alert>
        ) : (
          <>
            {/* Grid de tarjetas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {paginatedPokemon.map((pokemon) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
                  <PokemonCard pokemon={pokemon} />
                </Grid>
              ))}
            </Grid>

            {/* Paginación */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>

            {/* Información de resultados */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="caption" color="textSecondary">
                Mostrando {paginatedPokemon.length} de{" "}
                {selectedTypes.length > 0
                  ? filteredPokemon.length
                  : allPokemon.length}{" "}
                Pokémon
              </Typography>
            </Box>
          </>
        )}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          textAlign: "center",
          borderTop: 1,
          borderColor: "divider",
          mt: 4,
        }}
      >
        <Typography variant="caption" color="textSecondary">
          Datos obtenidos de{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            PokéAPI
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
