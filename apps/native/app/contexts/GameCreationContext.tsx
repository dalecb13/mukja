import { createContext, useContext, useState, ReactNode } from "react";

export interface GameFilters {
  cuisine?: string;
  priceRange?: string;
  minRating?: string;
  dietaryRestrictions?: string[];
}

export interface MapArea {
  type: "Polygon";
  coordinates: [[number, number][]]; // Array of [lng, lat] pairs
}

interface GameCreationContextType {
  filters: GameFilters;
  mapArea: MapArea | null;
  createGroup: boolean;
  setFilters: (filters: GameFilters) => void;
  setMapArea: (mapArea: MapArea | null) => void;
  setCreateGroup: (createGroup: boolean) => void;
  clearMapArea: () => void;
  reset: () => void;
}

const GameCreationContext = createContext<GameCreationContextType | undefined>(
  undefined
);

export function GameCreationProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GameFilters>({
    cuisine: "",
    priceRange: "",
    minRating: "",
    dietaryRestrictions: [],
  });
  const [mapArea, setMapArea] = useState<MapArea | null>(null);
  const [createGroup, setCreateGroup] = useState(false);

  const clearMapArea = () => {
    setMapArea(null);
  };

  const reset = () => {
    setFilters({
      cuisine: "",
      priceRange: "",
      minRating: "",
      dietaryRestrictions: [],
    });
    setMapArea(null);
    setCreateGroup(false);
  };

  return (
    <GameCreationContext.Provider
      value={{
        filters,
        mapArea,
        createGroup,
        setFilters,
        setMapArea,
        setCreateGroup,
        clearMapArea,
        reset,
      }}
    >
      {children}
    </GameCreationContext.Provider>
  );
}

export function useGameCreation() {
  const context = useContext(GameCreationContext);
  if (context === undefined) {
    throw new Error(
      "useGameCreation must be used within a GameCreationProvider"
    );
  }
  return context;
}

