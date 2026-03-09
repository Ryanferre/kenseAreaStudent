import {Redis} from "ioredis"
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import "dotenv/config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { connectIA } from "../../connectAI/connectIA.js";
dotenv.config();

ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);

import { PassThrough } from "stream";

const redis= new Redis()

//salvar audio de forma temporaria
function saveTempAudio(buffer: Buffer) {
  const tmpDir = path.resolve("./tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const filename = `audio-${randomUUID()}.wav`;
  const filePath = path.join(tmpDir, filename);

  fs.writeFileSync(filePath, buffer);

  return filePath;
}

//analise da ia em relação a resposta
async function analiticAswer(textAnswer: any){
  const prompt= `Você é um avaliador profissional de escrita em inglês especializado nos níveis do CEFR (A1, A2, B1, B2, C1, C2).

                Avalie o texto do aluno com base em:

                - Correção gramatical
                - Complexidade das estruturas
                - Variedade e precisão do vocabulário
                - Coesão e organização das ideias
                - Clareza na comunicação

                Regras importantes:

                - Não superestime o nível.
                - Se o texto tiver apenas frases simples, o máximo é B1.
                - Para C1, deve haver estruturas complexas frequentes e vocabulário preciso.
                - Para C2, exige controle quase nativo, nuance e sofisticação consistente.
                - Erros frequentes limitam o nível a B1 ou inferior.
                - Baseie o nível no desempenho geral.

                Retorne APENAS um JSON válido no seguinte formato:

                {
                  "score": 1 a 100,
                  "feedback": "comentário curto explicando o motivo do nível e como melhorar",
                }

                Não inclua explicações extras.
                Não inclua texto fora do JSON.
                QUALQUER RESPOSTA QUE NÃO SEJA UM JSON VAI SER AULTOMATICAMENTE DESCARTADA!!!`
  const IaAnalytic: any= await connectIA(textAnswer, prompt)

  console.log("analise gerada: ", IaAnalytic)
  return IaAnalytic
}


//entrada de dados para processamento
export async function workWriting(userId: any, answer: string, io: any){
  const room = `writing:${userId}`

  console.log("dados chegaram no destino: ", userId, answer)

  const sendAnswerForIA= await analiticAswer(answer)

  if(sendAnswerForIA){
    const parsed =
        typeof sendAnswerForIA === "string"
          ? JSON.parse(sendAnswerForIA)
          : sendAnswerForIA

      io.to(room).emit("writingresponse:response", {
        ...parsed,
        createdAt: new Date(),
      });
      }
}