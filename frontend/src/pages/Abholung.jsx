import { useState } from "react";
import { abholerlaubnisErteilen } from "../api/abholung";
import styles from "./Abholung.module.css";

// ─── Placeholder data ─────────────────────────────────────────────────────────

const KINDER_LISTE = [
  { id: 1, vorname: "Lena", nachname: "Müller" },
  { id: 2, vorname: "Felix", nachname: "Müller" },
];

const heute = () => new Date().toISOString().split("T")[0];

const INITIALE_PERSONEN = [
  { id: 1, name: "Thomas Müller", beziehung: "Vater", telefon: "0151 23456789" },
  { id: 2, name: "Oma Ingrid", beziehung: "Großmutter", telefon: "089 4567890" },
];

const LEER_FORM = {
  kind: "",
  person: "",
  datum: heute(),
  uhrzeit: "15:00",
  hinweis: "",
};

const LEER_PERSON_FORM = { name: "", beziehung: "", telefon: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function Abholung() {
  const [personen, setPersonen] = useState(INITIALE_PERSONEN);
  const [personFormOffen, setPersonFormOffen] = useState(false);
  const [neuePersonForm, setNeuePersonForm] = useState(LEER_PERSON_FORM);

  const [form, setForm] = useState(LEER_FORM);
  const [ladt, setLadt] = useState(false);
  const [fehler, setFehler] = useState(null);
  const [erfolg, setErfolg] = useState(false);

  function feldAendern(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function personFeldAendern(e) {
    const { name, value } = e.target;
    setNeuePersonForm((prev) => ({ ...prev, [name]: value }));
  }

  function personHinzufuegen(e) {
    e.preventDefault();
    if (!neuePersonForm.name) return;
    setPersonen((prev) => [
      ...prev,
      { id: Date.now(), ...neuePersonForm },
    ]);
    setNeuePersonForm(LEER_PERSON_FORM);
    setPersonFormOffen(false);
  }

  async function abschicken(e) {
    e.preventDefault();
    setFehler(null);

    if (!form.kind) { setFehler("Bitte ein Kind auswählen."); return; }
    if (!form.person) { setFehler("Bitte eine Abholperson auswählen."); return; }
    if (!form.datum) { setFehler("Bitte ein Datum angeben."); return; }
    if (!form.uhrzeit) { setFehler("Bitte eine Uhrzeit angeben."); return; }

    const nutzdaten = {
      kind: Number(form.kind),
      abholperson: Number(form.person),
      datum: form.datum,
      uhrzeit: form.uhrzeit,
      hinweis: form.hinweis,
    };

    setLadt(true);
    try {
      await abholerlaubnisErteilen(nutzdaten);
      setErfolg(true);
      setForm(LEER_FORM);
    } catch {
      setFehler("Die Erlaubnis konnte nicht übermittelt werden. Bitte erneut versuchen.");
    } finally {
      setLadt(false);
    }
  }

  return (
    <div className={styles.seite}>
      <h1 className={styles.titel}>Abholerlaubnis</h1>

      {/* ── Tageserlaubnis erteilen ── */}
      <section className={styles.abschnitt}>
        <h2 className={styles.abschnittTitel}>Tageserlaubnis erteilen</h2>

        {erfolg && (
          <div className={styles.erfolgBox}>
            <p className={styles.erfolgTitel}>Erlaubnis erteilt</p>
            <p>Die Abholperson wurde benachrichtigt.</p>
            <button className={styles.linkSchaltflaeche} onClick={() => setErfolg(false)}>
              Weitere Erlaubnis erteilen
            </button>
          </div>
        )}

        {!erfolg && (
          <form className={styles.formular} onSubmit={abschicken} noValidate>
            <div className={styles.zeile}>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="kind">Kind</label>
                <select id="kind" name="kind" className={styles.auswahl}
                  value={form.kind} onChange={feldAendern} required>
                  <option value="">– Kind auswählen –</option>
                  {KINDER_LISTE.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.vorname} {k.nachname}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="person">Abholperson</label>
                <select id="person" name="person" className={styles.auswahl}
                  value={form.person} onChange={feldAendern} required>
                  <option value="">– Person auswählen –</option>
                  {personen.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.zeile}>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="datum">Datum</label>
                <input type="date" id="datum" name="datum" className={styles.eingabe}
                  value={form.datum} onChange={feldAendern} required />
              </div>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="uhrzeit">Uhrzeit</label>
                <input type="time" id="uhrzeit" name="uhrzeit" className={styles.eingabe}
                  value={form.uhrzeit} onChange={feldAendern} required />
              </div>
            </div>

            <div className={styles.feld}>
              <label className={styles.label} htmlFor="hinweis">
                Hinweis <span className={styles.optional}>(optional)</span>
              </label>
              <textarea id="hinweis" name="hinweis" className={styles.textbereich}
                rows={2} placeholder="z.B. Oma kommt früher, bitte um 14:30 Uhr …"
                value={form.hinweis} onChange={feldAendern} />
            </div>

            {fehler && <p className={styles.fehlerHinweis}>{fehler}</p>}

            <button type="submit" className={styles.schaltflaeche} disabled={ladt}>
              {ladt ? "Wird übermittelt …" : "Erlaubnis erteilen"}
            </button>
          </form>
        )}
      </section>

      {/* ── Abholberechtigte Personen ── */}
      <section className={styles.abschnitt}>
        <div className={styles.abschnittKopf}>
          <h2 className={styles.abschnittTitel}>Abholberechtigte Personen</h2>
          {!personFormOffen && (
            <button className={styles.hinzufuegenSchaltflaeche}
              onClick={() => setPersonFormOffen(true)}>
              + Person hinzufügen
            </button>
          )}
        </div>

        <div className={styles.personenListe}>
          {personen.map((p) => (
            <div key={p.id} className={styles.personKarte}>
              <div className={styles.personAvatar}>{p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
              <div className={styles.personInfo}>
                <span className={styles.personName}>{p.name}</span>
                <span className={styles.personMeta}>{p.beziehung} · {p.telefon}</span>
              </div>
            </div>
          ))}
        </div>

        {personFormOffen && (
          <form className={`${styles.formular} ${styles.personFormular}`}
            onSubmit={personHinzufuegen} noValidate>
            <div className={styles.zeile}>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="pName">Name</label>
                <input type="text" id="pName" name="name" className={styles.eingabe}
                  placeholder="Vollständiger Name"
                  value={neuePersonForm.name} onChange={personFeldAendern} required />
              </div>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="pBeziehung">Beziehung</label>
                <input type="text" id="pBeziehung" name="beziehung" className={styles.eingabe}
                  placeholder="z.B. Vater, Oma, Freundin"
                  value={neuePersonForm.beziehung} onChange={personFeldAendern} />
              </div>
            </div>
            <div className={styles.feld}>
              <label className={styles.label} htmlFor="pTelefon">Telefon</label>
              <input type="tel" id="pTelefon" name="telefon" className={styles.eingabe}
                placeholder="Mobilnummer"
                value={neuePersonForm.telefon} onChange={personFeldAendern} />
            </div>
            <div className={styles.formularAktionen}>
              <button type="submit" className={styles.schaltflaeche}>Speichern</button>
              <button type="button" className={styles.abbrechenSchaltflaeche}
                onClick={() => { setPersonFormOffen(false); setNeuePersonForm(LEER_PERSON_FORM); }}>
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
