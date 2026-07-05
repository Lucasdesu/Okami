type BotRule = {
  keywords: string[];
  reply: string;
};

const STORE_URL = "https://metasuplementos.store";
const WHATSAPP_URL = "https://wa.me/5511965377603";

const rules: BotRule[] = [
  {
    keywords: ["atendimento", "contato", "humano"],
    reply: `Caso voce precise entrar em contato conosco, mande mensagem para nosso atendente pelo WhatsApp para verificarem melhor: ${WHATSAPP_URL}`
  },
  {
    keywords: ["belem", "para", "fora de sp", "outro estado", "norte", "nordeste", "rio de janeiro", "minas gerais"],
    reply: `No momento, realizamos entregas apenas em Sao Paulo. Se quiser, posso te direcionar para um atendente no WhatsApp: ${WHATSAPP_URL}`
  },
  {
    keywords: ["entrega", "frete", "envio", "receber", "prazo", "sp", "sao paulo"],
    reply: "Realizamos entregas para toda Sao Paulo. Para consultar valores, prazos e finalizar a compra, continue o processo de compra em nosso site."
  },
  {
    keywords: ["erro", "falhou", "problema", "cobrou", "nao consegui pagar", "pagamento nao", "dificuldades"],
    reply: `Nesse caso, vou te direcionar para um atendente pelo WhatsApp para verificarem melhor: ${WHATSAPP_URL}`
  },
  {
    keywords: ["pagamento", "pagar", "pix", "cartao", "boleto", "parcelamento", "parcela"],
    reply: "Aceitamos pagamentos por cartao, Pix e Boleto, entretanto nao parcelamos o valor. A realizacao do pedido e pagamento e feita diretamente pelo site."
  },
  {
    keywords: ["comprar", "compra", "quero comprar", "link", "site", "pedido"],
    reply: `A compra e feita diretamente pelo nosso site. Voce pode escolher os produtos, conferir as informacoes e finalizar o pagamento por la: ${STORE_URL}`
  },
  {
    keywords: ["whey", "creatina", "vitamina", "suplemento", "pre-treino", "hipercalorico"],
    reply: `Temos opcoes de whey, creatina, vitaminas e outros suplementos no site. Para ver disponibilidade, valores e marcas, o ideal e consultar diretamente pelo catalogo: ${STORE_URL}`
  },
  {
    keywords: ["personal", "nutricionista", "nutri", "acompanhamento", "consultoria"],
    reply: `Para falar sobre acompanhamento com personal ou nutricionista, vou te direcionar para o WhatsApp: ${WHATSAPP_URL}`
  }
];

const defaultReply =
  "Posso te ajudar com entrega, pagamento, compra pelo site, produtos disponiveis ou atendimento humano. Sobre o que voce gostaria de falar?";

export function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getBotReply(message: string) {
  const normalizedMessage = normalizeMessage(message);
  const match = rules.find((rule) => rule.keywords.some((keyword) => normalizedMessage.includes(keyword)));

  return match?.reply ?? defaultReply;
}
