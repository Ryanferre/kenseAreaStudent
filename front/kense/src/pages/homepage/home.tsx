import ApexChartHabilit from "./grafic/graphicHabilit"
import ProgressChart from "./grafic/graphicProgress"
const Home= ()=>{
    return(
        <section className="w-full h-full py-10 px-10">
            <div className="flex flex-row w-full gap-30">
              <div className="w-160 h-50">
                <h1>Habilidades</h1>
                <ApexChartHabilit />
              </div>
              <div>
                <h2>Seu progresso</h2>
                <ProgressChart progress={76}/>
              </div>
            </div>
            <div className="my-5">
                <div className="flex flex-col gap-3">
                    <p>Caixa de Informacoes</p>
                    <ul className="flex flex-col gap-3 border-[#CFCFCF] border-[1px] rounded-lg w-118 h-60 px-8 py-4">
                        <li>
                            <p>1 atividade pendente</p>
                        </li>
                        <li>
                            <p>Exercicio da semana ainda em espera</p>
                        </li>
                        <li>
                            <p>Seu professor liberou uma nova atividade</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Home