# Solicitud de whitelist del dominio `rohu-solutions.com`

Plantilla para abrir un caso al Service Desk / Seguridad de la Información de
Telefónica Colombia pidiendo que se agregue `rohu-solutions.com` a la lista de
dominios permitidos del proxy web corporativo.

> El bloqueo no es por contenido: el dominio fue registrado el **2026-04-08** y
> el proxy corporativo lo está clasificando como *Newly Registered Domain*.
> Esta solicitud pide una excepción mientras los motores upstream
> (BrightCloud, Zscaler, Bluecoat, Forcepoint) completan la recategorización.

---

## Asunto

`Solicitud de whitelist de dominio corporativo legítimo: rohu-solutions.com`

## Cuerpo del ticket

Buen día, equipo de Seguridad de la Información.

Solicito agregar el dominio **`rohu-solutions.com`** (y su comodín
`*.rohu-solutions.com`) a la lista de dominios permitidos del proxy web
corporativo. Actualmente, al intentar acceder desde el equipo corporativo
aparece la pantalla **"Action Blocked — Revisa tu intento de acceso, es
posible que la página se encuentre restringida por políticas de seguridad de
la compañía"** con logo de Movistar. Adjunto la captura.

### Contexto de negocio

- El dominio corresponde al sitio corporativo de **ROHU Solutions**, casa de
  software que opera productos SaaS propios (p. ej. ROHU Contable, ROHU
  Connect) para mipymes en Colombia.
- Necesito acceder al sitio desde el equipo corporativo para operación y
  validación de cambios de marketing web del producto.
- El sitio es de contenido corporativo estándar (landing, productos, política
  de privacidad, términos, contacto). No hay material sensible ni
  categorías restringidas.

### Causa raíz probable

El dominio fue registrado el **2026-04-08** (hace pocos días). Los proxies
corporativos, por políticas anti-phishing, bloquean por default los dominios
categorizados como **"Newly Registered Domain"** (NRD) o "Uncategorized"
hasta que los motores de reputación upstream (BrightCloud, Zscaler,
Bluecoat, Forcepoint) los revisan y reclasifican. Ese proceso se está
tramitando en paralelo directamente con los proveedores, pero puede tomar
varios días.

### Evidencias técnicas de legitimidad

| Ítem | Valor |
|---|---|
| Dominio | `rohu-solutions.com` |
| Fecha de registro | `2026-04-08T01:11:58Z` (RDAP Verisign) |
| Expiración | `2027-04-08T01:11:58Z` |
| Registrar | Namecheap |
| Nameservers | `dns1.registrar-servers.com`, `dns2.registrar-servers.com` |
| HTTP apex | `HTTP/2 200 OK` (verificado vía `curl -I https://rohu-solutions.com`) |
| HTTP www | `HTTP/2 200 OK` |
| Hosting | Heroku (buildpack Node.js/Next.js) |
| Certificado TLS | Válido (Let's Encrypt / Heroku ACM) |
| Headers de seguridad | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| `robots.txt` | Declarado y accesible en `https://rohu-solutions.com/robots.txt` |
| `sitemap.xml` | Declarado y accesible en `https://rohu-solutions.com/sitemap.xml` |
| JSON-LD Organization | Presente en el HTML con `addressCountry: CO` |
| Blacklists (Spamhaus, SURBL, URIBL) | 0 listados (verificar con MXToolbox) |

### Lo que pido

1. Agregar a la whitelist corporativa del proxy web:
   - `rohu-solutions.com`
   - `www.rohu-solutions.com`
   - `*.rohu-solutions.com`
2. Opcionalmente, reclasificar el dominio como **"Business / Information
   Technology"** en la base local del proxy.
3. Confirmar por este medio cuándo queda aplicado el cambio.

### Trámites paralelos ya iniciados con proveedores upstream

En paralelo a este ticket estoy gestionando la recategorización del dominio
directamente con los motores de reputación web que alimentan al proxy
corporativo:

- BrightCloud (Webroot / OpenText)
- Cisco Talos (Umbrella)
- Palo Alto Networks PAN-DB
- FortiGuard (Fortinet)
- Zscaler
- Symantec / Bluecoat SiteReview
- Forcepoint CSI
- McAfee / Trellix TrustedSource

Una vez esos proveedores actualicen su catálogo, la categorización se
propagará automáticamente al proxy corporativo, pero mientras tanto la
whitelist manual me desbloquea el acceso.

Quedo atento. Gracias.

— Héctor Gómez
