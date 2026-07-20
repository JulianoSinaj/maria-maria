/* Shared wine catalogue — matches the reference designs. */
export const WINES = [
  { name: "Primitivo 14,5", region: "Apulien", variant: "red", notes: "Weich, vollmundig und harmonisch", dot: "#6B0F1A" },
  { name: "Primitivo 15,5", region: "Apulien", variant: "redsoft", notes: "Intensiv, kraftvoll und ausgewogen", dot: "#6B0F1A" },
  { name: "Primitivo Salento IGP", region: "Apulien", variant: "amber", notes: "Fruchtig, rund und zugänglich", dot: "#6B0F1A" },
  { name: "Lugana", region: "Venetien", variant: "white", notes: "Elegant, frisch und mineralisch", dot: "#C8B77A" },
  { name: "Greco di Tufo D.O.C.G.", region: "Kampanien", variant: "white", notes: "Strukturiert, fein und aromatisch", dot: "#C8B77A" },
  { name: "Falanghina", region: "Kampanien", variant: "white", notes: "Frisch, fruchtig und lebendig", dot: "#C8B77A" },
  { name: "Rosato Puglia", region: "Apulien", variant: "rose", notes: "Zart, fruchtig und erfrischend", dot: "#c67f78" },
  { name: "Il Rosso – Aglianico", region: "Basilikata", variant: "red", notes: "Tiefgründig, würzig und charakterstark", dot: "#6B0F1A" },
  { name: "Il Bianco – Greco Cuvée", region: "Kampanien", variant: "white", notes: "Frisch, elegant und ausgewogen", dot: "#C8B77A" },
];

export const byName = (n) => WINES.find((w) => w.name === n);
