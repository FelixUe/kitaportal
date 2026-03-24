import api from "./client";

export const nachrichtenLaden = () => api.get("/nachrichten/");

export const nachrichtSenden = (daten) => api.post("/nachrichten/", daten);
