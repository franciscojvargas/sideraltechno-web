# Sideral Techno

La versión ampliada de los vídeos de [Sideral Techno](https://www.instagram.com/sideral_techno/): cultura techno, cada dato con su fuente.
Cada vídeo tiene su página con la historia completa y las cifras con su fuente. Todo el contacto va por correo (`mailto:`), sin formularios.

## Tecnología

| Pieza | Qué | Por qué |
|---|---|---|
| [Next.js 16](https://nextjs.org) (App Router, Cache Components) | Todas las páginas se generan al compilar | Rápida, barata, ideal para Vercel; SEO completo sin servidor |
| Markdown + YAML en `content/videos/` | Un fichero por vídeo | El contenido se revisa en pull requests y queda versionado |
| [zod](https://zod.dev) | Esquema del contenido (`src/lib/schema.ts`) | Una cifra sin fuente o una fecha mal escrita rompen la compilación |
| Enlaces `mailto:` | Contacto y correcciones | Sin formularios, sin servidor de correo, sin datos guardados |
| Tailwind CSS 4 | Estilos | La identidad de la marca como tokens en `src/app/globals.css` |
| Vercel Analytics | Visitas | Sin cookies |

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellena lo que necesites
npm run dev                  # http://localhost:3000 (en desarrollo se ven también los borradores)
```

| Orden | Qué hace |
|---|---|
| `npm run validar` | Comprueba todo `content/videos/` contra el esquema |
| `npm run comprobar` | Validar + tipos + lint + pruebas (lo mismo que la integración continua) |
| `npm run build` | Compila (valida antes) |

## Añadir un vídeo

1. Crea `content/videos/<id>.md` con lo mínimo:

   ```yaml
   ---
   id: florida
   numero: "009"
   titulo: "Florida 135: ¿el club más importante de España?"
   resumen: "Una frase de menos de 160 caracteres: es lo que enseña Google."
   estado: publicado
   publicado: 2026-10-24
   instagram: De4sxoXT0-C        # el código del reel
   cifras:
     - { dato: "1942", texto: "Abre el Cine Florida.", fuentes: [heraldo] }
   fuentes:
     - { clave: heraldo, medio: Heraldo de Aragón, tipo: prensa, url: https://… }
   ---

   Dos o tres párrafos cortos (90–140 palabras): qué es, dónde está y los datos más curiosos.
   ```

2. Pon la portada en `public/portadas/<id>.webp` y `<id>.jpg` (`scripts/portadas.sh <carpeta>` las genera desde los PNG 1080×1920).
3. `npm run validar` y sube el cambio. Al fusionar, Vercel publica.

Reglas: cada cifra cita una fuente; solo se enlazan URL comprobadas; un error público se anota en `correcciones`. Los vídeos con `estado: borrador` no se publican.

## Despliegue en Vercel

1. Importa el repositorio en Vercel (detecta Next.js; no hace falta configurar nada más).
2. Variables de entorno (Production): `NEXT_PUBLIC_SITE_URL` con el dominio definitivo y `NEXT_PUBLIC_CORREO` con el correo de contacto.
3. Añade el dominio en *Settings > Domains*. Las vistas previas no se indexan (`robots.txt` lo impide fuera de producción).

## Seguridad

- Nada secreto se sube: `.gitignore` excluye variables de entorno, claves, certificados, borradores y ficheros de herramientas locales. `tests/repositorio.test.ts` falla si algo así entra en el repositorio o si un fichero contiene un token.
- La web es estática y no tiene formularios ni base de datos. Las cabeceras de `next.config.ts` fijan una política de contenido estricta (CSP), HSTS y aislamiento entre orígenes.
- La integración continua solo lee el repositorio y corta si `npm audit` encuentra fallos graves. Dependabot propone las actualizaciones cada semana.
- Para avisar de un fallo de seguridad: `/.well-known/security.txt`.

## Privacidad

La web no tiene formularios ni guarda datos: el contacto se hace desde el programa de correo de cada persona.

## Derechos

El código y los textos son de Sideral Techno. Las portadas pueden incluir imágenes de terceros usadas con permiso o con licencia libre: el crédito
de cada una está en la página de su vídeo. Mapas © colaboradores de OpenStreetMap (ODbL).
