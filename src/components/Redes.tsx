import { SITIO } from "@/lib/sitio";

export function IconoInstagram({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconoTiktok({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function SeguirInstagram({ secundario = false }: { secundario?: boolean }) {
  return (
    <a href={SITIO.instagram} target="_blank" rel="me noopener noreferrer" className={secundario ? "boton-secundario" : "boton"}>
      <IconoInstagram />
      Seguir en Instagram
    </a>
  );
}

export function Redes({ className = "" }: { className?: string }) {
  const enlaces = [
    { href: SITIO.instagram, nombre: "Instagram", icono: <IconoInstagram className="h-[18px] w-[18px]" /> },
    { href: SITIO.tiktok, nombre: "TikTok", icono: <IconoTiktok className="h-[17px] w-[17px]" /> },
  ];
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {enlaces.map((e) => (
        <li key={e.nombre}>
          <a href={e.href} target="_blank" rel="me noopener noreferrer" aria-label={`${SITIO.nombre} en ${e.nombre}`} title={e.nombre} className="red">
            {e.icono}
          </a>
        </li>
      ))}
    </ul>
  );
}
