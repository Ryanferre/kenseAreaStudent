import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { io, Socket } from "socket.io-client";
type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
let socket: Socket;

const WritingLevelTest = () => {
  const [phase, setPhase] = useState<Boolean>(true);
  const [guidedText, setGuidedText] = useState("");
  const [score, setScore] = useState(0);
  const [Level, setLevel] = useState('')
  const [menssage, setMenssage] = useState('')
  const [LocationTest, setLocation]= useState('')
  const { user } = useUser();
  const API_KEY = import.meta.env.VITE_SERVICE;
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
          socket.emit("writing:join", { userClerck });
        });
  
        // Quando desconectar
        socket.on("disconnect", () => {
          console.log("Desconectado do socket");
        });
  
        //resposta
        socket.on("writingresponse:response", (data: any) => {
          console.log("dados recebidos: ", data)

          getLevel(data.score)
          setScore(data.score)
        })
  
        // Cleanup
        return () => {
          socket.disconnect();
        };
      }
    }, [user]);

  const checkGuidedAnswer = async () => {
    console.log("String formulada: ", guidedText)

    try {
      if(user){
        const server= await axios.post("http://localhost:4000/writingteste", {userID: user.id, answer: guidedText}, {
                    headers: {
                      Authorization: `Bearer ${API_KEY}`
                    }
                  });

        console.log("resultado da conexão: ", server)
      }
    } catch (error) {
      
    }
    
  };

  function getLevel (value: number) {
    setPhase(false)

    const ObjectToResponse= {
            Context: "Write 3–5 sentences about your daily routine.",
            Answer:  guidedText
        }
        localStorage.setItem("WritingResponse", JSON.stringify(ObjectToResponse))

    if (value < 20){
      setLevel("A1")
      setMenssage("You're just starting — and that's awesome 🚀")
    }else if(value < 40){
      setLevel("A2")
      setMenssage("You're just starting — and that's awesome 🚀")
    }else if(value < 60){
      setLevel("B1")
      setMenssage("Nice progress! You're evolving fast 👏")
    }else if(value < 75){
      setLevel("B2")
      setMenssage("Nice progress! You're evolving fast 👏")
    }else if(value < 90){
      setLevel("C1")
      setMenssage("Almost fluent! Keep pushing 💪🔥")
    }else{
      setLevel("C2")
      setMenssage("Almost fluent! Keep pushing 💪🔥")
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-blue-100 flex flex-col items-center h-175 w-full rounded-lg">

        {phase === true ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Phase 2: Guided Writing
            </h2>
            <p className="text-gray-600 mb-4">
              Write 3–5 sentences about your daily routine.
            </p>

            <textarea
              value={guidedText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setGuidedText(e.target.value)
              }
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
              placeholder="Start writing here..."
            />

            <button
              onClick={checkGuidedAnswer}
              className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
            >
              Finish Test
            </button>
          </>
        ) 
        
        : 

         (
          <div className="max-w-xl mx-auto p-6 space-y-6 text-center">
                <h2 className="text-2xl font-bold">Your English Level</h2>
                <ReactApexChart type="radialBar" series={[score]} options={{chart: { height: 300 }, plotOptions: {radialBar: {hollow: { size: "70%" },dataLabels: {value: {fontSize: "32px", formatter: () => Level}}}}, labels: ["Seu nivel"]}} height={300}/>
                <p className="text-lg font-medium">
                    {menssage}
                </p>
                <Link to={LocationTest}>Proximo</Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default WritingLevelTest;