import { useState } from "react";
import { nachrichtSenden } from "../api/nachrichten";
import styles from "./Nachrichten.module.css";

// ─── Placeholder data ─────────────────────────────────────────────────────────

const GRUPPEN = ["Gruppe Sonnenkäfer", "Gruppe Regenbogenfische", "Kita-Leitung", "Elternrat"];

const THREADS = [
  {
    id: 1,
    name: "Erzieherin Petra",
    gruppe: "Gruppe Sonnenkäfer",
    betreff: "Ausflug am Donnerstag",
    vorschau: "Bitte denkt an wettergerechte Kleidung und Sonnencreme.",
    datum: "Heute, 09:45",
    ungelesen: 2,
    nachrichten: [
      { id: 1, autor: "Erzieherin Petra", text: "Hallo zusammen! Wir freuen uns auf den Ausflug zum Stadtpark am Donnerstag.", zeit: "09:14", eigen: false },
      { id: 2, autor: "Ich", text: "Wir kommen gerne mit! Lena freut sich schon sehr.", zeit: "09:32", eigen: true },
      { id: 3, autor: "Erzieherin Petra", text: "Sehr schön! Bitte denkt an wettergerechte Kleidung und Sonnencreme.", zeit: "09:45", eigen: false },
    ],
  },
  {
    id: 2,
    name: "Kita-Leitung",
    gruppe: "Kita-Leitung",
    betreff: "Änderung der Öffnungszeiten ab April",
    vorschau: "Ab dem 1. April gelten neue Öffnungszeiten. Bitte nehmt zur Kenntnis …",
    datum: "Gestern",
    ungelesen: 1,
    nachrichten: [
      { id: 1, autor: "Kita-Leitung", text: "Liebe Eltern, wir möchten euch darüber informieren, dass sich die Öffnungszeiten ab dem 1. April ändern. Die Kita öffnet künftig um 7:30 Uhr und schließt um 17:00 Uhr.", zeit: "14:20", eigen: false },
    ],
  },
  {
    id: 3,
    name: "Erzieherin Sandra",
    gruppe: "Gruppe Regenbogenfische",
    betreff: "Bastelmaterial für die Projektwoche",
    vorschau: "Wir suchen noch Kartons, Wolle und alte Zeitschriften …",
    datum: "Mo.",
    ungelesen: 0,
    nachrichten: [
      { id: 1, autor: "Erzieherin Sandra", text: "Liebe Eltern, für unsere Projektwoche nächste Woche suchen wir noch Bastelmaterial. Wer zuhause Kartons, Wolle oder alte Zeitschriften übrig hat, darf diese gerne mitbringen.", zeit: "15:05", eigen: false },
      { id: 2, autor: "Ich", text: "Wir bringen am Dienstag ein paar Kartons mit!", zeit: "16:30", eigen: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initialen(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Nachrichten() {
  const [ansicht, setAnsicht] = useState("liste"); // "liste" | "detail" | "verfassen"
  const [ausgewaehlt, setAusgewaehlt] = useState(null);
  const [antwortText, setAntwortText] = useState("");
  const [neueNachricht, setNeueNachricht] = useState({ empfaenger: "", betreff: "", text: "" });
  const [sendet, setSendet] = useState(false);

  const thread = THREADS.find((t) => t.id === ausgewaehlt);

  function threadOeffnen(id) {
    setAusgewaehlt(id);
    setAnsicht("detail");
  }

  function neueNachrichtFeldAendern(e) {
    const { name, value } = e.target;
    setNeueNachricht((prev) => ({ ...prev, [name]: value }));
  }

  async function absenden(e) {
    e.preventDefault();
    setSendet(true);
    try {
      await nachrichtSenden(neueNachricht);
    } catch {
      // Backend not ready — silently continue
    } finally {
      setSendet(false);
      setNeueNachricht({ empfaenger: "", betreff: "", text: "" });
      setAnsicht("liste");
    }
  }

  // ── Thread list ──
  if (ansicht === "liste") {
    return (
      <div className={styles.seite}>
        <div className={styles.seitenKopf}>
          <h1 className={styles.titel}>Nachrichten</h1>
          <button className={styles.verfassenSchaltflaeche}
            onClick={() => setAnsicht("verfassen")}>
            Verfassen
          </button>
        </div>

        <div className={styles.threadListe}>
          {THREADS.map((t) => (
            <button key={t.id} className={styles.threadItem}
              onClick={() => threadOeffnen(t.id)}>
              <div className={styles.avatar}>{initialen(t.name)}</div>
              <div className={styles.threadInfo}>
                <div className={styles.threadKopf}>
                  <span className={`${styles.threadName} ${t.ungelesen > 0 ? styles.ungelesen : ""}`}>
                    {t.name}
                  </span>
                  <span className={styles.threadDatum}>{t.datum}</span>
                </div>
                <span className={`${styles.threadBetreff} ${t.ungelesen > 0 ? styles.ungelesen : ""}`}>
                  {t.betreff}
                </span>
                <span className={styles.threadVorschau}>{t.vorschau}</span>
              </div>
              {t.ungelesen > 0 && (
                <span className={styles.ungelesenbadge}>{t.ungelesen}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Thread detail ──
  if (ansicht === "detail" && thread) {
    return (
      <div className={styles.seite}>
        <div className={styles.detailKopf}>
          <button className={styles.zurueckSchaltflaeche}
            onClick={() => setAnsicht("liste")}>
            ← Zurück
          </button>
          <div>
            <h1 className={styles.detailTitel}>{thread.betreff}</h1>
            <p className={styles.detailGruppe}>{thread.gruppe}</p>
          </div>
        </div>

        <div className={styles.nachrichtenVerlauf}>
          {thread.nachrichten.map((n) => (
            <div key={n.id} className={`${styles.nachrichtBubble} ${n.eigen ? styles.eigen : styles.empfangen}`}>
              {!n.eigen && <span className={styles.bubbleAutor}>{n.autor}</span>}
              <p className={styles.bubbleText}>{n.text}</p>
              <span className={styles.bubbleZeit}>{n.zeit}</span>
            </div>
          ))}
        </div>

        <div className={styles.antwortBereich}>
          <textarea
            className={styles.antwortEingabe}
            rows={3}
            placeholder="Antwort schreiben …"
            value={antwortText}
            onChange={(e) => setAntwortText(e.target.value)}
          />
          <button className={styles.sendenSchaltflaeche}
            disabled={!antwortText.trim()}
            onClick={() => setAntwortText("")}>
            Senden
          </button>
        </div>
      </div>
    );
  }

  // ── Compose ──
  return (
    <div className={styles.seite}>
      <div className={styles.detailKopf}>
        <button className={styles.zurueckSchaltflaeche}
          onClick={() => setAnsicht("liste")}>
          ← Zurück
        </button>
        <h1 className={styles.detailTitel}>Neue Nachricht</h1>
      </div>

      <form className={styles.verfassenFormular} onSubmit={absenden} noValidate>
        <div className={styles.feld}>
          <label className={styles.label} htmlFor="empfaenger">Empfänger</label>
          <select id="empfaenger" name="empfaenger" className={styles.auswahl}
            value={neueNachricht.empfaenger} onChange={neueNachrichtFeldAendern} required>
            <option value="">– Gruppe oder Person auswählen –</option>
            {GRUPPEN.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className={styles.feld}>
          <label className={styles.label} htmlFor="betreff">Betreff</label>
          <input type="text" id="betreff" name="betreff" className={styles.eingabe}
            placeholder="Worum geht es?"
            value={neueNachricht.betreff} onChange={neueNachrichtFeldAendern} required />
        </div>

        <div className={styles.feld}>
          <label className={styles.label} htmlFor="text">Nachricht</label>
          <textarea id="text" name="text" className={styles.textbereich}
            rows={6} placeholder="Schreib deine Nachricht …"
            value={neueNachricht.text} onChange={neueNachrichtFeldAendern} required />
        </div>

        <button type="submit" className={styles.schaltflaeche} disabled={sendet}>
          {sendet ? "Wird gesendet …" : "Nachricht senden"}
        </button>
      </form>
    </div>
  );
}
