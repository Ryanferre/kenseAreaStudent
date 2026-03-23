import { useState, useEffect, useRef, useContext } from "react"
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { io, Socket } from "socket.io-client";
import { Howl } from "howler";
import AudioMessage from "./componetSpeaking/audiofila";
import AudioPreVialusation from "./componetSpeaking/preViasulation";
import { Link } from "react-router-dom";
import foxKense from "../../assets/—Pngtree—fox little fox animal pet_14115929.png"

let socket: Socket;

type soundOBJ={
  sound: Howl,
  from: string,
  duration: number
}

export default function SpeakingTest() {
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [urlAudio, setUrl] = useState<soundOBJ | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioVisualization, setAudioVisualization] = useState<soundOBJ | null>(null);
  const [progress, setProgress] = useState(0);
  const [LestMenssage, setLest]= useState<boolean>(false)
  const [pageFind, setPage]= useState<boolean>(false)
  const [loadSend, setLoad]= useState(false)
  const [audioBlod, setBlod]= useState<any>()
  const [toRecordUser, setRecord]= useState(false)
  const [messages, setMessages] = useState<any []>([])
  const [AnswerServer, setAswer]= useState< any []>([])
  const [LocationTest, setLocation]= useState('')
  const [explanation, setExplanation]= useState<boolean>(true)
  const { user } = useUser()
  const API_KEY = import.meta.env.VITE_SERVICE

  useEffect(()=>{

            const data_CRO: any = localStorage.getItem('data_CERF');

            const inJson: any = JSON.parse(data_CRO)
    
            //pega o primeiro item com status false
            const Finditem = inJson.list.findIndex((item: any) => item.status === false);

            //pega o item NA LISTA no qual foi modificado o status para true
            const recentmodifield= inJson.list.findIndex((item: any) =>  inJson.recentmodifield.index != null && item.element === inJson.recentmodifield.element)


            if( Finditem == recentmodifield){
                console.log("dados recente, comparação: ", Finditem, recentmodifield)
            }

            //se encontrar algo no recentmodifield
            if(recentmodifield !== -1){
                console.log("item que foi modificado: ", inJson.recentmodifield, Finditem, recentmodifield)
                return
            }
    
            //cria uma nova lista que muda o status do primeiro item que achar para false
            const listModifield= inJson.list.map((elementItem: any, i: number) => {
                        if(i === Finditem){
                            return { ...elementItem, status: true }
                        }
    
                        return elementItem
                    })

            const IstheEnd= Finditem.element == listModifield[listModifield.length-1].element
    
             console.log("dado alterado: ", IstheEnd)

             const list: any= {
                       list: listModifield,
                       recentmodifield: {index: Finditem, element: listModifield[Finditem].element, Next: true},
                       status: IstheEnd == true ? "FINISHED" : inJson.status
                }
             localStorage.setItem('data_CERF', JSON.stringify(list));

                if(Finditem !== -1) {
                    console.log("dadode mudança: ", inJson.list[Finditem])
                    switch (inJson.list[Finditem].element) {
                                    case "reading":
                                        setLocation("/readingtest")
                                        break;
                                    case "speaking":
                                        setLocation("/speaking")
                                        break;
                                    case "writing":
                                        setLocation("/Writing")
                                        break;
                                    case "listening":
                                        setLocation("/listening")
                                        break;
                                    default:
                                        break;
                    }
                }
            }, [])

  //menssagens recebe o audio do usuario ou kense
  function menssages(from: any, newSound: any, duration: any){
    console.log("tamanho do array: ", messages)

    setMessages(prev => [...prev, <AudioMessage key={prev.length} sound={newSound} from={from} duration={duration} />]);
  }
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const chunksRef = useRef<Blob[]>([]);
const dataPreVisualization= useRef<soundOBJ | null>(null)

useEffect(()=>{
  //salva os dados em um useRefe para enviar ao back-end
  dataPreVisualization.current= isAudioVisualization

  console.log("chamou a modificação do useRef: ", dataPreVisualization)
}, [isAudioVisualization])

//audio do usuario
useEffect(() => {
  if (!urlAudio) return;

  menssages(
    urlAudio.from,
    urlAudio.sound,
    urlAudio.duration
  );
}, [urlAudio]);


useEffect(() => {
  if (!urlAudio?.sound) return;

  let rafId: number;

  const updateProgress = () => {
    if (urlAudio?.sound.playing()) {
      const current = urlAudio?.sound.seek() as number;
      const duration = urlAudio?.sound.duration();
      setProgress(duration ? current / duration : 0);
    }
    rafId = requestAnimationFrame(updateProgress);
  };

  updateProgress();

  return () => cancelAnimationFrame(rafId);
}, [urlAudio]);

//formula audio da kense
const playPollyAudio = (audioPolly: any) => {
  urlAudio?.sound?.unload();
  const blob = new Blob([audioPolly], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  const newSound = new Howl({
    src: [url],
    html5: true,
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => {
      setIsPlaying(false);
      setProgress(0);
    }
  });

  const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setTimeout(()=>{
        setUrl({sound: newSound, from: "kense", duration: audio.duration});
      }, 1500)
    });
  
};


//criação de configuração player user
async function startRecording() {
  chunksRef.current = [];
  setUrl(null);
  setRecording(true);

  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 256000 });
  mediaRecorderRef.current = mediaRecorder;

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(chunksRef.current, {
      type: "audio/webm"
    });

    console.log("🎧 Blob final:", audioBlob);
    setBlod(audioBlob)
    //para microfone ao des-precionar
    stream.getTracks().forEach(track => track.stop());

    const audioUrl: any = URL.createObjectURL(audioBlob);
    const newSound = new Howl({
      src: [audioUrl],
      format: ["webm"], // obrigatório
      preload: true,    // importante
      onload: () => {
        console.log("duração correta:", newSound.duration());

        //manda o audio e suas configurações para o state de pre-visualização
        setAudioVisualization({
          sound: newSound,
          from: "user",
          duration: newSound.duration()
        });
      }
    });

    console.log("newsound: ", audioUrl)
  };

  mediaRecorder.start();
  console.log("🎙️ Gravando...");
}

//configuração de gravação
function stopRecording() {
  setRecording(false);
  setStep(prev => prev + 1);
  mediaRecorderRef.current?.stop();
}

function cancelRecording() {
  if (!recording) return;
  setUrl(null)
  mediaRecorderRef.current?.stop();
  mediaRecorderRef.current = null;
  chunksRef.current = [];
  setRecording(false);
}

useEffect(() => {
      if(user){
        const userClerck= user.id
  
        // Conecta no servidor Socket.IO
        socket = io("http://localhost:4000", {
          transports: ["websocket"],
          auth: {
            token: API_KEY, // aqui vai a chave
            userId: userClerck
          },
        });
  
        // Quando conectar: entrar na sala
        socket.on("connect", () => {
          console.log("Conectado ao socket:", socket.id);
  
          // Entra na sala do usuário
          socket.emit("speaking:join", { userClerck });
        });
  
        // Quando desconectar
        socket.on("disconnect", () => {
          console.log("Desconectado do socket");
        });
  
        //resposta
        socket.on("speakingresponse:response", (data: any) => {
          console.log("dados recebidos: ", data)
          if(data.phase == "Defend a point of view that you do not personally agree with."){
            setLest(true)
          }
          playPollyAudio(data.audioPolly)
          const ObjectToResponse= {
                Context: data.phase,
                Answer:  data.res
          }

          setAswer((prev: any)=>[...prev, ObjectToResponse])
          
        })
  
        // Cleanup
        return () => {
          socket.disconnect();
        };
      }
    }, [user]);

  const connect= async (nextNotAswer: boolean)=>{
      if(dataPreVisualization.current){
        setLoad(true)
        setUrl({sound: dataPreVisualization.current?.sound, from: "user", duration: dataPreVisualization.current?.duration})
        setAudioVisualization(null)
      }
      if(user){
        const formData = new FormData();

        console.log("id de usuario: ", user.id)
        if(nextNotAswer){
          console.log("entrada em proxima: ", nextNotAswer)
          formData.append("audio", "Não soube responder a pergunta");
          formData.append("userId", user.id);
          formData.append("action", "next");

          const server= await axios.post("http://localhost:4000/speakingteste", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${API_KEY}`
            }
          });
          console.log("dados recebido: ", server)
          return
        }

        if(audioBlod && !nextNotAswer){
          formData.append("audio", audioBlod, "audio.webm");

          formData.append("userId", user.id);
          formData.append("action", "next");

          const server= await axios.post("http://localhost:4000/speakingteste", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${API_KEY}`
            }
          });


          console.log("dados recebido: ", server)
        }else{
          formData.append("userId", user.id);
          formData.append("action", "start");

          const server= await axios.post("http://localhost:4000/speakingteste", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${API_KEY}`
            }
          });


          console.log("dados recebido: ", server)
        }
      }
  }


  const FindTest= ()=>{
    setPage(true)
  }
useEffect(()=>{
  try {
    connect(false)
  } catch (error) {
    console.log("erro de conexao: ", error)
  }
}, [])

const torecord= ()=>{
  if(toRecordUser){
    setRecord(false)
    stopRecording()
  }else{
    setRecord(true)
    startRecording()
  }
}

  return (
    <div className="w-full mx-auto">
    <section className="bg-blue-100 flex flex-col items-center h-175 w-full rounded-lg">
      {explanation === true ? 
                  <div className="flex flex-col py-4 gap-4 h-140">
                      <div className="w-max h-max flex flex-row">
                          <img className="w-15 h-15" src={foxKense} />
                              <div className="w-130 flex flex-col gap-3 px-7 py-4 rounded-lg h-max bg-[#ededf2]">
                                  <h1 className="font-bold text-2xl mb-4">🗣️ Como funciona o teste de Speaking</h1>
                                <p className="mb-2">
                                  Você entrará em um chat de voz interativo para validarmos sua fluência e pronúncia no inglês.
                                </p>
                                <p className="mb-4 text-gray-600 italic">
                                  Sinta-se em uma conversa real 😌 — o objetivo é medir sua capacidade de comunicação natural.
                                </p>

                                <h2 className="font-bold text-xl mb-2">🎤 Durante o teste</h2>
                                <ul className="space-y-3 mb-4">
                                  <li>
                                    🔹 <strong>Conversa Evolutiva:</strong> O chat seguirá assuntos específicos, progredindo do nível <strong>A1 ao C2</strong> conforme o diálogo avança.
                                  </li>
                                  <li>
                                    🔹 <strong>Interação por Áudio:</strong> Você ouvirá os enunciados e deverá responder falando, como em uma conversa normal.
                                  </li>
                                  <li>
                                    🔹 <strong>Flexibilidade:</strong> Caso não se sinta confortável com um tópico, você tem a opção de não responder e solicitar o próximo áudio.
                                  </li>
                                  <li>
                                    🔹 <strong>Foco no Aprendizado:</strong> Não se preocupe com erros. Estamos aqui para identificar seus pontos fortes e onde podemos te ajudar a evoluir.
                                  </li>
                                </ul>

                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                  <p className="font-medium text-blue-800">✨ Dica: Nada de pegadinhas!</p>
                                  <p className="text-blue-700">Responda com sinceridade e mantenha a calma. O importante é se expressar. Good luck! 🚀</p>
                                </div>
                              </div>
                      </div>
                      <div className="flex flex-row justify-center">
                              <button onClick={()=> {setExplanation(false)}} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
                                  Começar
                              </button>
                      </div>
                  </div> :
          <>
          {pageFind === false ?
          <>
            <div className="w-full px-3 h-155 overflow-y-auto">
              {messages.map((element: any, index: number) => {
              return (
              <div key={index}>
                {element}
              </div>)})}
            </div>
            <div className="w-200 mb-2 mx-auto h-13 flex flex-row justify-between items-center p-1 px-3 rounded-lg gap-3 bg-white absolute b-0"  style={{bottom: '3%'}}>
                {isAudioVisualization !== null ?
                <>
                <AudioPreVialusation sound={isAudioVisualization.sound} from={"user"} duration={isAudioVisualization.duration} />
                {LestMenssage === false ?
                <button onClick={()=> connect(false)} className="w-max px-6 h-10 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">Enviar</button>
                :
                <button onClick={()=> FindTest()} className="w-max px-6 h-10 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">Enviar e finalizar</button>
                }
                </>
                  :
                <>
                <button onClick={()=> connect(true)} className="w-max px-6 h-10 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">Não sei responder</button>
                <p className="font-bold text-[#696969]">Clique no microfone para gravar uma resposta 👉</p>
                <button onClick={()=> torecord()} className={` w-15 h-15 rounded-full border-[6px] hover:cursor-pointer border-white text-[28px] text-white bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition-transform duration-100 active:scale-125 ${recording ? "bg-red-600 scale-115" : ""}`}>🎤</button>
                </>
                }
            </div>
          </>
          :
          <div>
            <h1>Voce foi muito bem!</h1>
            <p>Importante: Infelizmente, não posso fornecer uma métrica imediata de acertos e erros. Essa informação será disponibilizada após a análise detalhada do professor responsável. Contudo, não se preocupe: seu desempenho preliminar foi muito favorável.
            </p>
            <Link to={LocationTest}>Proximo</Link>
          </div>
          }
          </>}
    </section>
    </div>
  )
}