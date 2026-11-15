import localFont from "next/font/local";

// Arimo (Apache 2.0) solo entra si el dispositivo no tiene Helvetica ni Arial. Un único fichero variable con el alfabeto latino:
// cubre la 400 y la 700, las tildes, la ñ y las comillas de los dos idiomas.
export const arimo = localFont({ src: "../fuentes/arimo-latin.woff2", variable: "--font-arimo", weight: "400 700", display: "swap", preload: false });
