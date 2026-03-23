import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"
import foxKense from "../../assets/—Pngtree—fox little fox animal pet_14115929.png"
import { Link } from "react-router-dom"

export type Level = "A1" | "A2" | "B1" | "B2" | "C1"

type Question = {
  id: number
  level: Level
  text: string
  options: string[]
  correct: number,
  passage: string
}

const questions: Question[] = [
  {
    id: 1,
    level: "A1",
    passage:
      "This is Anna. She is a student. Anna studies English every day and enjoys learning new words.",
    text: "Choose the correct option: She ___ a student.",
    options: ["is", "are", "am", "be"],
    correct: 0,
  },
  {
    id: 2,
    level: "A2",
    passage:
      "Last summer, John traveled with his family. They visited different places, took many photos, and had a great time together.",
    text: "What is the main idea of the text?",
    options: [
      "A daily routine",
      "A job interview",
      "A vacation experience",
      "A school rule",
    ],
    correct: 2,
  },
  {
    id: 3,
    level: "B1",
    passage:
      "Maria decided to move to another city after she received an offer for a new job. The decision was difficult, but she believed it would help her grow professionally.",
    text: "Why did the author decide to move?",
    options: [
      "For a new job",
      "Because of family",
      "For health reasons",
      "For studies",
    ],
    correct: 0,
  },
  {
    id: 4,
    level: "B2",
    passage:
      "The project required extra effort and long hours of work. Even though it was challenging, the experience helped the team improve their skills.",
    text: "What can be inferred from the text?",
    options: [
      "He regrets the decision",
      "The change was challenging",
      "Nothing changed",
      "He plans to return",
    ],
    correct: 1,
  },
]

export default function ReadingLevelTest() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const [finalLevel, setFinalLevel] = useState<Level>("A1")
  const [progress, setProgress] = useState(0)
  const [initTest, setInit]= useState(false)
  const [LocationTest, setLocation]= useState('')
  const rampa = window.location.pathname

  useEffect(()=>{
  console.log("dado chamado")
            const data_CRO: any = localStorage.getItem('data_CERF');

            const inJson: any = JSON.parse(data_CRO)


            let Finditem = inJson.findIndex((item: any) => item.path == rampa);

            console.log("encontrando path: ", Finditem)
            console.log("dado no array: ", inJson)
            setLocation(inJson[Finditem+1].path)
  }, [rampa])

  useEffect(()=>{
    console.log("next Path: ", LocationTest)
  }, [LocationTest])

  const question = questions[current]

  function handleAnswer(index: number) {
    const copy = [...answers]
    copy[current] = index
    setAnswers(copy)
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      finishTest()
    }
  }

  function finishTest() {
    const score: Record<Level, number> = {
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
      C1: 0,
    }

    questions.forEach((q, i) => {
      if (answers[i] === q.correct) {
        score[q.level]++
      }
    })

    // lógica simples e segura (pedagógica)
    let level: Level = "A1"
    if (score.A2) level = "A2"
    if (score.B1) level = "B1"
    if (score.B2) level = "B2"
    if (score.C1) level = "C1"

    setFinalLevel(level)
    setProgress(Math.round((answers.filter((a, i) => a === questions[i].correct).length / questions.length) * 100))
    setFinished(true)
  }

  if(initTest){
  if (finished) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-6 text-center">
        <h2 className="text-2xl font-bold">Your English Level</h2>

        <ReactApexChart type="radialBar" series={[progress]} options={{chart: { height: 300 }, plotOptions: {radialBar: {hollow: { size: "70%" },dataLabels: {value: {fontSize: "32px", formatter: () => finalLevel}}}}, labels: ["Progress"]}} height={300}/>

        <p className="text-lg font-medium">
          {progress < 40 && "You're just starting — and that's awesome 🚀"}
          {progress >= 40 && progress < 70 && "Nice progress! You're evolving fast 👏"}
          {progress >= 70 && "Almost fluent! Keep pushing 💪🔥"}
        </p>
        <Link to={LocationTest}>
          <button onClick={()=> {setInit(true)}} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
            Teste de Speaking
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      
      {/* progresso */}
      <div className="text-sm text-gray-500">
        Question {current + 1} of {questions.length}
      </div>

      <div className="w-full bg-gray-200 h-2 rounded">
        <div className="bg-blue-600 h-2 rounded" style={{ width: `${((current + 1) / questions.length) * 100}%` }}/>
      </div>
      <p>{question.passage}</p>

      {/* pergunta */}
      <h2 className="text-lg font-semibold">{question.text}</h2>

      {/* opções */}
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className={`w-full p-3 border rounded-lg text-left ${answers[current] === i ? "border-blue-500 bg-blue-50" : "hover:bg-gray-100"} `}>
            {opt}
          </button>
        ))}
      </div>

      <button onClick={next} disabled={answers[current] === undefined} className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50">
        {current === questions.length - 1 ? "Finish test" : "Next"}
      </button>

      <button onClick={()=> {setInit(false)}} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
        Retornar a explicacao
    </button>
    </div>
  )
  }else{
    return(
        <div className="flex flex-col py-13 h-170">
            <div className="w-max h-140 flex flex-row">
                <img className="w-15 h-15" src={foxKense} />
                    <div className="w-120 flex flex-col mt-5 gap-8 px-7 py-4 rounded-lg h-max bg-[#ededf2]">
                        <h1 className="font-bold text-xl">📘 Como funciona o teste de Reading</h1>
                        <p>As perguntas começam fáceis e vão ficando mais desafiadoras.</p>
                        <p>Sem pressão 😌 — é só mostrar o que você já sabe.</p>
                        <h2 className="font-bold text-xl">⏱️ Durante o teste</h2>
                        <ul>
                            <li>* Uma pergunta por tela</li>
                            <li>* Você avança só depois de responder</li>
                            <li>* As questões avaliam como você entende textos em inglês</li>
                        </ul>
                        <p>Nada de pegadinha.</p>
                        <p>Lembre-se: Responda com sinceridade, nao precisa ficar com medo ou ancioso</p>
                     </div>
            </div>
            <div className="flex flex-row justify-end">
                    <button onClick={()=> {setInit(true)}} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
                        Começar
                    </button>
            </div>
        </div>
    )
  }
}