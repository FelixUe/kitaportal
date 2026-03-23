import { useEffect, useState } from "react";
import { kinderLaden, krankmeldungEinreichen } from "../api/krankmeldung";
import styles from "./Krankmeldung.module.css";

const SYMPTOME = [
  { wert: "fieber", label: "Fieber" },
  { wert: "erkaeltung", label: "Erkältung" },
  { wert: "husten", label: "Husten" },
  { wert: "uebelkeit", label: "Übelkeit" },
  { wert: "magen_darm", label: "Magen-Darm" },
  { wert: "kopfschmerzen", label: "Kopfschmerzen" },
  { wert: "arzttermin", label: "Arzttermin" },
  { wert: "sonstiges", label: "Sonstiges" },
];

const heute = () => new Date().toISOString().split("T")[0];

export default function Krankmeldung() {
  const [kinder, setKinder] = useState([]);
  const [kinderFehler, setKinderFehler] = useState(false);

  const [form, setForm] = useState({
    kind: "",
    abwesend_ab: heute(),
    abwesend_bis: "",
    symptome: [],
    hinweis: "",
  });

  const [ladt, setLadt] = useState(false);
  const [fehler, setFehler] = useState(null);
  const [erfolg, setErfolg] = useState(false);

  useEffect(() => {
    kinderLaden()
      .then((res) => setKinder(res.data))
      .catch(() => setKinderFehler(true));
  }, []);

  function symptomToggle(wert) {
    setForm((prev) => ({
      ...prev,
      symptome: prev.symptome.includes(wert)
        ? prev.symptome.filter((s) => s !== wert)
        : [...prev.symptome, wert],
    }));
  }

  function feldAendern(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function abschicken(e) {
    e.preventDefault();
    setFehler(null);

    if (!form.kind) {
      setFehler("Bitte ein Kind auswählen.");
      return;
    }
    if (!form.abwesend_ab) {
      setFehler("Bitte ein Startdatum angeben.");
      return;
    }

    const nutzdaten = {
      kind: Number(form.kind),
      abwesend_ab: form.abwesend_ab,
      abwesend_bis: form.abwesend_bis || null,
      symptome: form.symptome,
      hinweis: form.hinweis,
    };

    setLadt(true);
    try {
      await krankmeldungEinreichen(nutzdaten);
      setErfolg(true);
      setForm({
        kind: "",
        abwesend_ab: heute(),
        abwesend_bis: "",
        symptome: [],
        hinweis: "",
      });
    } catch (err) {
      setFehler(
        err.response?.data?.detail ||
          "Die Krankmeldung konnte nicht übermittelt werden. Bitte erneut versuchen."
      );
    } finally {
      setLadt(false);
    }
  }

  if (erfolg) {
    return (
      <div className={styles.seite}>
        <div className={styles.erfolg}>
          <p className={styles.erfolgTitel}>Krankmeldung eingereicht</p>
          <p>Die Erzieher·innen wurden benachrichtigt.</p>
          <button
            className={styles.schaltflaeche}
            onClick={() => setErfolg(false)}
          >
            Neue Krankmeldung
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.seite}>
      <h1 className={styles.titel}>Kind krankmelden</h1>

      <form className={styles.formular} onSubmit={abschicken} noValidate>
        {/* Kind */}
        <div className={styles.feld}>
          <label className={styles.label} htmlFor="kind">
            Kind
          </label>
          {kinderFehler ? (
            <p className={styles.fehlerHinweis}>
              Kinder konnten nicht geladen werden.
            </p>
          ) : (
            <select
              id="kind"
              name="kind"
              className={styles.auswahl}
              value={form.kind}
              onChange={feldAendern}
              required
            >
              <option value="">– Kind auswählen –</option>
              {kinder.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.vorname} {k.nachname}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Zeitraum */}
        <div className={styles.zeile}>
          <div className={styles.feld}>
            <label className={styles.label} htmlFor="abwesend_ab">
              Abwesend ab
            </label>
            <input
              type="date"
              id="abwesend_ab"
              name="abwesend_ab"
              className={styles.eingabe}
              value={form.abwesend_ab}
              onChange={feldAendern}
              required
            />
          </div>
          <div className={styles.feld}>
            <label className={styles.label} htmlFor="abwesend_bis">
              Voraussichtlich zurück
            </label>
            <input
              type="date"
              id="abwesend_bis"
              name="abwesend_bis"
              className={styles.eingabe}
              value={form.abwesend_bis}
              min={form.abwesend_ab}
              onChange={feldAendern}
            />
          </div>
        </div>

        {/* Symptome */}
        <div className={styles.feld}>
          <span className={styles.label}>Symptome</span>
          <div className={styles.chips}>
            {SYMPTOME.map((s) => (
              <button
                key={s.wert}
                type="button"
                className={`${styles.chip} ${
                  form.symptome.includes(s.wert) ? styles.chipAktiv : ""
                }`}
                onClick={() => symptomToggle(s.wert)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hinweis */}
        <div className={styles.feld}>
          <label className={styles.label} htmlFor="hinweis">
            Hinweis <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            id="hinweis"
            name="hinweis"
            className={styles.textbereich}
            rows={3}
            placeholder="z.B. Arzttermin um 10 Uhr, bitte Bescheid geben …"
            value={form.hinweis}
            onChange={feldAendern}
          />
        </div>

        {fehler && <p className={styles.fehlerHinweis}>{fehler}</p>}

        <button
          type="submit"
          className={styles.schaltflaeche}
          disabled={ladt}
        >
          {ladt ? "Wird übermittelt …" : "Krankmeldung einreichen"}
        </button>
      </form>
    </div>
  );
}
