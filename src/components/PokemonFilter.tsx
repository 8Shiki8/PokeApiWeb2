/**
 * Componente PokemonFilter
 * Permite filtrar Pokémon por su tipo
 */

import React, { useEffect, useState } from "react";
import { Box, Chip, CircularProgress, Typography, Button } from "@mui/material";
import pokemonService from "../services/pokemonService";

/**
 * Mapea el nombre del tipo de Pokémon a su color correspondiente
 */
const typeColorMap: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

/**
 * Obtiene el color para un tipo específico
 */
const getTypeColor = (type: string): string => {
  return typeColorMap[type.toLowerCase()] || "#999999";
};

interface PokemonFilterProps {
  onFiltersChange: (selectedTypes: string[]) => void;
  disabled?: boolean;
}

/**
 * Componente de filtro de tipos de Pokémon
 * @param onFiltersChange - Callback cuando cambian los filtros
 * @param disabled - Si true, deshabilita el filtro
 */
export const PokemonFilter: React.FC<PokemonFilterProps> = ({
  onFiltersChange,
  disabled = false,
}) => {
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Carga los tipos disponibles de la API
   */
  useEffect(() => {
    const loadTypes = async (): Promise<void> => {
      try {
        const loadedTypes = await pokemonService.getTypes();
        setTypes(loadedTypes);
      } catch (error) {
        console.error("Error al cargar tipos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTypes();
  }, []);

  /**
   * Maneja la selección/deselección de un tipo
   */
  const handleTypeToggle = (type: string): void => {
    setSelectedTypes((prev) => {
      let newTypes: string[];
      if (prev.includes(type)) {
        newTypes = prev.filter((t) => t !== type);
      } else {
        newTypes = [...prev, type];
      }
      onFiltersChange(newTypes);
      return newTypes;
    });
  };

  /**
   * Reinicia todos los filtros
   */
  const handleResetFilters = (): void => {
    setSelectedTypes([]);
    onFiltersChange([]);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Filtrar por tipo</Typography>
        {selectedTypes.length > 0 && (
          <Button size="small" onClick={handleResetFilters} disabled={disabled}>
            Resetear
          </Button>
        )}
      </Box>

      {/* Chips de tipos */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          maxHeight: 120,
          overflowY: "auto",
          pb: 1,
        }}
      >
        {types.map((type) => (
          <Chip
            key={type}
            label={type}
            onClick={() => handleTypeToggle(type)}
            disabled={disabled}
            variant={selectedTypes.includes(type) ? "filled" : "outlined"}
            sx={{
              textTransform: "capitalize",
              ...(selectedTypes.includes(type) && {
                backgroundColor: getTypeColor(type),
                color: "#fff",
              }),
              ...(!selectedTypes.includes(type) && {
                borderColor: getTypeColor(type),
                color: getTypeColor(type),
              }),
              fontWeight: "500",
            }}
          />
        ))}
      </Box>

      {selectedTypes.length > 0 && (
        <Typography variant="caption" color="textSecondary">
          {selectedTypes.length} tipo(s) seleccionado(s)
        </Typography>
      )}
    </Box>
  );
};
