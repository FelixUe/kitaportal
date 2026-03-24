import api from "./client";

export const allergienLaden = () => api.get("/allergien/");

export const allergieSpeichern = (daten) => api.post("/allergien/", daten);

export const allergieLoeschen = (id) => api.delete(`/allergien/${id}/`);
