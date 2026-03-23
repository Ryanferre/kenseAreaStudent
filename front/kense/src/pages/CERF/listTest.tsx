import foxKense from "../../assets/—Pngtree—fox little fox animal pet_14115929.png"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

const Aplytest= ()=>{
    const [LocationTest, setLocation]= useState('')
    const location = useLocation();
    const rampa = location.pathname.substring(1)

    useEffect(()=>{

            const data_CRO: any = localStorage.getItem('data_CERF');

            const inJson: any = JSON.parse(data_CRO)

            let Finditem = inJson.findIndex((item: any) => item.element === rampa);

            setLocation(inJson[Finditem+1].path)
            }, [])

    return(
        <section className="bg-blue-100 flex flex-col h-175 px-8 py-2 w-310 rounded-lg">
            <div className="h-max w-full gap-8 overflow-scroll">
                <div className="w-max h-140 flex flex-row">
                    <img className="w-15 h-15" src={foxKense} />
                    <div className="w-120 flex flex-col mt-5 gap-[1.1em] px-7 py-4 rounded-lg h-max bg-[#ededf2]">
                        <h1 className="font-bold text-xl">Como eu aplico os testes</h1>
                        <p>Aplico testes baseados no CEFR, usando ferramentas específicas para cada habilidade e tecnologia em nuvem (AWS).</p>
                        <p>O teste e aplicado com base na ordem de ferramentas selecionada pelo seu professor</p>
                        <p>Ao final, voce recebera um feedback com base nas resposta e o professor recebera um relatorio</p>
                        <p>O que sera coletado:</p>
                        <ul>
                            <li>o resultado do aluno,</li>
                            <li>as questões com respostas,</li>
                            <li>e os áudios do teste de speaking.</li>
                        </ul>
                        <p>A sua "area do aluno" sera baseada no resultado do teste</p>
                        <p>O teste nao serve so para identificar o seu nivel, mas tambem para ajudar o professor responsavel
                           a se preparar e lhe ajudar da melhor forma a alcancar a sua fluencia
                        </p>
                    </div>
                </div>
                <div className="w-max h-max flex flex-row">
                    <img className="w-15 h-15" src={foxKense} />
                    <div className="w-120 flex flex-col mt-5 gap-6 px-7 py-4 rounded-lg h-max bg-[#ededf2]">
                        <p>Quando estiver pronto, clique em "Começar"</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-end">
                <Link to={LocationTest}>
                <button className="w-max px-6 py-3 text-white rounded-lg hover:cursor-pointer bg-gradient-to-r from-sky-300 to-blue-900 hover:brightness-110 transition">
                    Começar
                </button>
                </Link>
            </div>
        </section>
    )
}

export default Aplytest