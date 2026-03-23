import api from "./client";

export const kinderLaden = () => api.get("/kinder/");

export const krankmeldungEinreichen = (daten) =>
  api.post("/krankmeldungen/", daten);

export const meineKrankmeldungen = () =>
  api.get("/krankmeldungen/");
