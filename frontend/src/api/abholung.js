import api from "./client";

export const abholerlaubnisErteilen = (daten) =>
  api.post("/abholerlaubnisse/", daten);

export const abholpersonenLaden = (kindId) =>
  api.get(`/kinder/${kindId}/abholpersonen/`);
