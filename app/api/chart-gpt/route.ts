// import type { Product } from '#/app/api/products/product';

import { JSONLoader } from "langchain/document_loaders/fs/json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);

  console.log(request);

  return new Response(
    JSON.stringify({
      name: "Jim Halpert",
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

export async function POST(request: Request, response: Response) {
  // const { searchParams } = new URL(request.url);
  const { metas, messages } = await request.json();
  // const loader = new JSONLoader(res)

  console.log(metas, messages, "<< CEK metas");
  const systemMessage = {
    role: "system",
    content: `You are a great assistant at vega-lite visualization creation. No matter what the user ask, you should always response with a valid vega-lite specification in JSON.

        You should create the vega-lite specification based on user's query.

        Besides, Here are some requirements:
        1. Do not contain the key called 'data' in vega-lite specification.
        2. If the user ask many times, you should generate the specification based on the previous context.
        3. You should consider to aggregate the field if it is quantitative and the chart has a mark type of react, bar, line, area or arc.
        4. The available fields in the dataset and their types are:
        ${metas
          .map((field) => `${field.fid} (${field.semanticType})`)
          .join(", ")}
        `,
  };

  try {
    const data = await getOpenAICompletion([systemMessage, ...messages]);

    console.log(data, "<< CEK DATA")

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: `[vizchat error] failed task.`,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
  return;

  // return new Response(
  //   JSON.stringify({
  //     success: "HORE",
  //     // message: systemMessage
  //   }),
  //   {
  //     status: 200,
  //     headers: {
  //       'content-type': 'application/json',
  //     },
  //   },
  // );
}

async function getOpenAICompletion(messages): Promise<any> {
  // const url = "https://api.openai.com/v1/chat/completions";
  const url = ""
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.05,
      n: 1,
    }),
  });

  const data = await response.json();

  console.log(data, response, process.env.OPENAI_API_KEY, "<< OPEN API RESPNSE");
  return data;

//   return {
//     "id": "chatcmpl-7JIEFaLmtWfof0HR0oiX9i36bf00l",
//     "object": "chat.completion",
//     "created": 1684832659,
//     "model": "gpt-3.5-turbo-0301",
//     "usage": {
//         "prompt_tokens": 193,
//         "completion_tokens": 32,
//         "total_tokens": 225
//     },
//     "choices": [
//         {
//             "message": {
//                 "role": "assistant",
//                 "content": "Sure! Can you please provide more details about the data you want to visualize? Which field should be on the x-axis and which one on the y-axis?"
//             },
//             "finish_reason": "stop",
//             "index": 0
//         }
//     ]
// };
}
