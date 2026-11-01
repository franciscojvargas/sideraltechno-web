---
id: calidad
numero: "014"
titulo: "¿Estás pinchando música de mala calidad?"
gancho: "¿Pinchas música de mala calidad?"
serie: "Cultura club · Cabina"
tipo: dj
resumen: "MP3, WAV y FLAC: qué pierde un MP3, por qué un FLAC suena igual que un WAV ocupando la mitad y por qué pasar un MP3 a WAV no arregla nada."
estado: publicado
formato: estandar
duracion: 33
publicado: 2026-10-26
actualizado: 2026-11-01
instagram: De9Pxq7z2b2
tiktok: "7702154954814835990"
etiquetas: ["mp3", "wav", "flac", "calidad de sonido", "compresión con pérdida", "sin pérdidas", "kbps", "library of congress", "bandcamp", "máster", "dj", "cabina"]
guion:
  - { clave: gancho, texto: "No vas a sonar mejor con un buen equipo si tu música no tiene calidad." }
  - { clave: mp3, texto: "El MP3 comprime el sonido con pérdida para ocupar menos." }
  - { clave: once, texto: "A 128 kilobits, ocupa unas once veces menos que sin comprimir." }
  - { clave: wav, texto: "El WAV suele guardar el sonido sin comprimir." }
  - { clave: flac, texto: "El FLAC lo comprime sin perder nada: suena igual y ocupa la mitad." }
  - { clave: trampa, texto: "Pero pasar un MP3 a WAV no devuelve lo perdido: solo ocupa más." }
  - { clave: mezcla, texto: "Y un WAV copia tal cual una mala mezcla o un máster saturado." }
  - { clave: cierre, texto: "¿Tú qué miras al comprar música: el formato o el tema?" }
cifras:
  - dato: "11 veces menos"
    texto: "Un MP3 a 128 kbit/s ocupa más o menos la undécima parte que el mismo audio sin comprimir."
    fuentes: [loc-mp3]
    matiz: "La proporción que da la Library of Congress es para 128 kbit/s. El MP3 que suena en el vídeo es de 32 kbit/s, mucho peor, para que la diferencia se oiga en el móvil; por eso el rótulo dice «muy comprimido» y no se dice que sea a 128."
  - dato: "La mitad"
    texto: "El FLAC comprime sin perder nada: suena igual que el WAV y ocupa más o menos la mitad."
    fuentes: [bandcamp-lossless, loc-flac, xiph-flac]
    matiz: "Bandcamp dice «about half the size»: es una aproximación. En pantalla va con la micro-línea «más o menos»."
fuentes:
  - clave: loc-mp3
    medio: Library of Congress
    titulo: "Ficha de formato: MP3"
    url: https://www.loc.gov/preservation/digital/formats/fdd/fdd000012.shtml
    tipo: oficial
    sostiene: "Que el MP3 es una codificación con pérdida que descarta o reduce la precisión de lo que menos se oye, y que a 128 kbit/s ocupa unas once veces menos que el audio LPCM sin comprimir."
    cita: "An MP3 file created with a bitrate of 128 kbit/s is about 1/11 the size of an uncompressed LPCM file"
    consultada: 2026-10-26
  - clave: loc-flac
    medio: Library of Congress
    titulo: "Ficha de formato: FLAC Family"
    url: https://www.loc.gov/preservation/digital/formats/fdd/fdd000657.shtml
    tipo: oficial
    sostiene: "Que el FLAC es sin pérdida: lo que sale del decodificador es idéntico bit a bit a lo que entró."
    cita: "the decoded audio is bit-for-bit identical to what went into the encoder"
    consultada: 2026-10-26
  - clave: xiph-flac
    medio: Xiph.Org
    titulo: "FLAC"
    url: https://xiph.org/flac/
    tipo: oficial
    sostiene: "Que el audio comprimido en FLAC no pierde calidad."
    cita: "compressed in FLAC without any loss in quality"
    consultada: 2026-10-26
  - clave: loc-wave
    medio: Library of Congress
    titulo: "Ficha de formato: WAVE"
    url: https://www.loc.gov/preservation/digital/formats/fdd/fdd000001.shtml
    tipo: oficial
    sostiene: "Que un archivo WAV puede llevar audio LPCM sin comprimir, la codificación más común. Por eso el vídeo dice «suele» y no «siempre»."
    consultada: 2026-10-26
  - clave: bandcamp-lossless
    medio: Bandcamp
    titulo: "How and why should I upload lossless files?"
    url: https://get.bandcamp.help/hc/en-us/articles/23020723948951-How-and-why-should-I-upload-lossless-files
    tipo: web
    sostiene: "Que el FLAC suena exactamente igual que el WAV y el AIFF y ocupa más o menos la mitad, y que no se recomienda convertir un MP3 a un formato sin pérdida."
    cita: "it sounds exactly the same as WAV and AIFF but creates files that are about half the size"
    consultada: 2026-10-26
creditos:
  imagenes:
    - "CDJ 2000: Fabexplosive, Wikimedia Commons, CC BY-SA 3.0 (blanco y negro)."
    - "USB flash drive, 1TB: EU+Mexico, Wikimedia Commons, CC0 (blanco y negro)."
    - "SanDisk Cruzer USB 4GB: Evan-Amos, Wikimedia Commons, dominio público (blanco y negro)."
    - "Compact disc 1: gausanchennai, Wikimedia Commons, CC BY-SA 4.0 (blanco y negro)."
    - "CDs, Seitenansicht 2212: Dietmar Rabich, Wikimedia Commons, CC BY-SA 4.0 (blanco y negro)."
    - "Seagate ST33232A hard disk inner view: Eric Gaba, Wikimedia Commons, CC BY-SA 3.0 (blanco y negro)."
    - "Studio Mastering: Giuliano Radiciotti, Wikimedia Commons, CC BY-SA 4.0 (blanco y negro)."
    - "Vinyl collection at a record store: Mr Cup / Fabien Barral, Wikimedia Commons, CC0 (blanco y negro)."
  musica: "Música: Funkhaus, «System Wake» (BCCX016, BCCO). Suena entera, como MP3 real a 32 kbit/s en los planos del MP3 y saturada en el de la mala mezcla."
  otros:
    - "Fondo: espectro de 40 bandas medido fotograma a fotograma sobre la música que suena."
correcciones: []
noDicho:
  - "Cuánto ocupa un MP3 a 320 kbit/s: la ficha de la Library of Congress da la proporción a 128 kbit/s; en pantalla, solo esa."
  - "Que el WAV vaya siempre sin comprimir: la Library of Congress dice que puede llevar LPCM, la codificación común. Por eso «suele»."
  - "La frecuencia a la que corta el MP3 que suena en el vídeo: la demostración no lleva cifra en pantalla."
  - "Marcas de tiendas de música: lo que se cuenta vale para todas."
preguntasAbiertas:
  - "¿Qué miras al comprar música, el formato o el tema? ¿Notas la diferencia entre un MP3 a 320 y un WAV en el equipo con el que pinchas?"
relacionados: [rojo, mesas, mezcla, cdjvinilo]
cuentas:
  - { red: instagram, usuario: bccoberlin, nombre: "BCCO" }
---

MP3, WAV y FLAC no son lo mismo. Ninguno es por sí solo sinónimo de calidad. Para quien pincha importa, porque una cabina cara no arregla un archivo pobre. Lo que suena depende primero de lo que llevas en el pendrive.

El MP3 comprime con pérdida. Descarta lo que menos se oye para ocupar menos. Según la Library of Congress, a 128 kbit/s ocupa más o menos la undécima parte que el audio sin comprimir. El FLAC comprime sin perder nada. Según Bandcamp, suena igual que un WAV y ocupa más o menos la mitad.

Pasar un MP3 a WAV no devuelve lo perdido. El archivo crece, pero el sonido es el mismo. Y un archivo sin pérdida también conserva los fallos de una mala mezcla.
