import type { ReactNode } from "react";
import { NavBar } from "./nav-bar";
import { SiteFooter } from "./site-footer";

interface PageFrameProps {
  children: ReactNode;
  /**
   * When true, renders the warm gradient + botanical mark behind the page.
   * Use on the home/landing surface only.
   */
  withAtmosphere?: boolean;
}

export function PageFrame({ children, withAtmosphere = false }: PageFrameProps) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-paper text-ink">
      {withAtmosphere ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-clay-50/70 via-paper to-paper"
        />
      ) : null}
      <NavBar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
