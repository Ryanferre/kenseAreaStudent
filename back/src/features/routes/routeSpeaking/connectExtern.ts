import {Redis} from "ioredis"
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import Groq from "groq-sdk";
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
  const prompt= `Você é um assistente de um professor e vai análisar linguística em avaliação de fala em inglês.
                  REGRAS OBRIGATÓRIAS:
                  - NÃO corrija gramática, vocabulário ou estrutura da frase.
                  - NÃO reescreva a frase.
                  - NÃO normalize o texto para o inglês padrão.
                  - Analise exatamente o que o usuário falou.

                  ENTRADA QUE VOCÊ RECEBERÁ:
                  1) Uma transcrição de fala gerada a partir de áudio.
                  2) A transcrição pode conter aproximações fonéticas, erros de pronúncia ou construções não nativas.

                  SUA FUNÇÃO:
                  - Analisar como o usuário fala inglês, não como ele deveria falar.
                  - Focar na pronúncia, substituições fonéticas e padrões de fala não nativos.
                  - Identificar possíveis intenções fonéticas quando as palavras diferem do inglês padrão
                    (exemplos: "der" no lugar de "the", "thili" no lugar de "the").

                  RETORNE A ANÁLISE EXATAMENTE NA ESTRUTURA ABAIXO:

                  1. Transcrição literal recebida (sem alterações)
                  2. Observações fonéticas (pode usar explicações semelhantes a IPA, sem correção)
                  3. Feedback pedagógico curto explicando o que o usuário fez, não o que é o correto
                  4. não sugira ou indique nada
                  5- texto curto de no maximo 8 linhas

                  TOM DA RESPOSTA:
                  - Neutro
                  - Analítico
                  - Educacional`
  const IaAnalytic= await connectIA(textAnswer, prompt)

  console.log("analise gerada: ", IaAnalytic)
  return IaAnalytic
}

//correção de palavras
async function correctPhase(audioPath: string){
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const response = await fetch(
    `https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`,
    {
      method: "POST",
      headers: {
        "Content-Type": "audio/pcm; samplerate=16000",
        "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY!,
      },
      body: audioBuffer, // ✅ BUFFER DIRETO
    }
  );

  const result = await response.json();
  console.log("resultado de correção: ", result);

  return result.DisplayText

  } catch (error) {
    console.log("erro ao transcrever audio do usuario: ", error)
  }
}
//de audio para texto usando azure speech
async function transcribeAudio(filePath: any) {
  console.log("caminho do audio: ", filePath)
    const paramsJson = JSON.stringify({
      GradingSystem: "HundredMark",
      Granularity: "Phoneme",
      Dimension: "Comprehensive",
      EnableMiscue: true
    });
    const pronAssessmentHeader = Buffer.from(paramsJson).toString("base64");

    const toCorrectPhase= await correctPhase(filePath)
    //se a frase nao for clara e a azure nao conseguir identificar, e enviado essa menssagem a polly
      if(toCorrectPhase === ''){
        const errorUserAnswer=  `Não consegui compreender o que voce falou. Por favor, tenha certeza que esta em um local sem interrupções externas
                                 ou com barulhos que possa interferirr no audio`

        return {errorType: true, TalkError: errorUserAnswer}
      }
  try {
      const audioBuffer = fs.readFileSync(filePath);

      const res = await fetch(
          "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US",
          {
            method: "POST",
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY!,
              "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
              "Pronunciation-Assessment": pronAssessmentHeader,
            },
            body: audioBuffer,
          }
        );
        const data = await res.json();
        const resPost= data?.NBest[0]

        console.log("words retornado: ", data)
        const userPhoneme= {
          AccuracyScore: resPost?.AccuracyScore || '',
          FluencyScore: resPost?.FluencyScore || '',
          CompletenessScore: resPost.CompletenessScore || '',
          PronScore: resPost?.PronScore || '',
          Words: resPost?.Words ? resPost?.Words[0]?.Word : '',
          wordsAcurrency: resPost?.Words ? resPost?.Words[0]?.AccuracyScore : '',
          Syllables: resPost?.Words ? resPost?.Words[0]?.Syllables : '',
          WordsPhoneme: resPost?.Words ? resPost?.Words[0]?.Phonemes : '',
          audioUserPhase: toCorrectPhase
        }

        return userPhoneme
  } catch (error) {
    console.log("erro de transcrição: ", error)
  }
}

async function connectPolly (text: string, language: string){
  console.log("texto recebido: ", text, language)
  const urlconnect= "http://localhost:8000/speaking/polly"
  try {
    const voice_id= language == "pt-BR" ? "Camila" : "Joanna"
    const connect= await fetch(urlconnect, {method: "POST", headers: {"Content-Type": "application/json"},
                          body: JSON.stringify({
                            text,
                            language,
                            voice_id
                          })})

    const arrayBuffer = await connect.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    console.log("🎧 Bytes de áudio:", arrayBuffer);

    return audioBuffer
    
  } catch (error) {
    console.log("erro de conexão com a polly: ", error)
  }
}

export const speakingSteps = [
  // 🟢 A1 — Iniciante absoluto
  {
    level: "A1",
    instruction: "Fale seu nome, idade e de onde você é",
    promptAudio:
      "Hello! Let’s start. Please say your name, your age, and where you are from.",
    maxTime: 20,
  },
  {
    level: "A1",
    instruction: "Fale sobre algo que você gosta de fazer no tempo livre",
    promptAudio:
      "Thank you. Now, tell me something you like to do in your free time.",
    maxTime: 20,
  },

  // 🟡 A2 — Básico
  {
    level: "A2",
    instruction: "Descreva sua rotina diária",
    promptAudio:
      "Good. Now, describe your daily routine.",
    maxTime: 30,
  },
  {
    level: "A2",
    instruction: "Fale sobre sua comida favorita e explique o motivo",
    promptAudio:
      "Nice. What is your favorite food? Why do you like it?",
    maxTime: 30,
  },

  // 🟠 B1 — Intermediário
  {
    level: "B1",
    instruction: "Descreva uma experiência importante da sua vida",
    promptAudio:
      "Now, please describe an important experience in your life.",
    maxTime: 45,
  },
  {
    level: "B1",
    instruction: "Fale sobre uma viagem que você fez ou gostaria de fazer",
    promptAudio:
      "Thank you. Talk about a trip you have taken or would like to take.",
    maxTime: 45,
  },

  // 🔵 B2 — Intermediário avançado
  {
    level: "B2",
    instruction: "Explique um problema do dia a dia e como você resolve",
    promptAudio:
      "Now, explain a problem you face in your daily life and how you solve it.",
    maxTime: 60,
  },
  {
    level: "B2",
    instruction: "Fale sobre vantagens e desvantagens de estudar ou trabalhar remotamente",
    promptAudio:
      "Discuss the advantages and disadvantages of working or studying remotely.",
    maxTime: 60,
  },

  // 🟣 C1 — Avançado
  {
    level: "C1",
    instruction: "Dê sua opinião sobre o impacto da tecnologia na comunicação",
    promptAudio:
      "Give your opinion on the impact of technology on human communication.",
    maxTime: 75,
  },
  {
    level: "C1",
    instruction: "Descreva uma situação complexa que exigiu tomada de decisão",
    promptAudio:
      "Describe a complex situation that required decision making.",
    maxTime: 75,
  },

  // 🔴 C2 — Proficiência
  {
    level: "C2",
    instruction: "Analise um tema social ou cultural relevante atualmente",
    promptAudio:
      "Analyze a relevant social or cultural topic of your choice.",
    maxTime: 90,
  },
  {
    level: "C2",
    instruction: "Defenda um ponto de vista com o qual você não concorda",
    promptAudio:
      "Defend a point of view that you do not personally agree with.",
    maxTime: 90,
  },
]

function bufferToPCM(buffer: any) {
  console.log("dados de entrada: ", buffer)
  const bufferWeb = Buffer.from(buffer)
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();

    //recebe dados da biblioteca
    const outputStream = new PassThrough();

    //array para juntar os dados convertidos
    const chunks: any [] = [];

    //envia os dados(buffer e determina se acabou ou não)
    inputStream.end(bufferWeb);

    //configuração do ffmpeg
    ffmpeg(inputStream)//recebe os dados
      .audioChannels(1)//determina o canal(nesse caso e 1)
      .audioFrequency(16000)//determina a frequencia(nesse caso e 16)
      .audioCodec("pcm_s16le")//transforma em audio pcm
      .format("s16le")//determina o formato de saida(nesse caso, bytes brutos)
      .on("error", reject)//tratamento de erro
      .pipe(outputStream)//se sair tudo bem, os dados vao para o "outputStream"
    outputStream.on("data", chunk => chunks.push(chunk))//pega os dados de "outputStream" e coloca no array
    outputStream.on("end", () => resolve(Buffer.concat(chunks)))//ao final, pega o array com os dados e transforma em um buffer no qual o transcribe entende

  })
}

async function analyticProcess (audio: any){
  //converter audio para PCM
  const toPCM: any= await bufferToPCM(audio)
  //salvar audio
  const saveAudio= saveTempAudio(toPCM)



  console.log("dados salvo: ", saveAudio)

  if(saveAudio){
    const audioToText: any= await transcribeAudio(saveAudio)

    console.log("dados toText: ", audioToText)

    if(!audioToText.errorType){
        const analitycIA = await analiticAswer(audioToText)
        return analitycIA
    }else{
      return audioToText
    }
  }
}

export async function workSpeaking(userId: string, action: string, audio: any, io: any){
  const room = `speaking:${userId}`
  const key = `speaking:test:${userId}`

  console.log("dados chegaram no destino: ", userId, action, audio)

  let audioPolly;
  let phase;
  let res;
  //🔹 START
  if (action === "start") {
    const initialState = {
      currentStep: 1,
      startedAt: new Date().toISOString(),
    }

    await redis.set(key, JSON.stringify(initialState), "EX", 1800)

    //envia primeira frase a polly
    const getprimertalk= await connectPolly(speakingSteps[0].promptAudio, "en-US")

    res= "start",
    audioPolly= getprimertalk
    phase= speakingSteps[0].promptAudio
  }

  const raw: any = await redis.get(key)

  const state = JSON.parse(raw)

  // 🔹 NEXT
  if (action === "next") {
    console.log("erro de acess next: ", state)
    //estagio atual. quando o step for maior que o array, e sinal que nao existe mais dados para mandar para a polly
    const step = speakingSteps[state.currentStep]
    //envia audio para transformar em texto e gera analise usando ia quando o usuario responder a questão
    const sendAnswer: any= audio != "Não soube responder a pergunta" ? await analyticProcess(audio.data) : "Não soube responder a pergunta"

    //em caso de erros na transcrição do audio. analyticProcess evia um objeto com o erroType como "True" e o audio ja formado pela polly em "TalkError"
    if(sendAnswer.TalkError){
      res= "",
      audioPolly= await connectPolly(sendAnswer.TalkError, "pt-BR")
      phase= ''
    }else{
      //cada resposta e guardada no s3 aws
      /*const sendAnswerS3= fetch("http://localhost:8000/upload-audio", {method: "POST", headers: {"Content-Type": "application/json"},
                          body: JSON.stringify({
                            clerk_id: userId,
                            file: audio.data
                          })})*/

      
      

      //esse bloco decide quando finalizar o teste. A logica e: enquanto step for valida, o fluxo continua
      if (!step) {
        res= sendAnswer,
        audioPolly= ''
        phase= false
      }else{
        // 👉 Polly
        const getprimertalk= await connectPolly(step.promptAudio, "en-US")
        state.currentStep++

        await redis.set(key, JSON.stringify(state), "EX", 1800)


        //variaveis que carragam as repostas
        res= sendAnswer,
        audioPolly= getprimertalk
        phase= step.promptAudio
      }
    }
  }

  /* 🔹 ANSWER
  if (action === "answer") {
    const step = speakingSteps[state.currentStep]

    // 👉 futuramente Transcribe + IA
    const transcript = "mock transcript"
    const score = Math.random()

    state.answers.push({
      step: state.currentStep,
      level: step.level,
      transcript,
      score,
    })

    state.currentStep++

    // terminou?
    //if (!speakingSteps[state.currentStep]) {
    //  const finalLevel = calculateLevel(state.answers)
    //  await redis.del(key)

    //  return {
    //    finished: true,
    //    level: finalLevel,
    //  }
   // }

    await redis.set(key, JSON.stringify(state), "EX", 1800)
  }*/
 
  // 📡 envia resposta para a sala correta
  io.to(room).emit("speakingresponse:response", {
        from: "kense",
        res: res,
        audioPolly: audioPolly,
        phase: phase,
        createdAt: new Date(),
  });
}