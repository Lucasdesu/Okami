export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Okami Web Chat</h1>
      <p>Use o script <code>/widget.js</code> para embutir o chat no seu site.</p>
      <p>
        Exemplo:
        <code>{` <script src=\"https://SEU-DOMINIO.vercel.app/widget.js\" data-chat-origin=\"https://SEU-DOMINIO.vercel.app\" defer></script>`}</code>
      </p>
    </main>
  );
}
