
import { dataSpeakingTest } from "./workerspeaking.js"

export async function speackingProhibitend(request: any, reply: any) {
  //const userId = request.user.id

  //const { action } = request.body
  let userId = "";
  let action = "";
  let audioBuffer: Buffer | undefined;

  if (!request.isMultipart()) {
      return reply.status(400).send({ error: "Esperado multipart/form-data" });
    }

  const parts = request.parts(); // Itera sobre arquivos e campos

  console.log("parts: ", parts)

    for await (const part of parts) {
      // 🎧 Arquivo (opcional)
        if (part.type === "file") {
          if (part.fieldname === "audio") {
            console.log("🎧 áudio recebido");
            audioBuffer = await part.toBuffer(); // 🔥 consome o stream
          } else {
            // qualquer outro arquivo precisa ser consumido
            part.file.resume();
          }
        }else{
          if(part.value == 'Não soube responder a pergunta'){
            audioBuffer= part.value
          }
        }

        // 🧾 Campos obrigatórios
        if (part.type === "field") {
          if (part.fieldname === "userId") userId = part.value;
          if (part.fieldname === "action") action = part.value;
        }
    }

  //Campos enviados pelo formData

  console.log("📦 multipart processado");

  try {
    console.log("entrou no try")
    const audio = audioBuffer // Buffer
    const connectInWorkerSpeaking= await dataSpeakingTest(userId, action, audio)

    console.log("resposta recebida: ", connectInWorkerSpeaking)

    reply.send(connectInWorkerSpeaking)
  } catch (error) {
   console.error("erro de verificação na conexão speaking:", error);
   return reply.status(500).send({ error: "Erro interno no speaking" });
  }
}