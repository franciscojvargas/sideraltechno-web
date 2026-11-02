# Sideral Techno

Cultura techno en vídeos cortos. Cada dato, con su fuente.

**[sideraltechno.com](https://sideraltechno.com)** · [Instagram](https://www.instagram.com/sideral_techno/) · [TikTok](https://www.tiktok.com/@sideraltechno)

Sideral Techno cuenta la historia de clubs, festivales, artistas y la ciencia del sonido en la pista. En vídeos cortos para Instagram y TikTok.
Esta web es su archivo: cada vídeo tiene su página con un texto breve, las cifras que se dicen y las fuentes de cada una.

## Cómo trabajamos

- **Cada cifra tiene una fuente.** Si no se puede comprobar, no se dice.
- **Si dos fuentes se contradicen**, el dato no se usa o se dice «según…».
- **Los errores se corrigen en público.** Quedan anotados en la página del vídeo y, si hace falta, se corrigen en un vídeo nuevo.

## ¿Un dato mal o una fuente mejor?

Escríbenos a **[sideraltechno2026@gmail.com](mailto:sideraltechno2026@gmail.com)**. Cada página de vídeo tiene un enlace que abre el correo con el asunto ya escrito.

## Cómo está hecha

Una web estática con [Next.js](https://nextjs.org) y [Tailwind CSS](https://tailwindcss.com). Sin base de datos, sin formularios y sin cookies.

```
content/videos/   un fichero Markdown por vídeo: datos, cifras, fuentes y texto
public/portadas/  la portada de cada vídeo
src/              la web
tests/            pruebas del contenido y del repositorio
```

El esquema de `src/lib/schema.ts` valida cada ficha al compilar: una cifra sin fuente o una fecha mal escrita impiden publicar.

```bash
npm install
npm run dev        # http://localhost:3000
npm run comprobar  # validación, tipos, lint y pruebas
npm run build
```

## Seguridad

Si encuentras un fallo de seguridad, escríbenos al correo de arriba (también en [`/.well-known/security.txt`](public/.well-known/security.txt)). Por favor, no lo publiques antes de que podamos corregirlo.

## Derechos

© 2026 Sideral Techno. El código, los textos y las portadas son de Sideral Techno; todos los derechos reservados.
Las imágenes de terceros se usan con permiso o con licencia libre, y el crédito de cada una está en la página de su vídeo.
Mapas © colaboradores de OpenStreetMap (ODbL). La voz de los vídeos está generada con IA y etiquetada como tal.
