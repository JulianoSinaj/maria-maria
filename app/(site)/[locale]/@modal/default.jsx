/* Der Normalzustand des Fenster-Slots: nichts.

   Ein Parallel-Slot braucht ein `default`, sonst wirft der Router auf jeder
   Seite, die den Slot nicht füllt (also auf allen außer dem abgefangenen
   Interview-Klick) einen 404. */
export default function ModalDefault() {
  return null;
}
