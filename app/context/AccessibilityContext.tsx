"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type TextSize = "sm" | "base" | "lg" | "xl";

interface AccessibilityContextType {
  textSize: TextSize;
  highContrast: boolean;
  setTextSize: (size: TextSize) => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>("base");
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTextSize = localStorage.getItem("rskm-text-size") as TextSize;
    const savedContrast = localStorage.getItem("rskm-high-contrast") === "true";

    if (savedTextSize && ["sm", "base", "lg", "xl"].includes(savedTextSize)) {
      setTextSizeState(savedTextSize);
    }
    setHighContrastState(savedContrast);
    setMounted(true);
  }, []);

  // Update HTML classes when state changes
  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;
    
    // Remove previous text size classes
    html.classList.remove("text-size-sm", "text-size-base", "text-size-lg", "text-size-xl");
    // Add current text size class
    html.classList.add(`text-size-${textSize}`);

    // Toggle high contrast class
    if (highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }
  }, [textSize, highContrast, mounted]);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem("rskm-text-size", size);
  };

  const toggleHighContrast = () => {
    setHighContrastState((prev) => {
      const newVal = !prev;
      localStorage.setItem("rskm-high-contrast", String(newVal));
      return newVal;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ textSize, highContrast, setTextSize, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
