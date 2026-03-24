import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Krankmeldung from "./pages/Krankmeldung";
import Abholung from "./pages/Abholung";
import Allergien from "./pages/Allergien";
import Nachrichten from "./pages/Nachrichten";
import Elternrat from "./pages/Elternrat";
import { useTheme } from "./hooks/useTheme";
import styles from "./App.module.css";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/krankmeldung", label: "Krankmeldung" },
  { to: "/abholung", label: "Abholung" },
  { to: "/allergien", label: "Allergien" },
  { to: "/nachrichten", label: "Nachrichten" },
  { to: "/elternrat", label: "Elternrat" },
];

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <header className={styles.header}>
        <span className={styles.logo}>KitaPortal</span>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkAktiv}` : styles.link
              }
            >
              {label}
            </NavLink>
          ))}
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
          <Route path="/abholung" element={<Abholung />} />
          <Route path="/allergien" element={<Allergien />} />
          <Route path="/nachrichten" element={<Nachrichten />} />
          <Route path="/elternrat" element={<Elternrat />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
