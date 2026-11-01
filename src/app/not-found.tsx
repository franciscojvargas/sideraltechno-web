import Link from "next/link";

export default function NoEncontrado() {
  return (
    <section className="marco py-32">
      <p className="etiqueta mb-4">404</p>
      <h1 className="titular text-[clamp(2.4rem,7vw,5rem)]">Aquí no hay señal</h1>
      <span className="regla mt-6" />
      <p className="mt-8 max-w-prose text-lg text-gris">La página no existe o el vídeo todavía no se ha publicado.</p>
      <Link href="/" className="boton mt-10">Ver los vídeos</Link>
    </section>
  );
}
