"use client";
import { createContext, useContext } from "react";

/* Globaler Schalter für magnetisches Hover. Früher steuerte er die
   A/B-Varianten /index1 (statisch) vs. /index2 (magnetisch) — die Routen
   sind entfernt, magnetisches Tracking ist jetzt überall aktiv. Der Context
   bleibt als API erhalten, damit sich Magnetismus bei Bedarf (Tests,
   Kampagnen-Seiten) weiterhin zentral abschalten lässt. */

const MagneticContext = createContext(true);

export function useMagneticEnabled() {
  return useContext(MagneticContext);
}

export function MagneticRouteProvider({ children }) {
  return <MagneticContext.Provider value={true}>{children}</MagneticContext.Provider>;
}
