import { createContext, useState } from "react"
import type { ReactNode } from "react";

type ToolItem = {
  id: string;
  phase: number | null; // 1,2,3,4
};

export const contextsTypeInit= createContext<any>({
    datacadres: {},
    listLocation: {},
    information: [],
    saveListLocation: ()=>{},
    Savedatacadres: ()=>{},
    setInformation: ()=>{}
})

export const ContextGeral= ({ children }: { children: ReactNode })=>{
    const [datacadres, setdatacadres]= useState<any>({})//armazenar estado do seletor
    const [listLocation, setListLocation]= useState<any> ({})
    const [information, setInformation]= useState<any> ([])
    //decide qual edpoint esta sendo armazenado dependendo do component
    const Savedatacadres= (data: any)=>{

        console.log("dados chamados: ", data)
        setdatacadres(data)
    }

    const saveListLocation= (data: any)=>{
        console.log("chegou dado: ", data)
        setListLocation(data)
    }

    const saveInformation= (data: any [])=>{
        console.log("chegou dado: ", data)
        setInformation(data)
    }

    return(
        <contextsTypeInit.Provider value={{datacadres, Savedatacadres, listLocation, saveListLocation, saveInformation, information}}>
            {children}
        </contextsTypeInit.Provider>
    )
}

export default contextsTypeInit