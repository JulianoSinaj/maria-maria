import { redirect } from "next/navigation";

/* „Bestellungen" gibt es nicht mehr: Kunden kaufen bei Terra Vera, das
   Backoffice führt keine Aufträge. An seine Stelle ist im September 2026
   der Anfragen-Eingang getreten (/admin/anfragen). Diese Datei bleibt nur,
   damit alte Lesezeichen und Links dort landen statt auf einer 404. */
export default function BestellungenPage() {
  redirect("/admin/anfragen");
}
