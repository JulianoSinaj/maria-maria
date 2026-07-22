"use client";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

/* Site variant switch — under /index1 every Magnetic wrapper goes inert:
   buttons hold their position and only the CSS hover layers (fill rise,
   label roll, shine) respond. Everywhere else cursor tracking stays on. */

const MagneticContext = createContext(true);

export function useMagneticEnabled() {
  return useContext(MagneticContext);
}

export function MagneticRouteProvider({ children }) {
  const pathname = usePathname() || "";
  const enabled = !(pathname === "/index1" || pathname.startsWith("/index1/"));
  return <MagneticContext.Provider value={enabled}>{children}</MagneticContext.Provider>;
}
