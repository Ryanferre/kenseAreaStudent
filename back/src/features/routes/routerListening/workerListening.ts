import {Redis} from "ioredis";
import dotenv from "dotenv"
dotenv.config()
import { workerListenig } from "./conectExtern.js";

//conexão com o redis
const redisPro = new Redis();
const redisCon = new Redis();

//função while. puxa dado da fila para iniciar execulção
export async function filaspeakingteste(io: any) {
console.log("função de fila chamada")
  while (true) {
    //puxa dado da fila
    const job = await redisCon.blpop("filalistenigteste", 0);
    console.log("worker iniciado")

    console.log("job recebido:", job);
    if (!job) continue;

    const payload = JSON.parse(job[1]);
    const lockKey = `usertestelistening:lock:${payload.userId}`;

    console.log("lockkey na fila: ", lockKey)
    try {
      await Promise.race([
        workerListenig(payload.answer),//mando dados para a função(audio do aluno, identificação e ação)
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout IA")), 5 * 60 * 1000)
        )
      ]);

    } catch (error) {
      console.error("Erro no job:", payload.menssage, error);

    } finally {
      // 🔥 ESSENCIAL: libera o lock
      await redisCon.del(lockKey);
    }
  }
}


export async function dataListeningTest(userId: string, answer: any) {
  console.log("entrada de dado na dataListeningTest: ", answer)
  try {
    //identificacao do usuario
    const lockKey: any = `usertestelistening:lock:${userId}`;

    const locked = await redisPro.set(
    lockKey,
    "1",
    "EX",
    3600,
    "NX"
    );

    if (!locked) {
      return {
        status: 200,
        message: "A sua messagem está em processamento. Aguarde!"
      };
    }

    await redisPro.rpush(
      "filaspeakingteste",
      JSON.stringify({ userId, answer })
    );

    return {
      status: 202,
      message: "Estou pensando um pouco..."
    };
  } catch (error) {
    console.error("Erro ao enfileirar:", error);
    return { status: 500 };
  }
}