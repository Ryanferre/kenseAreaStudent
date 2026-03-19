import { useEffect, useState } from "react";
import loadingBalls from "../../../assets/Untitled file.gif"

export const NextPath= (data: any)=>{
    const [LocationTest, setLocation]= useState('')
    useEffect(()=>{
        const data_CRO: any = localStorage.getItem('data_CERF');

            const inJson: any = JSON.parse(data_CRO)
    
            //pega o primeiro item com status false
            const Finditem = inJson.list.findIndex((item: any) => item.status === false);
    
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
        setTimeout(()=>{

        }, 40000)
    }, [data])
    return(
        <div className='gap-3 flex flex-col w-full h-200 items-center justify-center'>
        <div className='w-max flex flex-col items-center justify-center'>
           <img className='w-20' src={loadingBalls} />
           <p className="font-bold">Estamos validando o seu convite. Só um minuto...</p>
        </div>
      </div>
    )
}