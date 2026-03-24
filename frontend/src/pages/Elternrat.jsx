import { useState } from "react";
import { aufgabeSpeichern } from "../api/elternrat";
import styles from "./Elternrat.module.css";

// ─── Placeholder data ─────────────────────────────────────────────────────────

const SPALTEN = [
  { id: "backlog", titel: "Backlog" },
  { id: "todo", titel: "To Do" },
  { id: "inarbeit", titel: "In Arbeit" },
  { id: "fertig", titel: "Fertig" },
];

const INITIALE_AUFGABEN = [
  { id: 1, spalte: "backlog", titel: "Spielgeräte erneuern", prioritaet: "mittel", person: "MS", faellig: "Mai 2026" },
  { id: 2, spalte: "backlog", titel: "Fotobuch Kindergartenjahr gestalten", prioritaet: "niedrig", person: "TR", faellig: "" },
  { id: 3, spalte: "todo", titel: "Jahresfest 2026 planen", prioritaet: "hoch", person: "AK", faellig: "Apr. 2026" },
  { id: 4, spalte: "todo", titel: "Budget 2026 abstimmen", prioritaet: "hoch", person: "FU", faellig: "März 2026" },
  { id: 5, spalte: "todo", titel: "Neue Garderobe für Eingangsbereich", prioritaet: "mittel", person: "MS", faellig: "Apr. 2026" },
  { id: 6, spalte: "inarbeit", titel: "Spielecke Umbau Gruppenraum", prioritaet: "mittel", person: "LM", faellig: "Apr. 2026" },
  { id: 7, spalte: "inarbeit", titel: "Elternabend Einladung versenden", prioritaet: "hoch", person: "AK", faellig: "März 2026" },
  { id: 8, spalte: "fertig", titel: "Spendenaufruf Weihnachten 2025", prioritaet: "mittel", person: "TR", faellig: "" },
  { id: 9, spalte: "fertig", titel: "Willkommensmappe für neue Eltern", prioritaet: "niedrig", person: "LM", faellig: "" },
];

const PRIORITAET_LABEL = { hoch: "Hoch", mittel: "Mittel", niedrig: "Niedrig" };

const LEER_FORM = { titel: "", prioritaet: "mittel", person: "", faellig: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function Elternrat() {
  const [aufgaben, setAufgaben] = useState(INITIALE_AUFGABEN);
  const [offeneForm, setOffeneForm] = useState(null); // spalte id or null
  const [form, setForm] = useState(LEER_FORM);

  function feldAendern(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function aufgabeHinzufuegen(e) {
    e.preventDefault();
    if (!form.titel.trim()) return;

    const neueAufgabe = {
      id: Date.now(),
      spalte: offeneForm,
      titel: form.titel.trim(),
      prioritaet: form.prioritaet,
      person: form.person.trim().toUpperCase().slice(0, 2) || "–",
      faellig: form.faellig,
    };

    try {
      await aufgabeSpeichern({ ...neueAufgabe, spalte: offeneForm });
    } catch {
      // Backend not ready — add locally
    }

    setAufgaben((prev) => [...prev, neueAufgabe]);
    setForm(LEER_FORM);
    setOffeneForm(null);
  }

  return (
    <div className={styles.seite}>
      <h1 className={styles.titel}>Elternrat</h1>
      <p className={styles.untertitel}>Aufgaben und Projekte des Elternrats</p>

      <div className={styles.board}>
        {SPALTEN.map((spalte) => {
          const spaltenAufgaben = aufgaben.filter((a) => a.spalte === spalte.id);
          return (
            <div key={spalte.id} className={`${styles.spalte} ${styles[`spalte_${spalte.id}`]}`}>
              <div className={styles.spaltenKopf}>
                <span className={styles.spaltenTitel}>{spalte.titel}</span>
                <span className={styles.anzahlBadge}>{spaltenAufgaben.length}</span>
              </div>

              <div className={styles.kartenListe}>
                {spaltenAufgaben.map((a) => (
                  <div key={a.id} className={styles.aufgabeKarte}>
                    <div className={styles.karteKopf}>
                      <span className={`${styles.prioritaetBadge} ${styles[`prio_${a.prioritaet}`]}`}>
                        {PRIORITAET_LABEL[a.prioritaet]}
                      </span>
                    </div>
                    <p className={styles.karteTitel}>{a.titel}</p>
                    <div className={styles.karteFusszeile}>
                      <span className={styles.personInitialen}>{a.person}</span>
                      {a.faellig && (
                        <span className={styles.faelligDatum}>{a.faellig}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {offeneForm === spalte.id ? (
                <form className={styles.aufgabeForm} onSubmit={aufgabeHinzufuegen} noValidate>
                  <input type="text" name="titel" className={styles.formEingabe}
                    placeholder="Aufgabe beschreiben …"
                    value={form.titel} onChange={feldAendern} autoFocus required />

                  <div className={styles.formZeile}>
                    <select name="prioritaet" className={styles.formAuswahl}
                      value={form.prioritaet} onChange={feldAendern}>
                      <option value="hoch">Hoch</option>
                      <option value="mittel">Mittel</option>
                      <option value="niedrig">Niedrig</option>
                    </select>
                    <input type="text" name="person" className={styles.formEingabe}
                      placeholder="Kürzel (z.B. AK)"
                      value={form.person} onChange={feldAendern} maxLength={2} />
                  </div>

                  <input type="text" name="faellig" className={styles.formEingabe}
                    placeholder="Fällig (optional, z.B. Apr. 2026)"
                    value={form.faellig} onChange={feldAendern} />

                  <div className={styles.formAktionen}>
                    <button type="submit" className={styles.formSpeichern}>Hinzufügen</button>
                    <button type="button" className={styles.formAbbrechen}
                      onClick={() => { setOffeneForm(null); setForm(LEER_FORM); }}>
                      Abbrechen
                    </button>
                  </div>
                </form>
              ) : (
                <button className={styles.hinzufuegenSchaltflaeche}
                  onClick={() => setOffeneForm(spalte.id)}>
                  + Aufgabe
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
