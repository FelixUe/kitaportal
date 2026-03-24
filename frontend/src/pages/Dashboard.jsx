import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";

// ─── Placeholder data ─────────────────────────────────────────────────────────

const ELTERNTEIL = { vorname: "Maria" };

const KINDER = [
  { id: 1, vorname: "Lena", nachname: "Müller", gruppe: "Sonnenkäfer", status: "anwesend" },
  { id: 2, vorname: "Felix", nachname: "Müller", gruppe: "Regenbogenfische", status: "krank" },
];

const AKTIONEN = [
  {
    symbol: "+",
    label: "Kind krankmelden",
    beschreibung: "Abwesenheit und Symptome melden",
    ziel: "/krankmeldung",
  },
  {
    symbol: "→",
    label: "Abholerlaubnis",
    beschreibung: "Tageserlaubnis für Abholpersonen",
    ziel: "/abholung",
  },
  {
    symbol: "◻",
    label: "Nachricht schreiben",
    beschreibung: "Direkt an die Gruppe schreiben",
    ziel: "/nachrichten",
  },
  {
    symbol: "◇",
    label: "Allergien verwalten",
    beschreibung: "Unverträglichkeiten pflegen",
    ziel: "/allergien",
  },
];

const NEUIGKEITEN = [
  {
    id: 1,
    titel: "Elterncafe am Freitag",
    datum: "22. März 2026",
    text: "Wir laden alle Eltern herzlich zum monatlichen Elterncafe ein. Ab 15:00 Uhr im Gruppenraum Sonnenkäfer.",
  },
  {
    id: 2,
    titel: "Brückentag am 2. Mai",
    datum: "18. März 2026",
    text: "Die Kita bleibt am Freitag, den 2. Mai geschlossen. Bitte plant eure Betreuung entsprechend.",
  },
  {
    id: 3,
    titel: "Neue Speisepläne verfügbar",
    datum: "15. März 2026",
    text: "Die Speisepläne für April und Mai wurden aktualisiert und hängen im Eingangsbereich aus.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function grussWort() {
  const h = new Date().getHours();
  if (h < 11) return "Guten Morgen";
  if (h < 17) return "Guten Tag";
  return "Guten Abend";
}

function heuteDatum() {
  return new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_LABEL = {
  anwesend: "Anwesend",
  krank: "Krank",
  abwesend: "Abwesend",
};

const STATUS_KLASSE = {
  anwesend: styles.statusAnwesend,
  krank: styles.statusKrank,
  abwesend: styles.statusAbwesend,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className={styles.seite}>

      {/* Greeting */}
      <section className={styles.begruessung}>
        <h1 className={styles.gruss}>
          {grussWort()}, {ELTERNTEIL.vorname}
        </h1>
        <p className={styles.datum}>{heuteDatum()}</p>
      </section>

      {/* Meine Kinder */}
      <section className={styles.abschnitt}>
        <h2 className={styles.abschnittTitel}>Meine Kinder</h2>
        <div className={styles.kinderRaster}>
          {KINDER.map((kind) => (
            <div key={kind.id} className={styles.kindKarte}>
              <div className={styles.kindKopf}>
                <span className={styles.kindName}>
                  {kind.vorname} {kind.nachname}
                </span>
                <span className={`${styles.statusBadge} ${STATUS_KLASSE[kind.status]}`}>
                  {STATUS_LABEL[kind.status]}
                </span>
              </div>
              <span className={styles.kindGruppe}>{kind.gruppe}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Schnellaktionen */}
      <section className={styles.abschnitt}>
        <h2 className={styles.abschnittTitel}>Schnellaktionen</h2>
        <div className={styles.aktionenRaster}>
          {AKTIONEN.map((aktion) => (
            <Link key={aktion.ziel} to={aktion.ziel} className={styles.aktionKarte}>
              <span className={styles.aktionIcon} aria-hidden="true">
                {aktion.symbol}
              </span>
              <span className={styles.aktionLabel}>{aktion.label}</span>
              <span className={styles.aktionBeschreibung}>{aktion.beschreibung}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Neuigkeiten */}
      <section className={styles.abschnitt}>
        <h2 className={styles.abschnittTitel}>Neuigkeiten</h2>
        <div className={styles.neuigkeitenListe}>
          {NEUIGKEITEN.map((n, i) => (
            <article key={n.id} className={styles.neuigkeit}>
              <div className={styles.neuigkeitKopf}>
                <span className={styles.neuigkeitTitel}>{n.titel}</span>
                <span className={styles.neuigkeitDatum}>{n.datum}</span>
              </div>
              <p className={styles.neuigkeitText}>{n.text}</p>
              {i < NEUIGKEITEN.length - 1 && <hr className={styles.trennlinie} />}
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
