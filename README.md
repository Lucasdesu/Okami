# Okami Web Chat (Vercel + n8n)

MVP de chat embutivel com webhook no n8n, persistencia no Supabase e dashboard protegido.

## Rotas

- `/` instrucoes rapidas
- `/embed` interface de chat para iframe
- `/widget.js` script embutivel para o site
- `/api/chat` recebe mensagem e encaminha para n8n
- `/api/health` healthcheck
- `/dashboard` painel de conversas (protegido por auth)

## Variaveis de ambiente

```env
N8N_WEBHOOK_URL=https://SEU-N8N/webhook/atendimento
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SEU_SERVICE_ROLE_KEY
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=senha-forte
```

## SQL no Supabase

Execute no SQL Editor:

```sql
create table if not exists conversations (
  session_id text primary key,
  source text not null default 'web',
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references conversations(session_id) on delete cascade,
  source text not null default 'web',
  role text not null check (role in ('user', 'bot')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_session_created_at
  on messages(session_id, created_at);

create index if not exists idx_conversations_updated_at
  on conversations(updated_at desc);
```

## Como embutir no site

```html
<script
  src="https://SEU-DOMINIO.vercel.app/widget.js"
  data-chat-origin="https://SEU-DOMINIO.vercel.app"
  defer
></script>
```

## Payload enviado ao n8n

```json
{
  "session_id": "uuid",
  "message": "texto do usuario",
  "source": "web",
  "timestamp": "2026-05-01T00:00:00.000Z"
}
```

## Resposta esperada do n8n

```json
{
  "reply": "texto da resposta"
}
```
