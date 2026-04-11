# Runbook: recuperación post-redespliegue de `rohu-marketing-web`

Este runbook cubre lo que hay que hacer **manualmente** después de haber
recreado la app de Heroku `rohu-marketing-web` (escenario real: la app fue
eliminada y luego recreada con `heroku apps:create`).

> Estado del que partes:
>
> - App Heroku recreada: `rohu-marketing-web` (región `us`)
> - URL directa: `https://rohu-marketing-web-4485f9348274.herokuapp.com/`
> - Env vars **públicas** ya configuradas (incluyendo
>   `NEXT_PUBLIC_SITE_URL=https://rohu-solutions.com`)
> - Custom domains `rohu-solutions.com` y `www.rohu-solutions.com` ya
>   añadidos a la app y con ACM habilitado
> - GitHub Actions CI funcionando (secret `HEROKU_API_KEY` vigente)
> - **Pendiente**: DNS de Namecheap, secrets privados (SMTP, Telegram)
>
> Mientras no ejecutes los pasos de este runbook:
>
> - El sitio está **100% vivo** en la URL directa de Heroku.
> - El dominio `rohu-solutions.com` **no resuelve** al nuevo slug (apunta a
>   targets viejos).
> - Los formularios de contacto responden 201 al usuario, pero las
>   notificaciones de lead (Telegram + email) **están en modo no-op**.
>   Los leads sí quedan registrados en los logs de Heroku con el marker
>   `[lead:captured]` para poder recuperarlos después.

---

## Paso 1 — Actualizar el DNS en Namecheap (bloqueante)

Al recrear la app, Heroku generó CNAME targets nuevos. Los del slug anterior
ya **no existen**, así que `rohu-solutions.com` seguirá caído hasta que
actualices estos dos registros en Namecheap.

### 1.1 Targets nuevos (copia estos valores)

| Hostname                 | Record Type     | Value (CNAME target)                                                   |
| ------------------------ | --------------- | ---------------------------------------------------------------------- |
| `@` (apex)               | `ALIAS Record`  | `parallel-whale-34o34t2yfph9o6pgofolytei.herokudns.com`                |
| `www`                    | `CNAME Record`  | `thermal-tangelo-2h0rkpnw99lrobn5q5trtk6t.herokudns.com`               |

> **Nota importante sobre el apex**: en DNS estándar no se permite `CNAME`
> en el apex del dominio. Namecheap resuelve esto con el tipo **"ALIAS
> Record"** de su editor (también lo llama "CNAME at root" en algunas
> versiones del UI). Si tu zona no muestra la opción `ALIAS Record`,
> contacta soporte de Namecheap o usa como workaround temporal un
> redirect permanente `rohu-solutions.com → www.rohu-solutions.com`.

### 1.2 Pasos exactos en el panel

1. Ve a <https://ap.www.namecheap.com/Domains/DomainControlPanel/rohu-solutions.com/advancedns>
   (entra con tu cuenta de Namecheap).
2. En la sección **"Host Records"**:
   - **Borra** los registros viejos que tenían como target
     `obscure-fly-ai13j99ijecxvup1rwr0eotz.herokudns.com` (o cualquier
     `*.herokudns.com` anterior).
   - Haz clic en **"Add New Record"** y crea los dos nuevos de la tabla
     de arriba.
   - **TTL**: `Automatic` (5 min) para acelerar la propagación inicial.
3. Click en **"Save All Changes"** (el check verde arriba a la derecha).
4. Espera entre 1 y 30 minutos y verifica con:
   ```bash
   dig +short rohu-solutions.com
   dig +short www.rohu-solutions.com CNAME
   curl -I https://rohu-solutions.com
   curl -I https://www.rohu-solutions.com
   ```
   El `curl -I` debe devolver `HTTP/2 200` con `server: Heroku`.
   Si ves el error de Heroku *"no such app"*, el DNS aún no propagó.

### 1.3 SSL automático

Una vez el DNS propague correctamente, Heroku ACM emitirá los certificados
Let's Encrypt automáticamente en 5–15 min. Puedes monitorearlo con:

```bash
heroku certs:auto -a rohu-marketing-web
```

Debes ver `Domain ... Status: Cert Issued` para ambos hostnames.

---

## Paso 2 — Generar una Gmail App Password (para `/api/leads`)

Necesario si quieres que cada lead te llegue también por email además de
Telegram. Google **no acepta** tu password normal; hay que generar una
"App Password" de 16 caracteres.

1. Asegúrate de tener **verificación en dos pasos (2FA) activada** en
   tu cuenta de Google. Sin 2FA el menú de App Passwords no aparece.
   <https://myaccount.google.com/security>
2. Entra a <https://myaccount.google.com/apppasswords>.
3. En "Nombre de la app" escribe: `ROHU Solutions Marketing`.
4. Click en **"Crear"**.
5. Google muestra 16 caracteres agrupados en 4 bloques de 4, por ejemplo:
   `abcd efgh ijkl mnop`. **Copia los 16 caracteres quitando los espacios**
   → `abcdefghijklmnop`. Esta es tu `SMTP_PASS`.
6. Guárdala temporalmente en un lugar seguro — Google solo la muestra
   una vez.

> **Consejo**: si prefieres no usar tu Gmail personal, crea una cuenta
> Gmail dedicada tipo `rohu.leads@gmail.com` y úsala solo para esto.
> Así, si algún día comprometes el secret, solo revocas esa cuenta.

---

## Paso 3 — Crear el bot de Telegram y capturar el token

1. Abre Telegram y busca el usuario `@BotFather` (bot oficial, con
   checkmark azul).
2. Envíale `/newbot`.
3. @BotFather te pedirá:
   - **Nombre del bot** (display name, se puede cambiar después):
     `ROHU Solutions Leads`
   - **Username del bot** (termina en `bot`):
     `rohu_solutions_leads_bot` (cámbialo si está ocupado)
4. Responde con un mensaje tipo:
   ```
   Done! Congratulations on your new bot. ... Use this token to access
   the HTTP API:
   7123456789:AAE4yH-abc123DEF456ghi789JKL0mnOPQRSTUV
   ```
   Ese string largo es tu `TELEGRAM_BOT_TOKEN`. Cópialo.
5. **IMPORTANTE**: ahora envíale al bot cualquier mensaje (ej: `hola`)
   desde tu cuenta personal de Telegram. Sin esto, el siguiente paso
   no funciona porque el bot no tiene permiso para escribirte primero.

---

## Paso 4 — Obtener `TELEGRAM_CHAT_ID`

Reemplaza `<TOKEN>` con el token del paso anterior y ejecuta:

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates" | python3 -m json.tool
```

Busca en la respuesta un bloque como:

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": {
      "id": 987654321,
      "first_name": "Héctor",
      ...
    },
    "chat": {
      "id": 987654321,      <--- ESTE ES TU TELEGRAM_CHAT_ID
      "first_name": "Héctor",
      "type": "private"
    },
    ...
  }
}
```

Copia el valor de `chat.id`. Ese número es tu `TELEGRAM_CHAT_ID`.

> Si la respuesta sale con `"result": []` vacío, quiere decir que no le
> has escrito al bot todavía. Mándale cualquier mensaje y reintenta.

---

## Paso 5 — Setear todos los secrets en Heroku de una sola vez

Abre una terminal donde tengas `heroku` CLI autenticado, reemplaza los
placeholders con los valores reales que capturaste en los pasos 2, 3 y 4,
y ejecuta:

```bash
heroku config:set \
  SMTP_USER='rohu.leads@gmail.com' \
  SMTP_PASS='abcdefghijklmnop' \
  SMTP_FROM='ROHU Solutions <rohu.leads@gmail.com>' \
  SMTP_TO='tu-email-personal@gmail.com' \
  TELEGRAM_BOT_TOKEN='7123456789:AAE4yH-abc123DEF456ghi789JKL0mnOPQRSTUV' \
  TELEGRAM_CHAT_ID='987654321' \
  -a rohu-marketing-web
```

Este comando dispara automáticamente un **restart** del dyno (v+1 release).
Como los secrets del lado servidor **no** son `NEXT_PUBLIC_*`, no requieren
rebuild del slug; basta el restart para que los nuevos valores queden
activos.

**Opcional** (webhook de CRM, si usas uno):
```bash
heroku config:set LEAD_API_URL='https://tu-crm.com/webhook/leads' -a rohu-marketing-web
```

---

## Paso 6 — Recuperar leads capturados durante el downtime

El endpoint ya escribe cada lead con el marker `[lead:captured]` en los
logs de Heroku. Si llegaron leads entre la recreación de la app y el
momento en que ejecutaste el paso 5, puedes recuperarlos con:

```bash
heroku logs -a rohu-marketing-web -n 1500 | grep "lead:captured"
```

Cada línea es un JSON completo del lead (con `id`, `createdAt`, `firstName`,
`email`, `whatsapp`, `application`, `planInterest`, etc.). Cópialos a tu
CRM manualmente o procésalos con un script.

Para extraer solo los JSONs limpios (sin el prefijo del log de Heroku):

```bash
heroku logs -a rohu-marketing-web -n 1500 \
  | grep "lead:captured" \
  | sed 's/.*\[lead:captured\] //'
```

> **Nota**: Heroku Logs retiene 1500 líneas por app por default. Si el
> tráfico es alto, configura un log drain (Logtail, Papertrail, Datadog)
> para retención extendida. Sin código adicional:
> ```bash
> heroku drains:add syslog+tls://logs.logtail.com:6514 -a rohu-marketing-web
> ```

---

## Paso 7 — Verificación end-to-end

### 7.1 Health endpoint

```bash
curl -s https://rohu-marketing-web-4485f9348274.herokuapp.com/api/health | python3 -m json.tool
```

Antes del paso 5 (sin secrets):
```json
{
  "ok": true,
  "service": "rohu-marketing-web",
  "site_url": "https://rohu-solutions.com",
  "integrations": {
    "telegram": false,
    "smtp": false,
    "lead_webhook": false
  }
}
```

Después del paso 5 (con secrets):
```json
{
  "ok": true,
  "service": "rohu-marketing-web",
  "site_url": "https://rohu-solutions.com",
  "integrations": {
    "telegram": true,
    "smtp": true,
    "lead_webhook": false
  }
}
```

### 7.2 Lead de prueba contra quick-quote

```bash
curl -sS -X POST https://rohu-marketing-web-4485f9348274.herokuapp.com/api/quick-quote \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Test Runbook",
    "whatsapp": "3001234567",
    "application": "ROHU Contable",
    "planInterest": "Pro",
    "habeasData": true
  }'
```

Esperado:
- **HTTP 201** con body `{"ok":true,"id":"quote_..."}`
- **Mensaje en Telegram** al chat del bot con el botón "Responder por WhatsApp"
- **Email** en `SMTP_TO` con el template estilizado
- **Línea en los logs** de Heroku con el marker `[lead:captured]`

### 7.3 Una vez DNS propagado (paso 1 completado)

```bash
curl -I https://rohu-solutions.com
curl -s https://rohu-solutions.com/api/health | python3 -m json.tool
curl -s https://rohu-solutions.com/robots.txt
curl -s https://rohu-solutions.com/sitemap.xml
```

Esperado: `HTTP/2 200` en todos, `site_url` = `https://rohu-solutions.com`,
`/robots.txt` apuntando a `https://rohu-solutions.com/sitemap.xml`, y el
sitemap listando URLs del dominio custom.

---

## Qué hacer si algo falla

| Síntoma                                                       | Causa probable                                         | Solución                                                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/api/health` devuelve `smtp: false` después del paso 5       | Alguno de los 5 secrets SMTP no quedó seteado          | `heroku config -a rohu-marketing-web \| grep SMTP` para confirmar que están todos                             |
| Telegram devuelve `chat not found`                            | No le enviaste ningún mensaje al bot antes             | Abre el bot en Telegram, envía `hola`, reintenta                                                              |
| Gmail SMTP devuelve `Invalid login: 535`                      | Usaste tu password normal en vez de la App Password    | Genera una nueva en <https://myaccount.google.com/apppasswords>, sin espacios                                 |
| `rohu-solutions.com` sigue dando "no such app"                | DNS no propagó aún                                     | Espera 10–30 min más. Verifica con `dig +short rohu-solutions.com` que apunte a IPs y no esté vacío           |
| `heroku certs:auto` muestra `Failed`                          | El DNS todavía no apunta al nuevo target               | Vuelve al paso 1 y confirma los CNAME targets nuevos                                                          |
| El bloqueo del proxy corporativo de Telefónica sigue activo   | Este runbook no resuelve eso                           | Ese es un problema separado. Ver `docs/ops/domain-allowlist-request.md` (ticket IT) y `docs/ops/domain-categorization-request.md` (formularios de recategorización) |

---

## Checklist final

- [ ] **Paso 1**: CNAMEs nuevos en Namecheap, propagación verificada con `dig`
- [ ] **Paso 1.3**: `heroku certs:auto` muestra `Cert Issued` para ambos hostnames
- [ ] **Paso 2**: Gmail App Password generada y guardada
- [ ] **Paso 3**: Bot de Telegram creado, token guardado
- [ ] **Paso 4**: Chat ID obtenido
- [ ] **Paso 5**: `heroku config:set` ejecutado con los 6 secrets
- [ ] **Paso 6**: Leads del downtime (si los hay) extraídos de los logs
- [ ] **Paso 7.1**: `/api/health` devuelve `telegram: true`, `smtp: true`
- [ ] **Paso 7.2**: Lead de prueba entregado por los dos canales
- [ ] **Paso 7.3**: Dominio custom responde 200 con SSL válido
