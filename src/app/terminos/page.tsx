import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso del servicio ROHU Contable. Incluye el SLA, limitación de responsabilidad y ley aplicable.',
};

/**
 * Legal skeleton approved by the legal-compliance-co agent.
 * Same caveat as /privacidad: must be completed and reviewed by a licensed
 * lawyer before publishing to production.
 */
export default function TermsPage() {
  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1>Términos y Condiciones</h1>
        <p className="mt-4 text-brand-muted">
          Estos términos regulan el uso del servicio <strong>ROHU Contable</strong> por parte del
          usuario final. La aceptación es expresa y requerida.
        </p>

        <div className="mt-10 flex flex-col gap-8 text-brand-text leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold">1. Objeto del Contrato</h2>
            <p className="mt-3 text-brand-muted">
              ROHU es una herramienta de soporte informativo y de gestión comercial y contable.{' '}
              <strong>No presenta declaraciones tributarias ante la DIAN</strong> ni reemplaza la
              labor de un contador público titulado.
            </p>
            <p className="mt-3 text-brand-muted">
              <strong>Alcance geográfico:</strong> el servicio se rige exclusivamente por la
              legislación colombiana. ROHU no garantiza adecuación a marcos normativos,
              tributarios ni contables de jurisdicciones distintas a Colombia, y el usuario es
              responsable de validar su cumplimiento local con asesores en su respectivo país.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">2. Aceptación de los Términos</h2>
            <p className="mt-3 text-brand-muted">
              La aceptación requiere un clic o checkbox explícito. El silencio no constituye
              aceptación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">3. Suscripción, Pagos y Cancelación</h2>
            <p className="mt-3 text-brand-muted">
              Se detallarán los planes, renovación automática y el derecho de retracto previsto en
              el <strong>Art. 47 de la Ley 1480/2011</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">4. Disponibilidad del Servicio (SLA)</h2>
            <p className="mt-3 text-brand-muted">
              Objetivo de disponibilidad aproximado del 99,5% mensual. Se describen las exclusiones
              (mantenimientos programados, fuerza mayor, fallas de terceros) y las compensaciones
              en créditos. No se garantiza disponibilidad del 100%.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">5. Limitación de Responsabilidad</h2>
            <p className="mt-3 text-brand-muted">
              No respondemos por daños indirectos, lucro cesante o decisiones tributarias del
              usuario. La responsabilidad total está topada a lo pagado en los últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">6. Propiedad Intelectual</h2>
            <p className="mt-3 text-brand-muted">
              ROHU conserva todos los derechos sobre el software. El usuario mantiene la propiedad
              de sus datos y puede exportarlos en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">7. Modificaciones a los Términos</h2>
            <p className="mt-3 text-brand-muted">
              Notificaremos con al menos 15 días de anticipación. El uso continuado del servicio
              tras la modificación constituye aceptación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">8. Causales de Suspensión y Terminación</h2>
            <p className="mt-3 text-brand-muted">
              Incluyen el incumplimiento de pago, el uso fraudulento y la violación material de
              estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">9. Ley Aplicable y Domicilio</h2>
            <p className="mt-3 text-brand-muted">
              Ley colombiana. Las controversias se resolverán por conciliación previa y los jueces
              competentes de Colombia.
            </p>
          </section>

          <div className="mt-6 rounded-brand-md border border-warning/40 bg-warning/5 p-4 text-xs text-brand-text">
            <strong>Nota importante:</strong> este documento es un esqueleto inicial y no reemplaza
            la revisión por parte de un abogado habilitado en Colombia antes de su publicación
            definitiva.
          </div>
        </div>
      </Container>
    </article>
  );
}
