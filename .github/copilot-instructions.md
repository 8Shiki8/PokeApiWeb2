# Instrucciones de Desarrollo - PokeAPI Web

## Stack Tecnológico
- React 18+ con Vite
- TypeScript
- Material-UI (MUI)
- Axios para llamadas API
- PokéAPI (https://pokeapi.co/api/v2/)

## Convenciones de Código

### TypeScript
- Código **100% tipado** - NO usar `any`
- Importar tipos desde `src/types/`
- Interfaces explícitas para props de componentes

### Componentes React
- Funcionales con hooks (`useState`, `useEffect`, etc.)
- JSDoc comments para cada componente y función
- Props tipados con interfaces
- Nombres descriptivos (PascalCase para componentes, camelCase para variables)

### Ejemplo de Componente
```typescript
/**
 * Componente de ejemplo
 * @param prop1 - Descripción del prop
 */
const MyComponent: React.FC<MyComponentProps> = ({ prop1 }) => {
  /**
   * Ejemplo de función
   */
  const handleExample = (): void => {
    // Código
  };

  return <div>Contenido</div>;
};
```

## Estructura de Directorios
```
src/
├── components/      # Componentes React reutilizables
├── context/         # Context API (ThemeContext)
├── services/        # Servicios (pokemonService)
├── styles/          # Temas y estilos globales
├── types/           # Definiciones de tipos
├── App.tsx          # Componente raíz
└── main.tsx         # Punto de entrada
```

## Características Principales

### Tema Oscuro/Claro
- Usar `useTheme()` hook desde `context/ThemeContext`
- Dark mode es el tema por defecto
- Toggle en AppBar

### PokemonCard
- Mostrar sprite (clickeable para cambiar a shiny)
- Tags de tipos con colores específicos
- Botón para reproducir cry (legacy)
- Responsive en móvil/tablet/desktop

### Filtro de Tipos
- Cargar tipos desde API
- Múltiples selecciones
- Botón resetear

### Responsive
- Mobile-first con MUI Grid
- xs={12} sm={6} md={4} lg={3}

## Requisitos API
- Base URL: https://pokeapi.co/api/v2/
- Endpoints: `/pokemon`, `/type`, `/pokemon/{id}`
- Reintentos automáticos en caso de error

## Estándares de Git
- Commits descriptivos
- Una feature por rama
- Nombres de rama: feature/nombre, fix/nombre

## Testing (opcional)
- Usar React Testing Library
- Crear test files: `*.test.tsx`

## Performance
- Lazy load de componentes si es necesario
- useCallback para funciones complejas
- useMemo para datos costosos

## Accesibilidad
- Usar componentes semánticos de MUI
- ARIA labels donde sea necesario
- Contrast de colores adecuado

