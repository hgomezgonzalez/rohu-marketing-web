import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de tratamiento de datos personales de ROHU Contable, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.',
};

/**
 * Legal skeleton approved by the legal-compliance-co agent.
 * This is a placeholder: each H2 must be completed with the final NIT,
 * razón social, domicilio, datos del Oficial de Privacidad y los tiempos
 * de conservación definitivos ANTES de publicar en producción, y debe ser
 * revisada por un abogado habilitado en Colombia.
 */
export default function PrivacyPage() {
  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1>Política de Privacidad</h1>
        <p className="mt-4 text-brand-muted">
          Esta política describe cómo ROHU Soluciones trata los datos personales conforme a la{' '}
          <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong>.
        </p>

        <div className="mt-10 flex flex-col gap-8 text-brand-text leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold">1. Responsable del Tratamiento</h2>
            <p className="mt-3 text-brand-muted">
              ROHU Soluciones — [razón social, NIT, domicilio y contacto del Oficial de Privacidad
              por completar antes de publicar].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">2. Datos que Recolectamos</h2>
            <p className="mt-3 text-brand-muted">
              Datos de identificación y contacto (nombre, empresa, NIT, ciudad, email, WhatsApp) y
              datos de uso del sitio. No recolectamos datos sensibles ni de menores de edad.
            </p>
            <p className="mt-3 text-brand-muted">
              <strong>Marketplace ROHU Connect:</strong> los datos de proveedores independientes
              persona natural que operen en plataformas white-label de ROHU Connect (nombre, documento
              de identidad, ubicación, datos de contacto y antecedentes cuando aplique) son tratados
              por ROHU Solutions en calidad de Responsable del Tratamiento con finalidades de
              habilitación, verificación y gestión operativa del marketplace, y pueden ser
              transmitidos al cliente empresarial (operador de la plataforma white-label) en los
              términos del Art. 25 de la Ley 1581/2012. El proveedor persona natural tiene los mismos
              derechos de titular que cualquier otro usuario (conocer, actualizar, rectificar,
              suprimir y revocar), ejercibles ante el correo del Oficial de Privacidad indicado en la
              sección 1.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">3. Finalidades del Tratamiento</h2>
            <p className="mt-3 text-brand-muted">
              Atender solicitudes comerciales, enviar información del producto y prestar el
              servicio. El marketing requerirá un consentimiento separado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">4. Derechos del Titular</h2>
            <p className="mt-3 text-brand-muted">
              Conocer, actualizar, rectificar y suprimir sus datos, revocar la autorización y
              presentar quejas ante la SIC. Atenderemos las solicitudes en un plazo máximo de 15
              días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">5. Cómo Ejercer sus Derechos</h2>
            <p className="mt-3 text-brand-muted">
              A través del correo electrónico de privacidad indicado arriba, con una descripción
              clara de la solicitud y la identificación del titular.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">6. Transferencia y Transmisión de Datos</h2>
            <p className="mt-3 text-brand-muted">
              Podemos usar proveedores de infraestructura en la nube ubicados fuera de Colombia,
              siempre bajo garantías contractuales de seguridad y confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">7. Uso de Cookies</h2>
            <p className="mt-3 text-brand-muted">
              Usamos cookies técnicas y de analítica. Puedes gestionarlas desde tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">8. Vigencia</h2>
            <p className="mt-3 text-brand-muted">
              Los datos se conservan mientras exista una relación comercial o hasta que el titular
              solicite su eliminación, salvo obligaciones legales de conservación.
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
