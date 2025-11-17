import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
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
- Sempre retorne TUDO dentro deste formato JSON:

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
        { error: "API key não encontrada nas variáveis de ambiente." },
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
        model: "gpt-4.1",
        input: prompt,
        max_output_tokens: 20000,
      }),
    });

    const data = await response.json();

    if (!data?.output_text) {
      return NextResponse.json(
        {
          error: "A IA não retornou um campo 'output_text'.",
          detalhe: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data.output_text,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro interno ao gerar o site.", detalhe: err.message },
      { status: 500 }
    );
  }
}
