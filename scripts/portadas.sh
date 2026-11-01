#!/usr/bin/env bash
# Convierte las portadas de los vídeos (PNG 1080×1920) a las dos versiones que usa la web:
#   public/portadas/<id>.webp  720×1280, para las tarjetas y la página del vídeo
#   public/portadas/<id>.jpg   540×960, para Open Graph, RSS y JSON-LD
# Uso: scripts/portadas.sh <carpeta con portada-<id>.png>   (necesita ImageMagick 7)
set -euo pipefail
origen="${1:?Indica la carpeta de las portadas (portada-<id>.png)}"
destino="$(dirname "$0")/../public/portadas"
mkdir -p "$destino"
for f in "$origen"/portada-*.png; do
  id="$(basename "$f" .png)"; id="${id#portada-}"
  magick "$f" -strip -resize 720x1280 -quality 82 "$destino/$id.webp"
  magick "$f" -strip -resize 540x960 -quality 85 "$destino/$id.jpg"
  echo "OK $id"
done
