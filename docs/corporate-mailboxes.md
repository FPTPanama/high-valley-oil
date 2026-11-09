# Correos corporativos (Google Workspace)

## Organización High Valley

- **Dominio:** `highvalleyoil.com`
- **Plan:** Google Workspace **Starter** (tarifa más económica; cobro por usuario/mes)
- **Perfil administrador (Super Admin):** `info@highvalleyoil.com`
- **Nota:** `admin@highvalleyoil.com` se eliminó para no gastar una licencia extra. La consola Admin se opera con `info@`.
- **Independencia:** Workspace propio de High Valley. `veniof.com` es otro dominio/empresa y no se mezcla aquí salvo que se decida añadirlo aparte como dominio secundario.

## Usuarios actuales (activos)

| Dirección                    | Tipo    | Rol                                      |
| ---------------------------- | ------- | ---------------------------------------- |
| `info@highvalleyoil.com`     | Usuario | Superadministrador; buzón general / form |
| `juridico@highvalleyoil.com` | Usuario | Buzón legal                              |

Licencias en uso hoy: **2**.

## Pendientes por crear

| Dirección                     | Persona                       |
| ----------------------------- | ----------------------------- |
| `eprieto@highvalleyoil.com`   | Eddy Williams Prieto Araujo   |
| `jvergara@highvalleyoil.com`  | Jesus Ignacio Vergara Sanchez |
| `jdiaz@highvalleyoil.com`     | Jose Gregorio Diaz Perdomo    |
| `rboccardo@highvalleyoil.com` | Ricardo Boccardo              |
| `rmarzocca@highvalleyoil.com` | Renato Marzocca               |

Patrón de personas: `inicial + apellido` (ej. `eprieto@`).

## Contact form (Resend)

Tras un envío correcto, el usuario va a `/contact/thank-you`.

Variables en Netlify (Site → Environment variables) y en local (`.env.local`):

- `RESEND_API_KEY` — API key de Resend
- `CONTACT_TO_EMAIL=info@highvalleyoil.com`
- `CONTACT_FROM_EMAIL` — al inicio: `High Valley Oil <onboarding@resend.dev>`  
  luego en prod: `High Valley Oil <noreply@highvalleyoil.com>` (dominio verificado en Resend)

### Pasos Resend

1. En Resend → **API Keys** → crear key
2. Pegarla en `.env.local` (local) y en Netlify (prod)
3. (Opcional prod) Resend → **Domains** → añadir `highvalleyoil.com` → copiar TXT/DKIM a Netlify DNS
4. Cambiar `CONTACT_FROM_EMAIL` al remitente `@highvalleyoil.com`
5. Probar un envío en `/contact` → debe abrir la Thank You page y llegar el mail a `info@`
