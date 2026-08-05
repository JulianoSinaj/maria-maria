import Photo from "@/components/media/Photo";

/* Wortmarke und Stemma. Beide standen als PNG im Markup — das Logo mit 34 KB
   im Header jeder einzelnen Seite, über dem Falz und damit in direkter
   Konkurrenz zum Hero-Foto um die erste Netzwerk-Runde, obwohl es nie breiter
   als ~104 px dargestellt wird. Als WebP sind es 6 KB.

   `loading="eager"`: beide stehen über dem Falz und dürfen nicht auf den
   Lazy-Trigger warten — die Vorgabe von <Photo> ist bewusst lazy und wird
   hier genauso bewusst überschrieben. */

export default function Logo({ className = "w-[104px]" }) {
  return (
    <Photo
      src="/img/logo.png"
      alt="Maria Maria"
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
