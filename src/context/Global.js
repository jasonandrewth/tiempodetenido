import { useContext, createContext, useState, useRef, useEffect } from "react";
import * as THREE from "three";

const initialState = {
  isTransitioning: false,
  currentTexture: 0,
  //Set once in the beginning
  updateCurrentTexture: () => {},
  setIsTransitioning: () => {},
};

export const GlobalContext = createContext(initialState);

GlobalContext.displayName = "GlobalContext";

export const GlobalContextProvider = ({ children }) => {
  const [currentTexture, setCurrenttexture] = useState(
    initialState.currentTexture
  );
  const [isTransitioning, setIsTransitioning] = useState(
    initialState.isTransitioning
  );

  const updateCurrentTexture = (index) => {
    setCurrenttexture((prev) => index);
  };

  return (
    <GlobalContext.Provider
      value={{
        isTransitioning,
        setIsTransitioning,
        updateCurrentTexture,
        currentTexture,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalData = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(`useGlobalContext must be used within a Provider`);
  }

  return context;
};
