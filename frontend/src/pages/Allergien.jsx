import { useState } from "react";
import { allergieSpeichern } from "../api/allergien";
import styles from "./Allergien.module.css";

// ─── Placeholder data ─────────────────────────────────────────────────────────

const KINDER_LISTE = [
  { id: 1, vorname: "Lena", nachname: "Müller" },
  { id: 2, vorname: "Felix", nachname: "Müller" },
];

const INITIALE_ALLERGIEN = [
  {
    id: 1,
    kindId: 1,
    kindName: "Lena Müller",
    allergie: "Erdnüsse",
    schweregrad: "hoch",
    ausloeser: ["Erdnussbutter", "Gemischte Nüsse", "Manche Backwaren"],
    notiz: "Epipen im Rucksack. Bei Reaktion sofort Notarzt rufen.",
  },
  {
    id: 2,
    kindId: 2,
    kindName: "Felix Müller",
    allergie: "Laktose",
    schweregrad: "mittel",
    ausloeser: ["Kuhmilch", "Käse", "Butter", "Joghurt"],
    notiz: "Laktosefreie Alternativen sind verträglich.",
  },
  {
    id: 3,
    kindId: 2,
    kindName: "Felix Müller",
    allergie: "Heuschnupfen",
    schweregrad: "beobachten",
    ausloeser: ["Gräserpollen", "Frühlingspollen"],
    notiz: "",
  },
];

const LEER_FORM = {
  kind: "",
  allergie: "",
  schweregrad: "beobachten",
  ausloeser: "",
  notiz: "",
};

const SCHWEREGRAD_LABEL = {
  hoch: "Hoch",
  mittel: "Mittel",
  beobachten: "Beobachten",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Allergien() {
  const [allergien, setAllergien] = useState(INITIALE_ALLERGIEN);
  const [formOffen, setFormOffen] = useState(false);
  const [form, setForm] = useState(LEER_FORM);
  const [ladt, setLadt] = useState(false);
  const [fehler, setFehler] = useState(null);

  function feldAendern(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function abschicken(e) {
    e.preventDefault();
    setFehler(null);

    if (!form.kind) { setFehler("Bitte ein Kind auswählen."); return; }
    if (!form.allergie) { setFehler("Bitte eine Allergie/Unverträglichkeit eingeben."); return; }

    const kind = KINDER_LISTE.find((k) => k.id === Number(form.kind));
    const nutzdaten = {
      kind: Number(form.kind),
      allergie: form.allergie,
      schweregrad: form.schweregrad,
      ausloeser: form.ausloeser.split(",").map((s) => s.trim()).filter(Boolean),
      notiz: form.notiz,
    };

    setLadt(true);
    try {
      await allergieSpeichern(nutzdaten);
    } catch {
      // Backend not ready — add locally for demo
    } finally {
      setAllergien((prev) => [
        ...prev,
        {
          id: Date.now(),
          kindId: Number(form.kind),
          kindName: `${kind.vorname} ${kind.nachname}`,
          ...nutzdaten,
        },
      ]);
      setForm(LEER_FORM);
      setFormOffen(false);
      setLadt(false);
    }
  }

  return (
    <div className={styles.seite}>
      <div className={styles.seitenKopf}>
        <h1 className={styles.titel}>Allergien</h1>
        {!formOffen && (
          <button className={styles.hinzufuegenSchaltflaeche}
            onClick={() => setFormOffen(true)}>
            + Allergie hinzufügen
          </button>
        )}
      </div>

      {/* ── Add form ── */}
      {formOffen && (
        <section className={styles.abschnitt}>
          <h2 className={styles.abschnittTitel}>Neue Allergie erfassen</h2>
          <form className={styles.formular} onSubmit={abschicken} noValidate>
            <div className={styles.zeile}>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="kind">Kind</label>
                <select id="kind" name="kind" className={styles.auswahl}
                  value={form.kind} onChange={feldAendern} required>
                  <option value="">– Kind auswählen –</option>
                  {KINDER_LISTE.map((k) => (
                    <option key={k.id} value={k.id}>{k.vorname} {k.nachname}</option>
                  ))}
                </select>
              </div>
              <div className={styles.feld}>
                <label className={styles.label} htmlFor="schweregrad">Schweregrad</label>
                <select id="schweregrad" name="schweregrad" className={styles.auswahl}
                  value={form.schweregrad} onChange={feldAendern}>
                  <option value="hoch">Hoch</option>
                  <option value="mittel">Mittel</option>
                  <option value="beobachten">Beobachten</option>
                </select>
              </div>
            </div>

            <div className={styles.feld}>
              <label className={styles.label} htmlFor="allergie">Allergie / Unverträglichkeit</label>
              <input type="text" id="allergie" name="allergie" className={styles.eingabe}
                placeholder="z.B. Erdnüsse, Laktose, Gluten …"
                value={form.allergie} onChange={feldAendern} required />
            </div>

            <div className={styles.feld}>
              <label className={styles.label} htmlFor="ausloeser">
                Auslöser <span className={styles.optional}>(kommagetrennt, optional)</span>
              </label>
              <input type="text" id="ausloeser" name="ausloeser" className={styles.eingabe}
                placeholder="Erdnussbutter, Gemischte Nüsse …"
                value={form.ausloeser} onChange={feldAendern} />
            </div>

            <div className={styles.feld}>
              <label className={styles.label} htmlFor="notiz">
                Notfall-Hinweis <span className={styles.optional}>(optional)</span>
              </label>
              <textarea id="notiz" name="notiz" className={styles.textbereich}
                rows={2} placeholder="z.B. Epipen im Rucksack. Bei Reaktion Notarzt rufen."
                value={form.notiz} onChange={feldAendern} />
            </div>

            {fehler && <p className={styles.fehlerHinweis}>{fehler}</p>}

            <div className={styles.formularAktionen}>
              <button type="submit" className={styles.schaltflaeche} disabled={ladt}>
                {ladt ? "Wird gespeichert …" : "Speichern"}
              </button>
              <button type="button" className={styles.abbrechenSchaltflaeche}
                onClick={() => { setFormOffen(false); setForm(LEER_FORM); }}>
                Abbrechen
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ── Allergy list ── */}
      <section className={styles.abschnitt}>
        <h2 className={styles.abschnittTitel}>Erfasste Allergien</h2>
        {allergien.length === 0 ? (
          <p className={styles.leerHinweis}>Noch keine Allergien erfasst.</p>
        ) : (
          <div className={styles.allergienListe}>
            {allergien.map((a) => (
              <div key={a.id} className={styles.allergieKarte}>
                <div className={styles.allergieKopf}>
                  <div>
                    <span className={styles.allergieName}>{a.allergie}</span>
                    <span className={styles.kindHinweis}>{a.kindName}</span>
                  </div>
                  <span className={`${styles.schweregradBadge} ${styles[`schweregrad_${a.schweregrad}`]}`}>
                    {SCHWEREGRAD_LABEL[a.schweregrad]}
                  </span>
                </div>

                {a.ausloeser.length > 0 && (
                  <div className={styles.ausloeserListe}>
                    {a.ausloeser.map((t) => (
                      <span key={t} className={styles.ausloeserTag}>{t}</span>
                    ))}
                  </div>
                )}

                {a.notiz && (
                  <p className={styles.notiz}>{a.notiz}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
