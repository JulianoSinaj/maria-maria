import Photo from "@/components/media/Photo";

/* Wortmarke und Stemma. Beide standen als PNG im Markup — das Logo mit 34 KB
   im Header jeder einzelnen Seite, über dem Falz und damit in direkter
   Konkurrenz zum Hero-Foto um die erste Netzwerk-Runde, obwohl es nie breiter
   als ~104 px dargestellt wird. Als WebP sind es 6 KB.

   `loading="eager"`: beide stehen über dem Falz und dürfen nicht auf den
   Lazy-Trigger warten — die Vorgabe von <Photo> ist bewusst lazy und wird
   hier genauso bewusst überschrieben.

   `width`/`height` sind die Kantenlängen der Quelldatei (Homepage-Brief
   §7: Logo eager mit width/height): Der Browser kennt so das Seitenverhältnis,
   bevor ein Byte des Bildes da ist, und reserviert die Fläche — kein
   Layout-Sprung im Header. Die Anzeigegröße setzt weiter die Klasse.

   Eine SVG-Wortmarke (maria-maria-logo.svg), wie der Brief sie nennt, liegt
   nicht vor — es gibt nur das PNG (400 × 163) und seine WebP-Varianten. */

export default function Logo({ className = "w-[104px]" }) {
  return (
    <Photo
      src="/img/logo.png"
      alt="Maria Maria"
      width={400}
      height={163}
      sizes="104px"
      loading="eager"
      className={`${className} h-auto`}
    />
  );
}

export function Stemma({ className = "w-16" }) {
  return (
    <Photo
      src="/img/stemma.png"
      alt="Stemma Manduria"
      sizes="64px"
      loading="eager"
      className={`${className} h-auto`}
    />
  );
}
