# Domain categorization requests — `rohu-solutions.com`

Reusable copy for the web reputation providers' recategorization forms.
These forms are in English, so the copy below is in English on purpose.

> **Goal:** get `rohu-solutions.com` classified as
> `Business / Information Technology` (or equivalent) by the main web
> filtering engines so that corporate proxies stop treating it as a
> *Newly Registered Domain* / *Uncategorized*.

---

## Standard submission payload

Copy-paste these fields into every provider's form.

| Field | Value |
|---|---|
| URL / Domain | `https://rohu-solutions.com` |
| Also submit | `https://www.rohu-solutions.com` |
| Suggested category | **Business / Information Technology** (or "Computers & Technology" / "Software as a Service" depending on each provider's taxonomy) |
| Contact email | `contacto@rohu-solutions.com` *(o el correo público que tengas)* |
| Company | ROHU Solutions |
| Country | Colombia (CO) |

### Short justification (120–140 words)

```
ROHU Solutions is a Colombian software house that builds vertical
SaaS products for small and medium businesses (e.g. ROHU Contable,
an accounting SaaS, and ROHU Connect, a B2B collaboration product).
rohu-solutions.com is our official corporate website: it hosts the
company landing, product pages, privacy policy, terms of service
and contact information. The domain was registered on 2026-04-08
and is still flagged as "Newly Registered" by most reputation
feeds, which causes enterprise web proxies (including ours at
Telefónica Colombia) to block it by default. The site is a static
Next.js marketing front-end hosted on Heroku. It does not host
user-generated content, downloads, adult content, or any material
that would justify a restrictive category. Please categorize it as
Business / Information Technology. Thank you.
```

### Long justification (if the form has a bigger text box)

```
ROHU Solutions (operating as "ROHU Soluciones" in Spanish) is a
software company based in Colombia that builds and operates
vertical SaaS applications for mid-market and SMB customers. Our
flagship products are ROHU Contable (an accounting/invoicing SaaS
aligned with Colombian DIAN regulations) and ROHU Connect (a B2B
collaboration and lead-capture tool).

The domain rohu-solutions.com is the canonical corporate website
of the company. It is a static Next.js 14 marketing site hosted on
Heroku and serves the following purposes:

  - Company landing page with value proposition and team information
  - Product catalog (/productos/rohu-contable, /productos/rohu-connect)
  - Legal pages (/privacidad, /terminos)
  - Contact and lead-capture forms (CRM integration only)

Technical legitimacy signals the site publishes:

  - Valid TLS certificate (Let's Encrypt via Heroku ACM)
  - Security headers: X-Frame-Options DENY, X-Content-Type-Options
    nosniff, Referrer-Policy strict-origin-when-cross-origin,
    Permissions-Policy camera=(), microphone=(), geolocation=()
  - Canonical domain declared in OpenGraph, Twitter Card and the
    JSON-LD Organization schema
  - robots.txt at /robots.txt advertising the sitemap
  - sitemap.xml at /sitemap.xml enumerating all public pages
  - addressCountry: CO in the Organization schema
  - No user-generated content, no file downloads, no forum, no
    adult content, no gambling, no cryptocurrency, no file sharing

The domain was registered on 2026-04-08 through Namecheap. Because
it is new, it is currently flagged as "Newly Registered Domain" or
"Uncategorized" by most reputation feeds, which causes enterprise
proxies to block it under anti-phishing policies. We are reaching
out to every major provider individually to request a manual
recategorization as Business / Information Technology so that our
own team (and our customers working from corporate networks) can
reach the site.

If you need any additional verification, please reply to this
request and we will provide WHOIS-level ownership evidence, DNS
records, or any other information you require.

Thank you.
```

---

## Provider-specific URLs and notes

### 1. BrightCloud (Webroot / OpenText) — **HIGH PRIORITY**
- Form: https://www.brightcloud.com/tools/change-request.php
- Category mapping: **"Business and Economy"** or **"Information Technology"**
- Turnaround: ~24–48h
- Notes: powers Cisco Meraki, WatchGuard, SonicWall, Barracuda.

### 2. Cisco Talos / Umbrella — **HIGH PRIORITY**
- Lookup: https://talosintelligence.com/reputation_center
- Dispute: click "Submit a Dispute" after searching the domain
- Category mapping: **"Business Services"** or **"Software/Technology"**
- Turnaround: ~48–72h
- Notes: powers Cisco Umbrella, Cisco Firepower, Cisco Email Security.

### 3. Palo Alto Networks PAN-DB — **HIGH PRIORITY**
- Lookup: https://urlfiltering.paloaltonetworks.com
- Flow: "Test A Site" → search `rohu-solutions.com` → "Request Change"
- Category mapping: **"business-and-economy"** or **"computer-and-internet-info"**
- Turnaround: ~24h
- Notes: powers Palo Alto NGFW, Prisma Access.

### 4. FortiGuard (Fortinet)
- Form: https://www.fortiguard.com/webfilter
- Flow: "Submit a URL Rating"
- Category mapping: **"Business"** or **"Information Technology"**
- Turnaround: ~24–72h
- Notes: powers Fortinet FortiGate.

### 5. Zscaler — **HIGH PRIORITY**
- Lookup: https://csi.zscaler.com
- Flow: look up domain → click "Suggest" next to the current category
- Category mapping: **"Professional Services"** or **"Computers & Technology"**
- Turnaround: ~24h
- Notes: heavily used by Telefónica and other telco operators — prioritize.

### 6. Symantec / Bluecoat SiteReview — **HIGH PRIORITY**
- Form: https://sitereview.bluecoat.com
- Category mapping: **"Business/Economy"** or **"Technology/Internet"**
- Turnaround: ~24–48h
- Notes: heavily used in LATAM enterprise. Prioritize.

### 7. Forcepoint CSI
- Form: https://csi.forcepoint.com
- Category mapping: **"Business and Economy"** or **"Information Technology"**
- Turnaround: ~48h
- Notes: used by banking and government in Colombia.

### 8. McAfee / Trellix TrustedSource
- Lookup: https://sitelookup.mcafee.com
- Flow: look up → "Suggest a new categorization"
- Category mapping: **"Business"** or **"Software/Hardware"**
- Turnaround: ~48–72h

---

## Tracking checklist

| # | Provider | Submitted | Approved | Notes |
|---|---|---|---|---|
| 1 | BrightCloud | [ ] | [ ] | |
| 2 | Cisco Talos | [ ] | [ ] | |
| 3 | Palo Alto PAN-DB | [ ] | [ ] | |
| 4 | FortiGuard | [ ] | [ ] | |
| 5 | Zscaler | [ ] | [ ] | priority |
| 6 | Bluecoat | [ ] | [ ] | priority |
| 7 | Forcepoint | [ ] | [ ] | priority |
| 8 | McAfee/Trellix | [ ] | [ ] | |
