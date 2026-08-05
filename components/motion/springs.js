/* Gemeinsame Feder-Konstanten für scroll-gebundene Bewegung.

   Warum zentral: der Scroll-Input ist bereits durch Lenis geglättet. Die
   Feder muss ihn also nicht mehr entrauschen — sie gibt der Ebene nur noch
   Gewicht. Eine stark überdämpfte Feder (ζ ≫ 1) filtert an dieser Stelle
   nichts mehr, sie verzögert nur: die Parallax-Ebene hängt sichtbar hinter
   dem Inhalt her und „schwimmt".

   Deshalb sind alle Werte hier ~kritisch gedämpft (ζ ≈ 1) — das ist die
   schnellste Annäherung ohne Überschwingen:

     ζ = damping / (2 · √(stiffness · mass))

   Wer die Bewegung träger will, erhöht `mass` (nicht `damping`) — das
   behält die Dämpfungscharakteristik und verlängert nur die Trägheit. */

/* Standard für scroll-gebundene Transforms (Parallax-Drift, Zoom).
   ζ = 16 / (2·√(120·0.5)) ≈ 1.03 */
export const SCROLL_SPRING = { stiffness: 120, damping: 16, mass: 0.5 };

/* Für großflächige Ebenen (Hero-Kamera, gepinnte Sektionen): etwas mehr
   Trägheit, damit die Bewegung nicht nervös wirkt, aber weiterhin ohne
   Nachhänger. ζ = 18 / (2·√(90·0.85)) ≈ 1.03 */
export const SCROLL_SPRING_HEAVY = { stiffness: 90, damping: 18, mass: 0.85 };
