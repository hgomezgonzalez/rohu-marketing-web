import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getLiveApplications } from '@/lib/applications';

export default function ApplicationNotFound() {
  const liveApps = getLiveApplications();

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <p className="eyebrow">404 · Aplicación no encontrada</p>
        <h1 className="mt-4 text-brand-text">Esta aplicación no está disponible</h1>
        <p className="mt-4 text-brand-muted leading-relaxed">
          La aplicación que buscas no existe o todavía no ha sido publicada. Estas son las
          aplicaciones actualmente disponibles en ROHU Solutions:
        </p>

        {liveApps.length > 0 && (
          <ul className="mt-8 flex flex-col gap-3 items-center">
            {liveApps.map((app) => (
              <li key={app.id}>
                <Link
                  href={`/productos/${app.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  {app.name} — {app.tagline}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <Link href="/" className="btn-secondary px-6 py-3">
            <ArrowLeft size={18} strokeWidth={2} />
            Volver al inicio
          </Link>
        </div>
      </Container>
    </section>
  );
}
