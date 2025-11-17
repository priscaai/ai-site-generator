import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const body = await req.json();

    const { brief } = body;

    if (!brief) {
      return NextResponse.json(
        { error: "O campo 'brief' é obrigatório." },
        { status: 400 }
      );
    }

    const prompt = `
Você é uma IA especialista em criação de sites profissionais.
Sua missão é transformar o brief abaixo em um site completo usando HTML + CSS + JS simples, limpo e funcional.

Regras obrigatórias:
- O código deve ser organizado, claro e comentado.
- O site deve ser 100% responsivo.
- Não use dependências externas (nem Bootstrap, nem Tailwind).
- Gere:
  - index.html
  - styles.css
  - script.js (somente se necessário)
- O design deve seguir o estilo informado pelo usuário (cores, vibe, estética).
- Seções obrigatórias:
  1. Header com logo/nome
  2. Hero com frase principal e CTA
  3. Sobre
  4. Serviços / Ofertas
  5. Depoimentos (opcional)
  6. Contato
  7. Rodapé simples
- Use imagens do Unsplash com temas coerentes.
- Gere textos prontos e profissionais.
- Sempre retorne TUDO dentro de um objeto JSON assim:

{
  "html": "...",
  "css": "...",
  "js": "..."
}

BRIEF DO USUÁRIO:
${brief}
`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key não encontrada no servidor." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1", // Você pode mudar para 5.1 quando quiser
        input: prompt,
        max_output_tokens: 20000,
      }),
    });

    const data = await response.json();

    if (!data || !data.output_text) {
      return NextResponse.json(
        { error: "A IA não retornou uma resposta válida.", detalhe: data },
        { status: 500 }
      );
    }

    const texto = data.output_text;

    return NextResponse.json({ success: true, result: texto });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro interno", detalhe: err.message },
      { status: 500 }
    );
  }
}
