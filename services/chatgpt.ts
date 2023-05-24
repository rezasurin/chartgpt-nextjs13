export interface IMessage {
  role: string;
  content: string;
}
export interface IResponse {
  id: string;
  object: string;
  model: string;
  usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
  };
  choices: { message: { role: string; content: string } }[];
}

export async function chatCompletation(
  messages: IMessage[], metas: any[]
): Promise<any> {
  const url = `/api/chart-gpt`;
  const res = await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          messages,
          metas
      }),
  });

  console.log("<<< CEKKK xxx" ,{ messages, metas})
  const result = (await res.json()) as {
      data: any;
      success: boolean;
      message?: string;
  };
  if (result.success) {
      return result.data;
  } else {
      throw new Error(result.message ?? "Unknown error");
  }
}