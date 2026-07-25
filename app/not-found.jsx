import Button from "@/components/ui/Button";
import { Eyebrow, GrapeRule } from "@/components/Deco";
import Atmosphere, { GhostWord } from "@/components/Atmosphere";

export const metadata = {
  title: "Seite nicht gefunden — Maria Maria",
};

/* 404 im Markenlook — läuft im normalen Layout, Header und Footer bleiben. */

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden">
      <Atmosphere variant="warm" />
      <GhostWord className="right-[-4vw] top-16 text-[16vw]">404</GhostWord>
      <div className="relative mx-auto max-w-content px-6 py-32 text-center lg:px-10">
        <Eyebrow className="justify-center">Seite nicht gefunden</Eyebrow>
        <h1 className="mx-auto mt-5 max-w-xl text-balance font-playfair text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.1] text-charcoal">
          Diese Flasche ist <span className="italic text-bordeaux">nicht in unserem Keller.</span>
        </h1>
        <GrapeRule className="mx-auto mt-7 justify-center" />
        <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-charcoal/70">
          Die gesuchte Seite existiert nicht oder wurde verschoben. Entdecken Sie stattdessen unsere
          Weine — da liegt ohnehin das Beste.
        </p>
        <div className="mx-auto mt-9 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <Button href="/weine" size="lg" className="w-full sm:w-auto">
            Unsere Weine
          </Button>
          <Button href="/" variant="outline" size="lg" className="w-full sm:w-auto">
            Zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
}
