import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Krankmeldung from "./pages/Krankmeldung";
import { useTheme } from "./hooks/useTheme";
import styles from "./App.module.css";

function Dashboard() {
  return (
    <div className={styles.placeholder}>
      <h1>Dashboard</h1>
      <p>Übersicht folgt in Kürze.</p>
    </div>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <header className={styles.header}>
        <span className={styles.logo}>KitaPortal</span>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkAktiv}` : styles.link
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/krankmeldung"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkAktiv}` : styles.link
            }
          >
            Krankmeldung
          </NavLink>
        </nav>
        <button
          className={styles.themeToggle}
          onClick={toggle}
          aria-label={theme === "light" ? "Dunkles Design aktivieren" : "Helles Design aktivieren"}
        >
          {theme === "light" ? "☾" : "☀"}
        </button>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/krankmeldung" element={<Krankmeldung />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
