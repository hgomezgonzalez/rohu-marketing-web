# ROHU Solutions Marketing Web

Sitio web corporativo y de ventas para **ROHU Solutions**, empresa colombiana que desarrolla aplicaciones SaaS para el comercio y las pymes. **ROHU Contable** es la primera aplicación del catálogo; más se agregarán con el tiempo y el sitio está preparado para escalar sin refactors.

Producto-demo de ROHU Contable: https://rohu-contable-prod-3fba93dd2eb4.herokuapp.com/

> **Idioma UI:** Español (Colombia) · **Código:** Inglés
> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · react-hook-form · zod · nodemailer

---

## Tabla de contenidos

1. [Arquitectura multi-aplicación](#arquitectura-multi-aplicación)
2. [Cómo agregar una nueva aplicación al catálogo](#cómo-agregar-una-nueva-aplicación-al-catálogo)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Setup local](#setup-local)
5. [Variables de entorno](#variables-de-entorno)
6. [Configurar notificaciones por correo (Gmail SMTP)](#configurar-notificaciones-por-correo-gmail-smtp)
7. [Configuración del bot de Telegram](#configuración-del-bot-de-telegram)
8. [Despliegue GitHub → Heroku](#despliegue-github--heroku)
9. [Checklist final](#checklist-final)
10. [Resumen de orquestación de agentes](#resumen-de-orquestación-de-agentes)

---

## Arquitectura multi-aplicación

El sitio está estructurado como un **hub corporativo**:

- **`/`** — landing corporativa de ROHU Solutions: hero empresarial + grid dinámico de aplicaciones + about + proceso + testimonios + FAQs corporativas + formulario de contacto con selector "Aplicación de interés".
- **`/productos/[slug]`** — landing dedicada por aplicación, generada automáticamente desde el registry. Hoy existe `/productos/rohu-contable`. Las aplicaciones `coming_soon` aparecen en el grid de la home pero no tienen página propia.
- **`/privacidad` y `/terminos`** — páginas legales compartidas por toda la empresa.
- **`/gracias`** — thank-you post-lead, corporativo.

**Registry central:** `src/lib/applications.ts` es la fuente única de verdad. Contiene un array tipado `Application[]` con TODO el contenido de cada app (hero, beneficios, módulos, pricing, FAQs, demo, metadata, testimonials). El home grid, las páginas dinámicas, el sitemap y el selector del formulario leen de ahí.

**Backend del formulario:**
- POST a `/api/leads`:
  1. Valida con zod (mismo schema del cliente).
  2. Persiste en `data/leads.json` (dev/demo) con campo `application`.
  3. **Envía email** al dueño vía SMTP (Gmail recomendado).
  4. **Notifica en Telegram** al dueño (push instantáneo en el móvil).
  5. Reenvía (opcional) a un webhook CRM si `LEAD_API_URL` está definido.
- Rate limit in-memory (5 envíos/minuto por IP) + honeypot anti-bot.

**Canal de contacto en vivo:**
- **WhatsApp click-to-chat** visible al visitante (FAB flotante, Hero y Footer).
- **Telegram Bot** opcional como canal paralelo de notificación instantánea al dueño.

**Tracking:** `window.dataLayer` propio con eventos:
- `view_company_home`, `view_application_page`, `click_application_card`
- `click_demo`, `copy_demo_credentials`, `click_pricing`
- `submit_lead`, `submit_lead_success`, `submit_lead_error`
- `click_whatsapp_fab`, `click_whatsapp_hero`, `click_telegram`, `click_faq`

Todos los eventos que aplican llevan `application_id` para poder segmentar por producto.

**SEO técnico:** metadata global de ROHU Solutions, JSON-LD `Organization` en el layout, `SoftwareApplication` por cada `/productos/[slug]`, sitemap dinámico que incluye todas las apps `live`, Open Graph y Twitter cards.

---

## Cómo agregar una nueva aplicación al catálogo

Proceso en **4 pasos** cuando estés listo para publicar `ROHU Restaurantes` (o cualquier otra):

1. **Abre `src/lib/applications.ts`**. Ahí verás el array `applications` con `rohu-contable` como entrada `live` y varias apps `coming_soon`.
2. **Convierte la entrada `coming_soon` en `live`** cambiando `status: 'live'` y llenando todos los campos que ahora están vacíos (`hero`, `benefits`, `modules`, `pricing`, `faqs`, `socialProof`, `ctaFinal`, `metaTitle`, `metaDescription`, `demo` si aplica).
3. **Verifica** corriendo `npm run build`. Next.js generará automáticamente una página estática en `/productos/<tu-slug>`. Si falta algún campo, TypeScript te avisará.
4. **Commit + push** a `main`. Heroku despliega y la app aparece inmediatamente en el grid de la home corporativa y en el selector del formulario.

Si quieres agregar una app desde cero (no estaba en el registry), copia cualquier entrada existente, cambia `id`, `slug`, `name` y llena el contenido. El sistema no necesita ningún cambio de código adicional.

---

## Estructura del proyecto

```
rohu-marketing-web/
├── public/                       # logo, favicon
├── data/                         # leads.json (gitignored, dev-only)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # fonts, metadata ROHU Solutions, Org JSON-LD, Header, Footer, FAB
│   │   ├── page.tsx              # landing corporativa
│   │   ├── gracias/page.tsx      # thank-you post-lead
│   │   ├── privacidad/page.tsx
│   │   ├── terminos/page.tsx
│   │   ├── productos/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # landing dinámica por aplicación
│   │   │       └── not-found.tsx
│   │   ├── api/leads/route.ts    # POST → leadsStore + sendLeadEmail + notifyTelegram
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/               # Header, Footer
│   │   ├── sections/             # Sections: Company (corporativas) + Application (por app)
│   │   ├── ui/                   # Button, Card, Badge, BrandLogo, WhatsAppFab, etc.
│   │   ├── forms/                # LeadForm + schema
│   │   ├── CompanyViewTracker.tsx
│   │   └── ApplicationViewTracker.tsx
│   ├── lib/
│   │   ├── applications.ts       # Registry multi-app (fuente única de verdad)
│   │   ├── content.ts            # siteConfig, companyContent, commonContent
│   │   ├── analytics.ts          # trackEvent + EVENTS
│   │   ├── contactChannels.ts    # wa.me / t.me builders
│   │   ├── notifyTelegram.ts     # push al bot del dueño
│   │   ├── sendLeadEmail.ts      # email server-only con nodemailer
│   │   ├── leadsStore.ts         # JSON-file persistence (dev/demo)
│   │   └── cn.ts
│   ├── styles/globals.css
│   └── types/
│       ├── lead.ts
│       └── pricingTier.ts
├── .env.example                  # plantilla de variables
├── Procfile                      # Heroku: web: npm start
├── app.json                      # Heroku review apps + config vars
├── next.config.mjs               # security headers
├── tailwind.config.ts            # brand tokens
└── tsconfig.json
```

---

## Setup local

```bash
cd rohu-marketing-web
cp .env.example .env.local
# edita .env.local con tus valores (WhatsApp, Telegram bot, SMTP App Password, etc.)
npm install
npm run dev
```

Abre http://localhost:3000

### Scripts disponibles

| Script | Propósito |
|---|---|
| `npm run dev` | Dev server con hot reload |
| `npm run build` | Build de producción |
| `npm start` | Server de producción (usa `$PORT`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## Variables de entorno

Ver `.env.example`. Las más críticas:

| Variable | Alcance | Obligatoria | Descripción |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Público | Sí | URL canónica para sitemap/OG |
| `NEXT_PUBLIC_DEMO_URL` | Público | Sí | URL del demo de ROHU Contable |
| `NEXT_PUBLIC_DEMO_USER` | Público | Sí | `demo@rohu-contable.com` |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Público | Sí | `demo1234` |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Público | Sí | Teléfono en E.164 sin `+` |
| `NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE` | Público | Sí | Mensaje pre-llenado |
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | Público | No | Username sin `@` |
| `TELEGRAM_BOT_TOKEN` | **Servidor** | Opcional | Token del bot (secret) |
| `TELEGRAM_CHAT_ID` | **Servidor** | Opcional | Chat ID del dueño (secret) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | **Servidor** | Para enviar email | Host SMTP (Gmail: smtp.gmail.com, 587, false) |
| `SMTP_USER` | **Servidor** | Para enviar email | Usuario SMTP (email completo) |
| `SMTP_PASS` | **Servidor** | Para enviar email | **App Password** de Gmail (16 caracteres). Nunca tu password normal. |
| `SMTP_FROM` | **Servidor** | Para enviar email | `"ROHU Solutions <hgomezgonzalez@gmail.com>"` |
| `SMTP_TO` | **Servidor** | Para enviar email | Destino del correo (puede ser el mismo remitente) |
| `LEAD_API_URL` | **Servidor** | Opcional | Webhook CRM al que reenviar cada lead |

> ⚠️ **Seguridad crítica**: los valores de `SMTP_PASS`, `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` son **secretos**. Van en `.env.local` (gitignored) o en Heroku Config Vars. **Nunca** los commitees al repo. **Nunca** los prefijees con `NEXT_PUBLIC_` — eso los expone al navegador.

---

## Configurar notificaciones por correo (Gmail SMTP)

Cada vez que un lead envía el formulario, se dispara un correo al dueño con todos los datos y botones "Responder por WhatsApp" y "Abrir email". Usamos Gmail con **App Password** porque es gratuito, seguro y funciona sin verificar dominios.

### Paso 1 — Activar 2FA en tu cuenta Google
Ve a https://myaccount.google.com/security → **Verificación en 2 pasos** → activa. Esto es **requisito** para generar App Passwords.

### Paso 2 — Generar una App Password
1. Abre https://myaccount.google.com/apppasswords
2. En "Nombre de la aplicación" escribe: `ROHU Marketing Web`
3. Click **Crear**.
4. **Copia el token de 16 caracteres** que Google muestra (ejemplo: `abcd efgh ijkl mnop`). Google **no volverá a mostrarlo**, así que guárdalo de inmediato.

### Paso 3 — Configurar `.env.local`
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=hgomezgonzalez@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM="ROHU Solutions <hgomezgonzalez@gmail.com>"
SMTP_TO=hgomezgonzalez@gmail.com
```
Nodemailer acepta el token con o sin espacios.

### Paso 4 — Probar
```bash
npm run dev
```
Abre http://localhost:3000/#contact, llena el formulario y envíalo. En menos de 10 segundos debes recibir un correo con:
- Subject: `🟢 Nuevo lead · ROHU Solutions · <app> · <nombre>`
- HTML con tabla de datos + botones "Responder por WhatsApp" y "Abrir email"
- `Reply-To` apuntando al correo del lead (puedes responder directamente con "Responder")

### Paso 5 — Producción (Heroku)
```bash
heroku config:set \
  SMTP_HOST=smtp.gmail.com \
  SMTP_PORT=587 \
  SMTP_SECURE=false \
  SMTP_USER=hgomezgonzalez@gmail.com \
  SMTP_PASS="abcd efgh ijkl mnop" \
  SMTP_FROM="ROHU Solutions <hgomezgonzalez@gmail.com>" \
  SMTP_TO=hgomezgonzalez@gmail.com
```

> Si no configuras SMTP, el formulario **sigue funcionando** — el lead se persiste y se envía a Telegram/CRM si están configurados. Solo se omite el email con un `console.warn`.

**Límites de Gmail SMTP**: ~500 emails/día para cuentas gratuitas. Más que suficiente para leads iniciales. Cuando escales, migra a Resend o SendGrid cambiando solo las env vars `SMTP_*`.

---

## Configuración del bot de Telegram

Opcional pero muy recomendado. Permite recibir notificaciones push instantáneas en el móvil.

1. Abre Telegram → busca [`@BotFather`](https://t.me/BotFather) → envía `/newbot`.
2. Elige nombre y username (debe terminar en `bot`).
3. **Copia el TOKEN** que devuelve BotFather.
4. Abre tu bot → envía `/start` (esto autoriza al bot a escribirte).
5. Abre en navegador: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Busca `"chat":{"id":123456789,...}` → **copia ese número**.
7. Pega en `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABC-DEF...
   TELEGRAM_CHAT_ID=123456789
   ```

---

## Despliegue GitHub → Heroku

**Principio:** GitHub es fuente de verdad. Heroku se suscribe al repo y despliega automáticamente en cada push a `main`. **Nunca se usa `git push heroku main`.**

### 1. Publicar el scaffold a GitHub

```bash
cd rohu-marketing-web
git status                                 # verifica qué va a commitearse
git diff --staged                          # revisa que NO haya .env.local ni secretos
git add .
git commit -m "feat: rebrand to rohu solutions with multi-app registry"

# Opción A — con gh CLI (recomendada)
gh repo create rohu-marketing-web --public --source=. --remote=origin --push

# Opción B — manual
# 1. Crear repo vacío en github.com/<user>/rohu-marketing-web
# 2. git remote add origin git@github.com:<user>/rohu-marketing-web.git
# 3. git push -u origin main
```

### 2. Crear la app en Heroku

```bash
heroku create rohu-marketing-web

heroku config:set \
  NEXT_PUBLIC_SITE_URL=https://rohu-marketing-web.herokuapp.com \
  NEXT_PUBLIC_DEMO_URL=https://rohu-contable-prod-3fba93dd2eb4.herokuapp.com/ \
  NEXT_PUBLIC_DEMO_USER=demo@rohu-contable.com \
  NEXT_PUBLIC_DEMO_PASSWORD=demo1234 \
  NEXT_PUBLIC_WHATSAPP_PHONE=57300XXXXXXX \
  "NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE=Hola, me interesa ROHU Solutions y quiero más información." \
  SMTP_HOST=smtp.gmail.com \
  SMTP_PORT=587 \
  SMTP_SECURE=false \
  SMTP_USER=hgomezgonzalez@gmail.com \
  SMTP_PASS="tu-app-password-de-gmail" \
  "SMTP_FROM=ROHU Solutions <hgomezgonzalez@gmail.com>" \
  SMTP_TO=hgomezgonzalez@gmail.com \
  NPM_CONFIG_PRODUCTION=false
```

### 3. Conectar Heroku al repo (UI, una sola vez)

1. Heroku Dashboard → tu app → **Deploy**.
2. **Deployment method** → **GitHub** → **Connect to GitHub** → autoriza.
3. Busca `rohu-marketing-web` → **Connect**.
4. **Automatic deploys** → rama `main` → **Enable Automatic Deploys**.
5. **Manual deploy** → **Deploy Branch** (primer deploy).

### 4. Flujo diario

```bash
git checkout -b feat/new-app
# agrega una entrada en src/lib/applications.ts con status: 'live'
npm run build                              # verifica localmente
git commit -am "feat(applications): add rohu-restaurantes"
git push origin feat/new-app
# abrir PR → mergear a main → Heroku despliega solo.
```

### Despliegue alternativo: Vercel

```bash
npm i -g vercel
vercel
# agrega las variables de entorno desde el dashboard de Vercel
```

---

## Checklist final

### Bugfix formulario (Fase 2)
- [ ] Llenar el formulario en `/productos/rohu-contable` con datos válidos → redirige a `/gracias` sin campos rojos.
- [ ] `data/leads.json` contiene el lead con `application: 'rohu-contable'`.

### SMTP
- [ ] `.env.local` tiene `SMTP_PASS` con un App Password válido.
- [ ] Envío de formulario → en <10s llega un correo al `SMTP_TO` con los datos del lead.
- [ ] El subject incluye el nombre del lead y la aplicación seleccionada.
- [ ] El `Reply-To` apunta al correo del lead (puedes responder directo).
- [ ] Sin `SMTP_PASS` el formulario sigue funcionando (email omitido con `console.warn`).

### Multi-app
- [ ] `/` muestra home corporativa con hero + grid dinámico de aplicaciones.
- [ ] `ROHU Contable` aparece con badge "Disponible" y CTA activo.
- [ ] Las apps `coming_soon` (Restaurantes, Inmobiliario, Salud, Educación) aparecen con badge "Próximamente" y CTA deshabilitado.
- [ ] Click en "ROHU Contable" → va a `/productos/rohu-contable` con la landing completa.
- [ ] URL inválida `/productos/foo` → 404 con link a `/`.
- [ ] El formulario de `/productos/rohu-contable` tiene "Aplicación de interés" pre-seleccionado en "ROHU Contable".
- [ ] El formulario de `/` muestra "Asesoría general" por default.

### Performance + SEO
- [ ] `npm run build` sin errores ni warnings críticos.
- [ ] `/sitemap.xml` incluye `/`, `/productos/rohu-contable`, `/privacidad`, `/terminos`.
- [ ] Lighthouse ≥ 90 en mobile y desktop (home y página de app).
- [ ] JSON-LD `Organization` en `/`; `SoftwareApplication` en `/productos/[slug]`.
- [ ] Title de `/` es `ROHU Solutions — Soluciones tecnológicas para el comercio colombiano`.
- [ ] Title de `/productos/rohu-contable` es `ROHU Contable · ROHU Solutions`.

### Accesibilidad y responsive
- [ ] WCAG AA contrastes OK.
- [ ] Mobile 375px / tablet 768px / desktop 1280px se ven bien.
- [ ] Nav mobile con hamburger funciona.
- [ ] Skip-to-content link accesible.

### Seguridad
- [ ] `.env.local` NO en git status.
- [ ] `data/leads.json` gitignored.
- [ ] `SMTP_PASS` y `TELEGRAM_BOT_TOKEN` en Config Vars de Heroku, nunca en el repo.
- [ ] Credenciales demo marcadas como "datos ficticios — acceso público".

---

## Resumen de orquestación de agentes

Este sitio fue construido orquestando **10 agentes especializados** (ROHU brand/copy/legal/analytics/payments/CRM/support/funnel/growth/frontend) en dos fases:

**Fase 1** — Scaffold inicial como landing de ROHU Contable. Los agentes aportaron: ICP, propuesta de valor, tokens Tailwind, copy completo, disclaimer DIAN canónico, texto Habeas Data, taxonomía de eventos, mapping CRM, FAQs operativas y copy de la página `/gracias`.

**Fase 2** — Bugfix forwardRef del formulario, integración SMTP con Gmail App Password y rebrand a ROHU Solutions con arquitectura multi-aplicación. Los agentes validaron el posicionamiento corporativo, el sistema visual para multi-app (ApplicationCard, badges de status), el copy corporativo (home, about, proceso, FAQs corporativas) y los nuevos eventos de analytics.

Ver detalles completos del plan en: `~/.claude/plans/crystalline-jumping-dusk.md`

### Notas y próximos pasos

- **Persistencia en producción**: `data/leads.json` es solo para desarrollo. En Heroku (filesystem efímero) los leads se guardan únicamente por email y por Telegram. Para producción real, configurar `LEAD_API_URL` hacia un CRM o migrar a Postgres/Supabase.
- **Nuevas apps**: usar el registry en `src/lib/applications.ts` siguiendo los 4 pasos de "Cómo agregar una nueva aplicación al catálogo".
- **Checkout real**: cuando se integre Wompi o Stripe, la interface `PricingTier` ya tiene los campos `stripePriceId`, `wompiPlanRef`, `monthlyPriceCOP` reservados.
- **Legal**: las páginas `/privacidad` y `/terminos` son esqueletos aprobados pero **deben ser revisados por un abogado habilitado en Colombia** antes de producción.
