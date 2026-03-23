import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import contextsTypeInit from "../../../hook/hook";

const User= ({data}: any)=>{
    const { getToken } = useAuth();
    const { user, isLoaded, isSignedIn } = useUser();
    const [isLoad, setLoad]= useState(false)
    const [dataUser, setData]= useState<any []>(['', '', '', '', ''])
    const {datacadres, saveInformation}= useContext(contextsTypeInit)
    const [tokenUser, setToken]= useState<string | null>('')
    useEffect(()=>{
        const getTokenUser: any= async ()=>{return await getToken()}
        setToken(getTokenUser)
        console.log("dados de data: ", data)
        if(isLoaded){
          setLoad(true)
        }else{
          setLoad(false)
        }
    }, [])

    async function GetList(idUser: string | undefined){
                    const dataCreateStudent: any= {
                                            studentIdreq: idUser, 
                        }

                        if(idUser == undefined){
                            return
                        }
    
                        const connect= await axios.post("http://localhost:4000/getlistteste", dataCreateStudent, {
                            headers: {
                                Authorization: `Bearer ${tokenUser}`, // ⚡ envia o token
                            },
                        })
                    const list= connect.data.userlist.listTest.map((element: any)=> {
                        let decidPath= ''
                        switch (element) {
                                    case "reading":
                                        decidPath= "/reading"
                                        break;
                                    case "speaking":
                                        decidPath= "/speaking"
                                        break;
                                    case "writing":
                                        decidPath= "/Writing"
                                        break;
                                    case "listening":
                                        decidPath= "/listening"
                                        break;
                                    default:
                                        break;
                        }
                        return {element: element, path: decidPath}
                    })

                //verificar o status da lista
                if(connect.data.userlist.status == "IN_PROGRESS"){
                    console.log("IN_PROGRESS")
                    saveInformation(["Teste de identificação de nível disponivel. clique em 'Identificar nivel'"])
                }

                localStorage.setItem('data_CERF', JSON.stringify(list));

            if(list.length > 0){
                return true
            }else{
                return false
            }
    }

    useEffect(()=>{

        console.log(datacadres)
        const initHome= async ()=>{
                if(isLoad){
                    const datafromUser= [ user?.fullName, user?.primaryEmailAddress?.emailAddress, user?.imageUrl]
                    setData(datafromUser)

                    //função para verificar se tem alguma lista formada


                    const createStudent: any= async ()=>{
                        const token = tokenUser;
                        if(user?.id !== undefined && user?.fullName !== undefined && data !== undefined && token != undefined){
                            const dataCreateStudent: any= {
                                            
                                                    userID: user?.id,
                                                    nameUser: user?.fullName,
                                                    idTeacher: data.teacherId,
                                                    idClass: data.classID
                                                    
                                }

                                const connect= await axios.post("http://localhost:4000/savedatastudent", dataCreateStudent, {
                                headers: {
                                    Authorization: `Bearer ${token}`, // ⚡ envia o token
                                },
                                })

                            return connect.data.information
                        }
                    }
                    createStudent()

                    const acdresList: any= async ()=>{
                        const token = tokenUser;
                        if(data.teacherId == undefined && data.list == undefined && token == undefined){
                            return
                        }
                        const dataCreateStudent: any= {
                                        
                                                teacherId: data.teacherId,
                                                studentIdreq: user?.id,
                                                mode: "SYSTEM",
                                                status: "IN_PROGRESS",
                                                listTest: data.list
                                                
                            }

                            const connect= await axios.post("http://localhost:4000/savelistteste", dataCreateStudent, {
                            headers: {
                                Authorization: `Bearer ${token}`, // ⚡ envia o token
                            },
                            })
                    }

                    if(createStudent){
                        //usuario sempre vai entrar pelo linkin que foi lhe enviado, se não for undefined(existe lista)
                        if(data.list !== undefined){
                            //pegue a lista
                            const connectgetListy: any = await GetList(user?.id)
                            console.log("dados do array: ", connectgetListy)
                            //se retornar true significa que a lista não existe no sistema
                            if(connectgetListy){
                                //cadastre ela
                                acdresList()
                            }
                        }
                    }
                }
            }

            initHome()
    }, [isLoad, datacadres, tokenUser])


    return(
        <section className="flex flex-row mx-auto items-center rounded-lg bg-white rounded-lg border-[1px] border-[#ededf2] cursor-pointer w-60 h-12">
            <div className="flex flex-row items-center gap-3 px-1">
                <div className="relative w-8 h-8">
                    <img src={dataUser[2]} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />

                    {/* Indicador online */}
                    <span className="absolute bottom-0 rigth-0 w-2.5 h-2.5 bg-green-500 rounded-[100%] border-[1px] border-white" style={{right: '0%'}}/>
                    </div>
                <ul>
                <li>
                    <p>{dataUser[0]}</p>
                </li>
                <li>
                    <p className="text-[.7em]">{isLoaded ? "Online": ''}</p>
                </li>
            </ul>
            </div>
        </section>
    )
}

export default User