import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Krankmeldung from "./pages/Krankmeldung";
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
