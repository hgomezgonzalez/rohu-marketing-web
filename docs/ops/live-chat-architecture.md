# Live chat architecture — ROHU Solutions Marketing Web

Documentación operativa del flujo **Web ⇄ Telegram ⇄ Web** que permite
que un visitante anónimo de `rohu-solutions.com` converse en tiempo real
con el operador, **que responde desde su Telegram** (sin dashboard propio).

## Vista general

```
┌──────────┐    POST /api/chat/send    ┌────────────┐   sendMessage   ┌────────────┐
│ Visitante│ ─────────────────────────▶│  Next.js   │ ───────────────▶│  Telegram  │
│ (widget) │    GET  /api/chat/poll    │  App Route │                  │    Bot     │
│          │◀──────────────────────────│  Handlers  │◀──────────────── │            │
└──────────┘    long-poll 25 s         └─────┬──────┘   setWebhook    └─────┬──────┘
                                             │                               │
                                             │      POST /api/chat/webhook   │
                                             ◀───────────────────────────────┘
                                             │
                                      in-memory chatStore
                                      Map<sessionId, Session>
                                      Map<tgMsgId, sessionId>
                                             │
                                             ▼
                                   stdout: `[chat:msg] {...}`
                                   → Heroku Logs (retención persistente)
```

Componentes clave:

| Capa | Archivo | Rol |
|---|---|---|
| UI | `src/components/chat/ChatWidget.tsx` | Floating bubble + panel, portal, focus, visibility, lead card inline |
| UI | `src/components/chat/ChatMessageList.tsx` | Render presentational de burbujas |
| UI | `src/components/chat/ChatLeadCard.tsx` | Soft-ask de lead después de 3 msgs o 120 s |
| Client | `src/components/chat/chatClient.ts` | `sendChatMessage`, `startPolling` (AbortController, backoff) |
| Copy | `src/lib/chatCopy.ts` | Strings centralizados |
| Backend | `src/app/api/chat/send/route.ts` | POST visitor→TG, rate limit, anchor message, log estructurado |
| Backend | `src/app/api/chat/poll/route.ts` | GET long-poll con hold 25 s |
| Backend | `src/app/api/chat/webhook/route.ts` | POST TG→visitor, auth constant-time, routing reply_to + fallback |
| Lib | `src/lib/chatStore.ts` | Map + waiters + reverse index + eviction |
| Lib | `src/lib/chatRateLimit.ts` | Token bucket IP/session/global |
| Lib | `src/lib/chatTelegram.ts` | Wrapper Bot API, anchor + threaded + admin notices |
| Lib | `src/lib/htmlEscape.ts` | `escapeHtml` compartido por chat + lead + email |

## Ciclo de vida de una conversación

### 1. Visitante abre el widget

- `ChatWidget` se monta vía `createPortal(document.body)` (SSR-safe).
- Lee o genera `sessionId` del `sessionStorage` (clave `rohu_session_id`,
  compartida con `src/lib/analytics.ts`).
- Al abrir, emite `OPEN_CHAT_WIDGET` a `dataLayer` y lanza `startPolling`.

### 2. Visitante envía el primer mensaje

1. Render optimista en la lista (bubble con `pending: true`).
2. `POST /api/chat/send` con `{ sessionId, text, pathname }`.
3. Servidor valida con zod, aplica rate limit por IP+sesión+global.
4. Si es sesión nueva: llama a `sendAnchorMessage()` **esperando** la
   respuesta para capturar el `message_id` del anchor. Ese id queda
   indexado en `chatStore.tgMessageToSession`.
5. Server escribe `console.info('[chat:msg]', JSON.stringify({...}))`
   con IP enmascarada y PII redactada (emails/teléfonos → `[email]`/`[phone]`).
6. Responde 201 `{ messageId, ts, anchorCreated: true }`.
7. Cliente reemplaza la burbuja optimista con la confirmada.

### 3. Admin recibe y responde en Telegram

El mensaje en el chat privado con `@rohu_solutions_leads_bot` se ve así:

```
💬 Chat en vivo · ROHU Solutions

🆔 sess_lz7k3m_abc1d2e3
📄 Página: /productos/rohu-contable
🌐 IP: 190.85.XXX.XXX
🖥 Chrome 125

💭 Hola, quiero saber el precio del plan Pro.

Responde con la acción «Reply» sobre este mensaje para enviar
tu respuesta al visitante.
```

El admin hace **long-press → Reply → escribe**. Telegram envía un update
al webhook `https://rohu-solutions.com/api/chat/webhook`.

### 4. Webhook enruta y despierta al visitante

1. Verifica header `X-Telegram-Bot-Api-Secret-Token` contra
   `TELEGRAM_WEBHOOK_SECRET` con `timingSafeEqual`. Mismatch → 401.
2. Verifica `update.message.chat.id === TELEGRAM_CHAT_ID`. Distinto → 200 ignored.
3. Guarda `update_id` en `seenUpdateIds` (idempotencia contra retries).
4. Resuelve sesión con `findSessionByTelegramUpdate()`:
   - **Vía 1 · reply_id**: `reply_to_message.message_id` en el índice reverso.
   - **Vía 2 · text_scan**: regex `sess_xxx` en `reply_to_message.text`.
   - **Vía 3 · fallback**: sesión más recientemente activa (< 5 min) con
     `lastDirection === 'in'`. Si no hay candidato, llama a `sendAdminNotice`
     pidiéndole al admin que haga reply explícito.
5. `appendMessage(sessionId, { direction: 'out', text, telegramMessageId })`.
6. `appendMessage` despierta a los waiters parqueados en `waitForMessages`
   para esa sesión → el long-poll del cliente resuelve de inmediato.

### 5. Cliente recibe y renderiza

El cliente hace `fetch(/api/chat/poll?sessionId=X&since=T)` con el last
`ts` visto. El handler llama `waitForMessages(sessionId, since, 25000)`.
Cuando el webhook despierta el waiter, el handler devuelve el batch de
mensajes `out` con `ts > since`. El cliente renderiza las burbujas, avanza
`lastSeenTsRef`, y reinicia un nuevo long-poll.

## Env vars

| Nombre | Dónde | Requerido para chat |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Heroku config | Sí |
| `TELEGRAM_CHAT_ID` | Heroku config | Sí |
| `TELEGRAM_WEBHOOK_SECRET` | Heroku config | Sí |
| `NEXT_PUBLIC_SITE_URL` | Heroku config | Sí (usado por widget para `setWebhook` inverso si se regenera) |
| `CHAT_POLL_HOLD_MS` | Heroku config | Opcional, default 25000 |

El endpoint `GET /api/health` expone el bloque:
```json
{
  "chat": {
    "enabled": true,
    "sessionCount": 0
  }
}
```

## Setup inicial en orden (crítico)

```bash
# 1. Generar secret único para este entorno
SECRET=$(openssl rand -hex 32)

# 2. Setear en Heroku ANTES de desplegar el webhook — si Telegram golpea
#    un endpoint 401ing, el primer reply del admin se pierde (no retries 4xx)
heroku config:set TELEGRAM_WEBHOOK_SECRET="$SECRET" -a rohu-marketing-web

# 3. Deploy del código (prefer push directo a heroku para velocidad)
git push origin main
git push heroku main

# 4. Verificar que el endpoint responde
curl -s https://rohu-solutions.com/api/health | python3 -m json.tool
# → debe mostrar chat.enabled: true

# 5. Registrar el webhook contra Telegram
curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H 'content-type: application/json' \
  -d "{\"url\":\"https://rohu-solutions.com/api/chat/webhook\",\"secret_token\":\"$SECRET\",\"allowed_updates\":[\"message\"],\"drop_pending_updates\":true,\"max_connections\":5}"

# 6. Confirmar que quedó bien configurado
curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo" | python3 -m json.tool
# → url debe ser https://rohu-solutions.com/api/chat/webhook
# → pending_update_count: 0
# → last_error_date debe estar ausente o ser muy antiguo
```

### Rotar el secret

```bash
NEW_SECRET=$(openssl rand -hex 32)
heroku config:set TELEGRAM_WEBHOOK_SECRET="$NEW_SECRET" -a rohu-marketing-web
# Heroku reinicia el dyno con el nuevo valor
curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H 'content-type: application/json' \
  -d "{\"url\":\"https://rohu-solutions.com/api/chat/webhook\",\"secret_token\":\"$NEW_SECRET\"}"
```

### Desconectar temporalmente el chat

```bash
curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook"
```

El endpoint seguirá rechazando con 401 hasta que se vuelva a registrar,
pero no impacta los formularios de leads existentes (esos usan
`notifyTelegram.ts` sin webhook).

## Rate limits

| Bucket | Límite | Ventana |
|---|---|---|
| Por IP | 10 mensajes | 1 min |
| Por IP | 200 mensajes | 24 h |
| Por sesión | 20 mensajes | 1 min |
| Nuevas sesiones por IP | 3 | 1 h |
| Global | 250 mensajes | 1 min |

Cuando se supera un límite, el handler responde `429` con header
`Retry-After` en segundos. El widget muestra un banner inline con el
contador y deshabilita el input hasta que vence.

## Seguridad

- **Auth del webhook**: `timingSafeEqual` contra `TELEGRAM_WEBHOOK_SECRET`.
- **Chat ID gate**: mensajes de chats que no sean `TELEGRAM_CHAT_ID` se
  ignoran (200 con `ignored: 'chat_mismatch'`).
- **Idempotencia**: `seenUpdateIds` evita procesar retries de Telegram.
- **XSS outbound**: `escapeHtml` antes de concatenar en HTML de Telegram.
- **XSS inbound**: React renderiza `text` plano, prohibido
  `dangerouslySetInnerHTML`, sin markdown parsing.
- **PII logs**: IP enmascarada a `/24`, regex redacta emails/teléfonos
  antes de `console.info`. El texto íntegro se mantiene solo en memoria
  para la entrega al cliente.
- **CSRF**: N/A — endpoint anónimo sin cookies.

## Troubleshooting

### El admin responde en Telegram pero no llega al widget

1. `curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"`
   — revisar `last_error_date` y `last_error_message`.
2. Si `last_error_message: "Wrong response from the webhook"` → el handler
   devolvió algo != 200. `heroku logs --tail -a rohu-marketing-web | grep chat:webhook`.
3. Si `last_error_message: "Forbidden"` → el header secret está mal.
   Revisar `heroku config -a rohu-marketing-web | grep WEBHOOK_SECRET`.
4. Si `pending_update_count > 0` y no baja → el dyno está dormido. Hacer
   un GET a `/api/health` para despertarlo y revisar el workflow de
   keep-alive (`.github/workflows/keep-alive.yml`).

### El admin escribe un mensaje suelto (sin reply) y llega a la sesión equivocada

El fallback heurístico enruta al `lastActivityAt` más reciente con
`lastDirection === 'in'`. Si hay 2 sesiones simultáneas ambiguas, el bot
responde al admin con `⚠️ No pude identificar a qué sesión corresponde…`.
El admin debe usar reply-to explícito.

### Dyno restart perdió conversaciones

Es esperado: el store es in-memory por decisión explícita. Los widgets
abiertos detectan el restart via `410 Gone` de `/api/chat/poll` y muestran
la pantalla "Conversación reiniciada". El admin aún tiene el historial
completo en su Telegram.

Recuperar mensajes del log estructurado:
```bash
heroku logs -a rohu-marketing-web -n 1500 | grep "chat:msg"
```

### `/api/health` dice `chat.enabled: false`

Falta uno de los 3 env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
`TELEGRAM_WEBHOOK_SECRET`. Revisar con:
```bash
heroku config -a rohu-marketing-web | grep -E 'TELEGRAM_'
```

## Verificación end-to-end manual

```bash
SESSION="sess_smoke_$(date +%s)"

# 1. Outbound visitor→admin
curl -sS -X POST https://rohu-solutions.com/api/chat/send \
  -H 'content-type: application/json' \
  -d "{\"sessionId\":\"$SESSION\",\"text\":\"test outbound\",\"pathname\":\"/\"}"

# 2. Hugo responde desde Telegram (long-press + Reply sobre el mensaje)

# 3. Inbound poll (reply aparece en ≤5 s)
curl -sS "https://rohu-solutions.com/api/chat/poll?sessionId=$SESSION&since=0&holdMs=5000"
```
