import ApexChartHabilit from "./grafic/graphicHabilit"
import ProgressChart from "./grafic/graphicProgress"
import { useUser, useAuth } from "@clerk/clerk-react";
import { GetList } from "../../functions/getlist"
import { useEffect, useContext } from "react"
import contextsTypeInit from "../../hook/hook";
import loadingBalls from "../../assets/Untitled file.gif"

const Home= ()=>{
    const {information}= useContext(contextsTypeInit)
    
    if(information.length > 0){
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
                        {information.map((element: any)=>(
                            <li className="boder-[#CFCFCF] border-b-[1px]">
                                {element}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
   }else{
      return (
      <div className='gap-3 flex flex-col w-full h-160 items-center justify-center'>
        <div className='w-max flex flex-col items-center justify-center'>
           <img className='w-20' src={loadingBalls} />
           <p className="font-bold">Estou verificando sua situação. Só um minuto...</p>
        </div>
      </div>
    )
  }
}

export default Home