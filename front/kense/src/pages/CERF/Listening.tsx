import { useCallback, useEffect, useRef, useState } from "react";
import "video.js/dist/video-js.css";
import videojs from "video.js"
import type { Level } from "./reading";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import contextsTypeInit from "../../hook/hook";
import { useContext } from "react";
import foxKense from "../../assets/—Pngtree—fox little fox animal pet_14115929.png"

const ListeningTest= ()=>{
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<any | null>(null);
    const scoreCalc= useRef<any>({ A1: 0,
                                   A2: 0,
                                   B1: 0,
                                   B2: 0,
                                   C1: 0,
                                   C2: 0
                                    })
    let MathNivel= useRef<any>({Nivel: '', correct: 0})
    const [videoInit, setInit]= useState(false)//da start para colocar a url principal no player
    const [question, setQuestion]= useState< any []>([])
    const [Aswer, setAswer]= useState<{ [key: number]: string }>({})
    const [isPause, setPause]= useState(true)
    const [display, setDisplay]= useState< any []>(["", "20", "20", "none"])//posição, largura, altura e display
    const [selected, setSelected] = useState<{ [key: number]: string } | null>({});
    const [ultiQuestion, setQuestionUlti]= useState(0)
    const [findOurContinue, setRespost]= useState("Continue")
    const [finalLevel, setFinalLevel] = useState<Level>("A1")
    const [progress, setProgress] = useState<number | null>(null)
    const [theFind, setFind]= useState(false)
    const [LocationTest, setLocation]= useState('')
    const [explanation, setExplanation]= useState<boolean>(true)

    const startedQuestion = useRef<any | null>(false);
    useEffect(()=>{
        const data_CRO: any = localStorage.getItem('data_CERF');

        const inJson: any = JSON.parse(data_CRO)

        setLocation(inJson[0].path)
        setInit(true)

        console.log("chamou setInit")
    }, [])

    function pauseVideo(Midia: any){
        if(isPause){
            const current = Midia.currentTime();
                const duration = Midia.duration();
                if(current && duration){
                    const fixedPorcent= current.toFixed(0)
                    console.log("Progresso %:", fixedPorcent, current, startedQuestion);
                    if(startedQuestion.current == false){
                        switch (fixedPorcent) {
                            case "20":
                                setPause(false)
                                setQuestionUlti(1)
                                Midia.pause()
                                setDisplay(["absolute", "20", "20", "flex"])
                                setQuestion([{QuestionData: "Where does Emma work?", Next: true, NumberQuestion: "1", correct: "", poss: ['A) In a school', 'B) In a shop', 'C) In a hospital', 'D) In an office']}, {QuestionData: "How does she go to work?", Next: false, NumberQuestion: "2", poss: ['A) By bus', 'B) By car', 'C) By bike', 'D) On foot']}])
                                
                                console.log("dados atual: ", playerRef.current)
                                playerRef.current.src({
                                    src: "/PrimerVideo.mp4",
                                    type: "video/mp4",
                                });
                                startedQuestion.current= true
                                break;
                            case "41":
                                setPause(false)
                                Midia.pause()
                                setQuestionUlti(2)
                                setDisplay(["absolute", "20", "20", "flex"])
                                setQuestion([{QuestionData: "Why did Emma go to the park?", Next: true, NumberQuestion: "3", correct: "", poss: ['A) Because she had work', 'B) Because it was raining', 'C) Because the weather was sunny', 'D) Because the café was closed']}, {QuestionData: "Why did they go to the café?", Next: false, NumberQuestion: "4", poss: ['A) They were hungry', 'B) It started to rain', 'C) The park closed', 'D) They met new friends']}])
                                playerRef.current.src({
                                    src: "/SecondVideo.mp4",
                                    type: "video/mp4",
                                });
                                startedQuestion.current= true
                                break;
                            case "65":
                                setPause(false)
                                Midia.pause()
                                setQuestionUlti(3)
                                setDisplay(["absolute", "20", "20", "flex"])
                                setQuestion([{QuestionData: "Why was Emma nervous at first?", Next: true, NumberQuestion: "5", correct: "", poss: ['A) She didn’t like her colleagues', 'B) She had never worked in customer service', 'C) The shop was too far', 'D) The salary was low']}, {QuestionData: "What helps her manage stress at work?", Next: false, NumberQuestion: "6", poss: ['A) Working alone', 'B) Ignoring customers', 'C) Support from her manager and colleagues', 'D) Short working hours']}])
                                playerRef.current.src({
                                    src: "/TerciVideo.mp4",
                                    type: "video/mp4",
                                });
                                startedQuestion.current= true
                                break;
                            case "99" :
                                setPause(false)
                                Midia.pause()
                                setQuestionUlti(4)
                                setDisplay(["absolute", "20", "20", "flex"])
                                setQuestion([{QuestionData: "What changed Emma’s view about rude customers?", Next: true, NumberQuestion: "7", correct: "", poss: ['A) She became stricter', 'B) She thinks they are always wrong', 'C) She realized they may be stressed', 'D) She avoids talking to them']}, {QuestionData: "According to Emma, what helps resolve conflicts?", Next: false, NumberQuestion: "8", poss: ['A) Proving you are right', 'B) Staying calm', 'C) Raising your voice', 'D) Short working hours']}])
                                playerRef.current.src({
                                    src: "/TerciVideo.mp4",
                                    type: "video/mp4",
                                });
                                startedQuestion.current= true
                                break;
                            case "138":
                                setPause(false)
                                Midia.pause()
                                setQuestionUlti(5)
                                setDisplay(["absolute", "20", "20", "flex"])
                                setQuestion([{QuestionData: "What does “take it with a grain of salt” mean here?", Next: true, NumberQuestion: "9", correct: "", poss: ['A) Respond angrily', 'B) Ignore completely', 'C) Not take something too seriously', 'D) Believe everything']}, {QuestionData: "What is often the real reason behind complaints?", Next: false, NumberQuestion: "10", poss: ['A) Product damage', 'B) Wanting attention and acknowledgment', 'C) High prices', 'D) Long waiting times']}])
                                playerRef.current.src({
                                    src: "/QuartVideo.mp4",
                                    type: "video/mp4",
                                });
                                startedQuestion.current= true
                                break;
                            case "186":
                                setPause(false)
                                Midia.pause()
                                setQuestionUlti(6)
                                setDisplay(["absolute", "20", "20", "flex"])
                                setQuestion([{QuestionData: "According to Emma, why do people defend their beliefs strongly?", Next: true, NumberQuestion: "11", correct: "", poss: ['A) They enjoy conflict', 'B) Their beliefs define their identity', 'C) They always have evidence', 'D) They want attention']}, {QuestionData: "What does Emma suggest could improve discussions?", Next: false, NumberQuestion: "12", poss: ['A) Speaking louder', 'B) Avoiding disagreements', 'C) Intellectual humility', 'D) Ignoring opinions']}])
                                playerRef.current.src({
                                    src: "/TheEnd.mp4",
                                    type: "video/mp4",
                                });
                                startedQuestion.current= true
                                setRespost("Finalizar teste")
                                break
                            default:
                                break;
                        }
                    }
                }
        }
    }

const videoRefCallback = useCallback((node: HTMLVideoElement | null) => {
    if (node) {
        // Usa timeout de 0ms para "empurrar" a execução para o próximo ciclo do navegador
        // garante que o 'node' já esteja devidamente inserido no DOM
        setTimeout(() => {
            if (!playerRef.current && node) {
                
                const player = videojs(node, {
                    autoplay: false,
                    controls: true,
                    responsive: true,
                    fluid: true,
                    sources: [{
                        src: "/PrincipalVideo.mp4",
                        type: "video/mp4",
                    }],
                });

                player.on("timeupdate", () => {
                    // sua função de pausa por nível
                    pauseVideo(player);
                });

                playerRef.current = player;
            }
        }, 0);
    } else {
        if (playerRef.current) {
            playerRef.current.dispose();
            playerRef.current = null;
            console.log("Player destruído com sucesso");
        }
    }
}, []);




    useEffect(()=>{

        if(selected != null){
            setAswer((prev: any)=> ({...prev, ...selected}))
        }
    }, [selected])

    //adiciona o objeto de resposta
    function answer(option: string, numberQuestion: number) {
        setSelected((prev) => ({
            ...prev,
            [numberQuestion]: option
        }));

        setPause(true);
    }

    //retorna ao video
    function returnVideo(){
        setDisplay(["", "20", "20", "none"])
        startedQuestion.current= false
        playerRef.current.src({
                                src: "/PrincipalVideo.mp4",
                                type: "video/mp4",
                            });
        switch (ultiQuestion) {
            //bloco 1
            case 1:
                if(!Aswer["1"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["1"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["1"] === "B) In a shop"){
                        scoreCalc.current.A1++
                    }
                }

                if(!Aswer["2"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["2"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["2"] === "D) On foot"){
                        scoreCalc.current.A1++
                    }
                }
                playerRef.current.currentTime(21.272606)
                break;

            //bloco 2
            case 2:
                if(!Aswer["3"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["3"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["3"] === "C) Because the weather was sunny"){
                        scoreCalc.current.A2++
                    }
                }

                if(!Aswer["4"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["4"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["4"] === "B) It started to rain"){
                        scoreCalc.current.A2++
                    }
                }
                playerRef.current.currentTime(42.272608)
                break;


            //bloco 3
            case 3:
                if(!Aswer["5"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["5"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["5"] === "B) She had never worked in customer service"){
                        scoreCalc.current.B1++
                    }
                }
                
                if(!Aswer["6"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["6"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["6"] === "C) Support from her manager and colleagues"){
                        scoreCalc.current.B1++
                    }
                }
                playerRef.current.currentTime(66.272608)
                break;

            //bloco 4
            case 4:
                if(!Aswer["7"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["7"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["7"] === "C) She realized they may be stressed"){
                        scoreCalc.current.B2++
                    }
                }

                if(!Aswer["8"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["8"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["8"] === "B) Staying calm"){
                        scoreCalc.current.B2++
                    }
                }
                playerRef.current.currentTime(100.272608)
                break;
            
            //bloco 5
            case 5:
                if(!Aswer["9"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["9"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["9"] === "C) Not take something too seriously"){
                        scoreCalc.current.C1++
                    }
                }

                if(!Aswer["10"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["10"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["10"] === "B) Wanting attention and acknowledgment"){
                        scoreCalc.current.C1++
                    }
                }
                playerRef.current.currentTime(139.272608)
                break;

            //bloco 6
            case 6:
                if(!Aswer["11"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["11"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["11"] === "B) Their beliefs define their identity"){
                        scoreCalc.current.C2++
                    }
                }

                if(!Aswer["12"]){
                    setSelected((prev) => ({
                        ...prev,
                        ["12"]: "Usuario prefiriu deixar essa questão em branco"
                    }));
                }else{
                    if(Aswer["12"] === "C) Intellectual humility"){
                        scoreCalc.current.C2++
                    }
                }
                TheEndTest()
                break;
            default:
                break;
        }
    }

    //finalizar teste
    function TheEndTest(){
            MathNivel.current.Nivel= scoreCalc.current.A1
            for(let i in scoreCalc.current){
                if(scoreCalc.current[i] >= MathNivel.current.correct){
                    MathNivel.current.Nivel= i
                    MathNivel.current.correct= scoreCalc.current[i]
                }
            }

            console.log("Progress: ", scoreCalc.current)
            setProgress(Math.round((MathNivel.current.correct / 2) * 100))
            setFinalLevel(MathNivel.current.Nivel)
    }

    useEffect(()=>{
        if(Aswer["1"]){
            setFind(true)
        }
    }, [progress])

    useEffect(()=>{
        const Context= `Block 1 – A1

                            Speaker 1 (Emma):
                            Hi. My name is Emma. I am twenty years old. I live in a small apartment in the city.

                            Every morning, I wake up at seven o’clock. I drink coffee and eat bread with butter.

                            I work in a shop. I walk to work. It takes ten minutes.

                            In the evening, I watch TV or read a book. I go to bed at ten.

                            I like my life. It is simple, but I am happy.

                            🔹 Block 2 – A2

                            Speaker 1 (Emma):
                            On weekends, my routine is different. I don’t wake up early because I don’t have work.

                            Last Saturday, I met my friend Anna. We went to the park because the weather was sunny. We had sandwiches and talked for hours.

                            Later, it started to rain, so we went to a café near the park. The café was busy, but we found a table by the window.

                            I like weekends because I can relax and spend time with my friends.

                            🔹 Block 3 – B1

                            Speaker 2 (Daniel):
                            Emma, how’s your new job going?

                            Speaker 1 (Emma):
                            It’s going well, actually. At first, I was nervous because I had never worked in customer service before.

                            Daniel:
                            I can imagine. Is it stressful?

                            Emma:
                            Sometimes. When the shop gets crowded, people become impatient. But my manager is supportive, and my colleagues help me when I need it.

                            Daniel:
                            That makes a big difference.

                            Emma:
                            Yes. I’m learning how to communicate better, especially when customers complain. It’s challenging, but I think it’s helping me grow.

                            🔹 Block 4 – B2

                            Daniel:
                            Do you think working in customer service changes how you see people?

                            Emma:
                            Definitely. Before, I used to think that rude customers were just bad people. However, now I realize that many of them are simply stressed or having a difficult day.

                            Daniel:
                            That’s true, although some people are rude no matter what.

                            Emma:
                            I agree to some extent. Still, I believe it’s important not to take things personally. If I react emotionally, the situation usually gets worse. On the other hand, if I stay calm, most conflicts can be resolved quickly.

                            Daniel:
                            So you think emotional control is more important than being right?

                            Emma:
                            In many cases, yes. Winning an argument isn’t always worth losing a customer.

                            🔹 Block 5 – C1

                            Daniel:
                            You sound more confident than before.

                            Emma:
                            I suppose I’ve had to toughen up. At the beginning, every negative comment felt like a personal attack. Now, I take it with a grain of salt.

                            Daniel:
                            That’s a useful skill.

                            Emma:
                            It is. I’ve also realized that perception is everything. Two people can experience the same situation and walk away with completely different interpretations.

                            Sometimes, when a customer complains loudly, it’s not really about the product. It’s about wanting to be heard. Once they feel acknowledged, the tension usually melts away.

                            Daniel:
                            So it’s less about the problem itself and more about validation?

                            Emma:
                            Exactly. If you read between the lines, most conflicts are about unmet expectations rather than real damage.

                            🔹 Block 6 – C2

                            Daniel:
                            Do you think this applies beyond customer service?

                            Emma:
                            Absolutely. If you look at society as a whole, many disagreements aren’t rooted in facts but in identity. People defend their beliefs because those beliefs define who they are.

                            Daniel:
                            So when someone challenges an opinion, it feels like a personal attack?

                            Emma:
                            Precisely. And that’s where communication breaks down. We assume the other person is irrational, yet rarely question our own assumptions.

                            What’s fascinating is that certainty often masks insecurity. The louder someone argues, the more fragile their position may be.

                            If we approached discussions with intellectual humility instead of the need to win, perhaps we would discover that disagreement doesn’t have to mean division.

                            Daniel:
                            That’s a hopeful perspective.

                            Emma:
                            Maybe. Or maybe it’s just an ideal. But without ideals, we stop trying to improve the way we relate to one another.`


        const ObjectToResponse= {
            Context: Context,
            Answer: Aswer
        }
        localStorage.setItem("listeningResponse", JSON.stringify(ObjectToResponse))
    }, [theFind])

    return(
        <section className="bg-blue-100 flex flex-col items-center py-5 gap-4 h-175 w-full rounded-lg">
        {explanation === true ? 
            <div className="flex flex-col py-4 gap-4 h-140">
                <div className="w-max h-max flex flex-row">
                    <img className="w-15 h-15" src={foxKense} />
                        <div className="w-130 flex flex-col gap-3 px-7 py-4 rounded-lg h-max bg-[#ededf2]">
                            <h1 className="font-bold text-2xl mb-4">🎧 Como funciona o teste de Listening</h1>
                            <p className="mb-2">Você assistirá a um vídeo sem legendas para identificarmos seu nível real de compreensão auditiva.</p>
                            <p className="mb-4 text-gray-600 italic">Sem pressão 😌 — o objetivo é medir sua evolução natural.</p>

                            <h2 className="font-bold text-xl mb-2">🎬 Durante o teste</h2>
                            <ul className="space-y-2 mb-4">
                                <li>🔹 O vídeo será pausado automaticamente após cada nível (de <strong>A1 a C2</strong>).</li>
                                <li>🔹 Cada trecho possui duas perguntas de múltipla escolha baseada no que você acabou de ouvir.</li>
                                <li>🔹 Se precisar, você pode repetir o trecho específico antes de responder.</li>
                                <li>🔹 Não tem problema deixar questões em branco. Estamos aqui para lhe ajudar em suas dificuldades</li>
                            </ul>

                            <p className="font-medium">Nada de pegadinhas.</p>
                            <p>Responda com sinceridade e mantenha a calma. Good luck! 🚀</p>
                        </div>
                </div>
                <div className="flex flex-row justify-center">
                        <button onClick={()=> {setExplanation(false)}} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
                            Começar
                        </button>
                </div>
            </div> : 
        <>
        {theFind ?
            <div className="max-w-xl mx-auto p-6 space-y-6 text-center">
                <h2 className="text-2xl font-bold">Your English Level</h2>
                <ReactApexChart type="radialBar" series={[progress ? progress : 0]} options={{chart: { height: 300 }, plotOptions: {radialBar: {hollow: { size: "70%" },dataLabels: {value: {fontSize: "32px", formatter: () => finalLevel}}}}, labels: ["Seu nivel"]}} height={300}/>
                <p className="text-lg font-medium">
                    {progress && progress == 0 && "You're just starting — and that's awesome 🚀"}
                    {progress && progress == 50 && progress < 70 && "Nice progress! You're evolving fast 👏"}
                    {progress && progress == 100 && "Almost fluent! Keep pushing 💪🔥"}
                </p>
                <Link to={LocationTest}>
                    <button onClick={()=> {setInit(true)}} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
                        Teste de Writining
                    </button>
                </Link>
            </div>
            :
            <>
                <h1 className="text-[2em]">Assista o video com atenção!</h1>
                <div style={{position: display[0] != "" ? display[0] : '', left: display[0] != '' ? "20%" : ""}}>
                <div style={{width: `${display[1]}vmax`, height: `${display[3]}vmax`}} data-vjs-player>
                    {videoInit == true ? <video ref={videoRefCallback} className={`video-js vjs-big-play-centered`}/> : ''}
                </div>
                </div>
                <div style={{display: display[3] != '' ? display[3] : ''}} className="flex flex-col overflow-scroll h-full gap-4">
                {question.length > 0 ? question.map((Element: any)=> (<><div className="flex flex-col gap-5">
                    <p className="text-lg text-gray-500">{Element.QuestionData}</p>
                    <ul className="flex flex-col gap-3">{Element.poss.map((ElementOption: any)=>(<li onClick={()=> answer(ElementOption, Element.NumberQuestion)} className={`w-70 p-2 border rounded-lg text-left${selected && selected[Element.NumberQuestion] === ElementOption ? "bg-blue-500 text-white border-blue-500": "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}>{ElementOption}</li>))}</ul>
                    </div></>)) : ''}
                    <button onClick={()=> returnVideo()} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">{findOurContinue}</button>
                </div>
                 <div className="flex flex-row justify-end">
                        <button onClick={()=> {setExplanation(true)}} className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
                            Retornar a explicação
                        </button>
                </div>
            </>
         }
         </>
        }
        </section>
    )
}

export default ListeningTest