# Okami Web Chat (Vercel + n8n)

MVP de chat web embutível para site, com envio de mensagens para webhook do n8n.

## Rotas

- `/` instruções rápidas
- `/embed` interface de chat para iframe
- `/widget.js` script embutível para colocar no site
- `/api/chat` endpoint que encaminha para o n8n

## Configuração local

```bash
npm install
npm run dev
```

Crie `.env.local` com base em `.env.example`:

```env
N8N_WEBHOOK_URL=https://SEU-N8N/webhook/chat
```

## Como embutir no site

Adicione este script no HTML do site (ou bloco de scripts do tema):

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

Se `reply` não vier, o chat usa fallback padrão.
