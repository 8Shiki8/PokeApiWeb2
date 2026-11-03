/**
 * Componente PokemonCard
 * Muestra una tarjeta individual de un Pokémon con sprite, tipos, sonido y botones interactivos
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import {
  VolumeUp as VolumeUpIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Pokemon } from "../types/pokemon.types";
import { getTypeColor } from "../styles/theme";
import { useTheme } from "../context/ThemeContext";

interface PokemonCardProps {
  pokemon: Pokemon;
}

/**
 * Componente tarjeta de Pokémon
 * Muestra sprite, tipos, información y acciones interactivas
 * @param pokemon - Objeto Pokemon a mostrar
 */
export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isShiny, setIsShiny] = useState<boolean>(false);
  const { isDarkMode } = useTheme();

  // Colores dinámicos basados en el tema
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        titleBg: "#C85A2F",
        shineColor: "#E87840",
      };
    }
    return {
      titleBg: "#FF9B5A",
      shineColor: "#FFB080",
    };
  };

  const { titleBg, shineColor } = getThemeColors();

  /**
   * Obtiene la URL del sprite a mostrar (normal o shiny) usando imágenes pixelart
   */
  const getSpriteUrl = (): string => {
    const baseUrl =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

    if (isShiny) {
      return `${baseUrl}/shiny/${pokemon.id}.png`;
    }
    return `${baseUrl}/${pokemon.id}.png`;
  };

  /**
   * Reproduce el sonido del Pokémon
   */
  const handlePlaySound = (): void => {
    if (pokemon.cries.legacy) {
      const audio = new Audio(pokemon.cries.legacy);
      audio
        .play()
        .catch((error) => console.error("Error al reproducir sonido:", error));
    }
  };

  /**
   * Alterna entre sprite normal y shiny
   */
  const handleToggleShiny = (): void => {
    setIsShiny((prev) => !prev);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 105, 180, 0.3), 0 0 80px rgba(0, 255, 255, 0.2)`,
        },
      }}
    >
      {/* Contenido principal */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 1,
        }}
      >
        {/* Nombre e ID */}
        <Box
          sx={{
            mb: 1,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            background: titleBg,
            p: 1,
            borderRadius: "4px",
            ".MuiCard-root:hover &::before": {
              animation: "shine 1s infinite linear",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-150%",
              width: "60%",
              height: "100%",
              background: shineColor,
              transform: "skewX(-25deg)",
              pointerEvents: "none",
            },
            "@keyframes shine": {
              "0%": { left: "-150%" },
              "50%": { left: "50%" },
              "100%": { left: "250%" },
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              position: "relative",
              zIndex: 1,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            {pokemon.name}
          </Typography>
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ mb: 2 }}>
          #{pokemon.id.toString().padStart(3, "0")}
        </Typography>

        {/* Sprite */}
        <Box
          sx={{
            width: "100%",
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            cursor: "pointer",
            userSelect: "none",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.15)",
            },
          }}
          onClick={handleToggleShiny}
          title="Click para cambiar entre modo normal y shiny"
        >
          <img
            src={getSpriteUrl()}
            alt={pokemon.name}
            style={{
              width: 280,
              height: 280,
              objectFit: "contain",
              imageRendering: "pixelated",
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/200?text=No+Image";
            }}
          />
        </Box>

        {/* Información */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="caption" display="block" color="textSecondary">
              Altura
            </Typography>
            <Typography variant="body2">
              {(pokemon.height / 10).toFixed(1)}m
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" display="block" color="textSecondary">
              Peso
            </Typography>
            <Typography variant="body2">
              {(pokemon.weight / 10).toFixed(1)}kg
            </Typography>
          </Grid>
        </Grid>

        {/* Tipos */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {pokemon.types.map((typeSlot) => (
            <Chip
              key={typeSlot.type.name}
              label={typeSlot.type.name}
              size="small"
              sx={{
                backgroundColor: getTypeColor(typeSlot.type.name),
                color: "#fff",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            />
          ))}
        </Box>
      </CardContent>

      {/* Acciones */}
      <CardActions sx={{ justifyContent: "space-between", pt: 1 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<VolumeUpIcon />}
          onClick={handlePlaySound}
          disabled={!pokemon.cries.legacy}
          sx={{ flex: 1, mr: 1 }}
        >
          Cry
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={handleToggleShiny}
          sx={{ flex: 1 }}
        >
          {isShiny ? "Normal" : "Shiny"}
        </Button>
      </CardActions>
    </Card>
  );
};
