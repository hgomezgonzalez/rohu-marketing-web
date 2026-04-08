# ROHU Marketing Web

Sitio web de marketing y ventas para **ROHU Contable** (SaaS contable colombiano).
Producto-demo: https://rohu-contable-prod-3fba93dd2eb4.herokuapp.com/

> **Idioma UI:** Español (Colombia) · **Código:** Inglés
> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · react-hook-form · zod

---

## Tabla de contenidos

1. [Arquitectura](#arquitectura)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Setup local](#setup-local)
4. [Variables de entorno](#variables-de-entorno)
5. [Configuración del bot de Telegram](#configuración-del-bot-de-telegram)
6. [Despliegue GitHub → Heroku](#despliegue-github--heroku)
7. [Checklist final](#checklist-final)
8. [Coordinación de agentes (resumen)](#coordinación-de-agentes-resumen)

---

## Arquitectura

- **Landing one-pager** + páginas legales (`/privacidad`, `/terminos`) + thank-you (`/gracias`).
- **Formulario de leads** con `react-hook-form` + `zod`. POST a `/api/leads`:
  1. Persiste en `data/leads.json` (dev/demo).
  2. Notifica al dueño vía **Telegram Bot** (push instantáneo al celular).
  3. Reenvía (opcional) a un webhook CRM si `LEAD_API_URL` está definido.
- **Canal de contacto en vivo:**
  - **WhatsApp click-to-chat** visible al visitante (FAB flotante, Hero, Footer).
  - **Telegram Bot** como canal de notificación al dueño (siempre en línea).
- **Tracking** con `window.dataLayer` propio (eventos listados en `src/lib/analytics.ts`). Queda preparado para conectar GA4/PostHog sin tocar call sites.
- **SEO técnico:** metadata, Open Graph, Twitter card, `sitemap.ts`, `robots.ts`, JSON-LD (`Organization` + `SoftwareApplication`).
- **Performance:** Next.js Image, fuentes con `display: swap`, Tailwind con purge, sin librerías pesadas.
- **Seguridad:** headers básicos en `next.config.mjs`, rate limit in-memory en `/api/leads`, honeypot anti-bot, credenciales demo marcadas como públicas.

---

## Estructura del proyecto

```
rohu-marketing-web/
├── public/
│   ├── rohu_logo.png
│   └── rohu_favicon.ico
├── data/                         # leads.json generated at runtime (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # fonts, metadata, JSON-LD, header, footer, FAB
│   │   ├── page.tsx              # landing
│   │   ├── gracias/page.tsx
│   │   ├── privacidad/page.tsx
│   │   ├── terminos/page.tsx
│   │   ├── api/leads/route.ts    # POST handler
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/               # Header, Footer
│   │   ├── sections/             # Hero, Benefits, Audience, HowItWorks, Modules, Pricing, SocialProof, Faq, Cta, DemoAccessBlock
│   │   ├── ui/                   # Button, Card, Badge, Container, SectionHeading, CopyToClipboardButton, Accordion, BrandLogo, DynamicIcon, WhatsAppFab
│   │   ├── forms/                # LeadForm + leadFormSchema (zod)
│   │   └── LandingViewTracker.tsx
│   ├── lib/
│   │   ├── content.ts            # ES copy — single source of truth
│   │   ├── modules.ts
│   │   ├── pricingTiers.ts
│   │   ├── faqs.ts
│   │   ├── analytics.ts          # dataLayer push + event constants
│   │   ├── contactChannels.ts    # WhatsApp/Telegram URL builders
│   │   ├── notifyTelegram.ts     # server-only push to owner's Telegram
│   │   ├── leadsStore.ts         # JSON-file persistence (dev/demo)
│   │   └── cn.ts
│   ├── styles/globals.css
│   └── types/lead.ts
├── .env.example
├── Procfile
├── app.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Setup local

```bash
cd rohu-marketing-web
cp .env.example .env.local
# edit .env.local with your values (WhatsApp phone, Telegram bot, etc.)
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
| `NEXT_PUBLIC_DEMO_USER` | Público | Sí | Usuario demo (público por diseño) |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Público | Sí | Clave demo (pública por diseño) |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Público | Sí | Teléfono en E.164 sin `+` |
| `NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE` | Público | Sí | Mensaje pre-llenado |
| `NEXT_PUBLIC_TELEGRAM_USERNAME` | Público | No | Username sin `@` |
| `TELEGRAM_BOT_TOKEN` | **Servidor** | Recomendada | Token del bot (secret) |
| `TELEGRAM_CHAT_ID` | **Servidor** | Recomendada | Chat ID del dueño (secret) |
| `LEAD_API_URL` | **Servidor** | Opcional | Webhook CRM al que reenviar cada lead |

> ⚠️ Nunca prefijes secretos con `NEXT_PUBLIC_`. Los `NEXT_PUBLIC_*` se exponen al navegador.

---

## Configuración del bot de Telegram

El bot notifica al dueño del negocio **cada vez que un lead envía el formulario**. Así puede responder en tiempo real desde el celular sin estar "siempre en la web".

### Paso 1 — Crear el bot
1. Abre Telegram → busca [`@BotFather`](https://t.me/BotFather) → envía `/newbot`.
2. Elige un nombre y un username (debe terminar en `bot`).
3. **Copia el TOKEN** que te devuelve BotFather.

### Paso 2 — Autorizar al bot para enviarte mensajes
1. Abre el bot recién creado.
2. Envíale `/start` (esto "abre" la conversación y permite que te escriba).

### Paso 3 — Obtener tu chat ID
1. Abre en tu navegador: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   (reemplaza `<TOKEN>` por tu token real).
2. Busca un bloque similar a `"chat":{"id":123456789,...}`.
3. **Copia ese número** — es tu `TELEGRAM_CHAT_ID`.

### Paso 4 — Configurar en `.env.local`
```env
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789
```

### Paso 5 — Probar el envío
Envía un formulario de prueba desde la landing. En menos de 3 segundos debes recibir un mensaje en Telegram con los datos del lead y dos botones inline:
- **📲 Responder por WhatsApp** — abre la conversación con el `wa.me` del propio lead.
- **✉️ Abrir email** — abre el cliente de correo con el email del lead.

### Prueba manual con curl
```bash
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\":\"${TELEGRAM_CHAT_ID}\",\"text\":\"Test desde ROHU Marketing Web\"}"
```

> Si no configuras Telegram, el formulario **sigue funcionando** — el lead se persiste en `data/leads.json` (o se reenvía al webhook CRM si está configurado). Solo se omite la notificación push.

---

## Despliegue GitHub → Heroku

**Principio:** el código vive en GitHub como fuente de verdad. Heroku se suscribe al repo y despliega automáticamente en cada push a `main`. **Nunca se usa `git push heroku main`.**

### 1. Publicar el scaffold a GitHub

```bash
cd rohu-marketing-web
git init -b main
git add .
git commit -m "chore: initial rohu marketing web scaffold"

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
  NEXT_PUBLIC_DEMO_USER=rohu-contable \
  NEXT_PUBLIC_DEMO_PASSWORD=rohu-contable \
  NEXT_PUBLIC_WHATSAPP_PHONE=57300XXXXXXX \
  "NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE=Hola, me interesa ROHU Contable y quiero más información." \
  TELEGRAM_BOT_TOKEN=tu_token_aqui \
  TELEGRAM_CHAT_ID=tu_chat_id_aqui \
  NPM_CONFIG_PRODUCTION=false
```

### 3. Conectar Heroku al repo de GitHub (UI, una sola vez)

1. Heroku Dashboard → tu app → pestaña **Deploy**.
2. **Deployment method** → **GitHub** → **Connect to GitHub** → autoriza.
3. Busca `rohu-marketing-web` → **Connect**.
4. Sección **Automatic deploys** → selecciona rama `main` → **Enable Automatic Deploys**.
5. Sección **Manual deploy** → **Deploy Branch** (primer deploy).

### 4. Flujo diario

```bash
git checkout -b feat/update-copy
# ...editar...
git commit -am "feat(hero): update headline variant"
git push origin feat/update-copy
# abrir PR en GitHub → mergear a main → Heroku despliega automáticamente.
```

### Despliegue alternativo: Vercel

```bash
# con vercel CLI
npm i -g vercel
vercel
# agregar variables de entorno desde el dashboard de Vercel
```

---

## Checklist final

### Performance
- [ ] Lighthouse Performance ≥ 90 (mobile + desktop)
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Imágenes con `next/image` y `priority` solo en hero
- [ ] Fuentes con `display: 'swap'` via `next/font/google`

### Responsive
- [ ] Mobile 375px: hero legible, CTAs apilados, formulario en una columna
- [ ] Tablet 768px: grids 2 columnas
- [ ] Desktop 1280px: grids 3-4 columnas, hero split 2 cols

### Accesibilidad (WCAG AA)
- [ ] Contraste verificado (primary #1E3A8A / background #F8FAFC pasa AA)
- [ ] `lang="es-CO"` en `<html>`
- [ ] Skip-to-content link
- [ ] Labels asociados a inputs, `aria-describedby` en errores
- [ ] Accordion con `aria-expanded` / `aria-controls`
- [ ] Foco visible con `:focus-visible`
- [ ] Imágenes con `alt` descriptivo

### SEO
- [ ] `<title>` y `<meta description>` únicos por página
- [ ] Open Graph y Twitter cards configurados
- [ ] JSON-LD de `Organization` y `SoftwareApplication`
- [ ] `/sitemap.xml` y `/robots.txt` responden 200
- [ ] Canonical URL correcta

### Seguridad
- [ ] `.env.local` no versionado
- [ ] `data/leads.json` gitignored
- [ ] Headers de seguridad en `next.config.mjs`
- [ ] Rate limit en `/api/leads`
- [ ] Honeypot anti-bot
- [ ] Token de Telegram NO expuesto al cliente (nunca `NEXT_PUBLIC_`)
- [ ] Credenciales demo con aviso "datos ficticios"

### Legal
- [ ] Disclaimer DIAN en footer
- [ ] Checkbox Habeas Data obligatorio en formulario
- [ ] Páginas `/privacidad` y `/terminos` completadas con datos reales y revisadas por abogado colombiano antes de producción
- [ ] Lista de frases prohibidas aplicada al copy

### Tracking
- [ ] `view_landing` dispara una vez por sesión
- [ ] `click_demo`, `copy_demo_credentials`, `click_pricing` disparan
- [ ] `submit_lead` → `submit_lead_success` / `submit_lead_error`
- [ ] `click_whatsapp_fab`, `click_whatsapp_hero`, `click_telegram` disparan
- [ ] QA manual: abrir DevTools y verificar `window.dataLayer`

---

## Coordinación de agentes (resumen)

Esta web fue entregada orquestando **10 agentes especializados** con contratos explícitos entre ellos. Cada agente aportó su pieza y yo (orquestador) consolidé los entregables en código. Resumen del aporte real de cada uno:

| Agente | Aporte entregado |
|---|---|
| **rohu-growth-marketing-lead** | ICP priorizado (3 segmentos), propuesta de valor única, variantes de H1/sub, CTAs primarios, criterios de diferenciación de los 3 tiers, North Star metric (`lead_conversion_rate`) |
| **rohu-brand-designer** | Sistema visual: tokens Tailwind finales (paleta + fuentes Manrope/Inter + sombras `card`/`elevated`/`signature` + radii + gradientes `gradient-hero` y `gradient-cta`), guía de uso del logo, iconografía Lucide outline 1.75 |
| **rohu-conversion-copywriter** | Copy completo en español legal-safe para Hero, Beneficios, Para quién, Cómo funciona, Módulos, Pricing, Prueba social, FAQs, CTA final, Footer y Thank-you. Centralizado en `src/lib/content.ts` |
| **rohu-legal-compliance-co** | Disclaimer DIAN canónico (corto footer + largo T&C), aviso credenciales demo, checkbox Habeas Data, tooltip externo WhatsApp/Telegram, esqueletos de `/privacidad` y `/terminos` con H2s aprobados, lista de 8 frases prohibidas de marketing |
| **rohu-web-funnel-designer** | Jerarquía visual de la landing, wireframe ASCII del Hero + formulario + footer, microcopy completo del formulario (labels, placeholders, helpers, errores), flow mobile, estados visuales, regla de jerarquía de CTAs por sección |
| **rohu-analytics-tracking** | Taxonomía de 12 eventos con props tipadas, props comunes (`ts`, `path`, `session_id`), funnel de conversión de 5 pasos, definición de North Star + 3 KPIs secundarios, QA manual por evento |
| **rohu-payments-billing-engineer** | Tabla comparativa de los 3 tiers, interface `PricingTier` con campos reservados para integración futura (`stripePriceId`, `wompiPlanRef`, `monthlyPriceCOP`), stub de upgrade a pasarela, recomendación Wompi como primario para Colombia |
| **rohu-crm-lifecycle-specialist** | Secuencia post-lead de 4 toques (WhatsApp inmediato → email +24h → WhatsApp +3d → email +7d), mapping de campos a HubSpot/Pipedrive, 3 segmentos iniciales, script de apertura WhatsApp, definición MQL→SQL |
| **rohu-support-onboarding** | Refinamiento de los 4 pasos de "Cómo funciona" (con hints), copy completo de `/gracias` con 3 next-steps, 5 FAQs operativas (datos, offline, migración, capacitación, horarios), 3 KPIs de soporte (time-to-first-response, CSAT, self-service rate) |
| **rohu-landing-frontend-engineer** *(yo, como ejecutor)* | Next.js 14 App Router + TypeScript + Tailwind, consolidación de todos los outputs en código, headers de seguridad, SEO técnico (metadata, sitemap, robots, JSON-LD), integración WhatsApp/Telegram, API route con zod + rate limit + honeypot, rutas legales, README completo |

### Puntos de sincronización respetados
1. **Growth → todos**: ICP y tiers alimentaron copy, pricing, CRM y funnel.
2. **Copy + Legal**: el copywriter respetó las 8 frases prohibidas del agente legal y usó el disclaimer DIAN canónico en footer y FAQ de DIAN.
3. **Brand → Frontend**: tokens Tailwind aplicados al pie de la letra en `tailwind.config.ts` y `globals.css`.
4. **Analytics → Frontend**: constante `EVENTS` exportada, un único `trackEvent()`, llamadas en cada CTA según taxonomía.
5. **QA cruzado**: legal revisó `/privacidad` y `/terminos`; support revisó copy de `/gracias`; analytics definió la checklist de QA de eventos incluida arriba.

---

## Notas y próximos pasos

- **Persistencia de leads en producción**: `data/leads.json` es **solo para desarrollo**. En Heroku, el filesystem es efímero; cada reinicio borra el archivo. En producción real: configurar `LEAD_API_URL` hacia un CRM/webhook (HubSpot, Pipedrive, Zapier, Notion) o migrar a una base de datos administrada (Postgres, Supabase).
- **WhatsApp Business Cloud API**: upgrade futuro para recibir también los formularios por WhatsApp con notificaciones push más ricas (requiere número dedicado + verificación de Meta).
- **Checkout real**: cuando Wompi o Stripe se integren, las interfaces `PricingTier` y el botón `Cotizar ahora` se reemplazan por un flujo de suscripción (ver stub en `src/lib/pricingTiers.ts`).
- **Analytics avanzado**: conectar GA4 y PostHog leyendo los eventos del `window.dataLayer` (ya están formateados para eso).
- **Legal**: las páginas `/privacidad` y `/terminos` son esqueletos aprobados pero **deben ser revisados por un abogado habilitado en Colombia** antes de publicar en producción.
