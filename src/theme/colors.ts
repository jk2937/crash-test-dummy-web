// Color palette extracted from crash-test-dummy Roblox UI
export const colors = {
  // Primary colors - from the UI screenshot
  gold: '#FFD700',      // Button outlines, accents, "GET MORE" section
  yellow: '#FFC107',    // Rewards, highlights
  
  // Category colors
  purple: '#9C27B0',    // Rebirth
  orange: '#FF9800',    // Setup
  blue: '#2196F3',      // Home
  pink: '#E91E63',      // FX Crate
  green: '#4CAF50',     // Store
  red: '#F44336',       // Alerts, danger
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#1E1E1E',
  mediumGray: '#424242',
  lightGray: '#BDBDBD',
  
  // Semantic
  text: {
    primary: '#FFFFFF',
    secondary: '#BDBDBD',
    dark: '#1E1E1E',
  },
  background: {
    dark: '#0A0E27',
    card: 'rgba(255, 255, 255, 0.05)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  border: {
    gold: '#FFD700',
    light: 'rgba(255, 255, 255, 0.2)',
  },
};

export type ColorKey = keyof typeof colors;
