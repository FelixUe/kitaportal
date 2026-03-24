import api from "./client";

export const aufgabenLaden = () => api.get("/elternrat/aufgaben/");

export const aufgabeSpeichern = (daten) => api.post("/elternrat/aufgaben/", daten);

export const aufgabeAktualisieren = (id, daten) =>
  api.patch(`/elternrat/aufgaben/${id}/`, daten);
