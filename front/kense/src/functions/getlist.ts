import axios from "axios";

export async function GetList(token: string | null, idUser: string | undefined){
                const dataCreateStudent: any= {
                                        studentIdreq: idUser, 
                    }

                    const connect= await axios.post("http://localhost:4000/getlistteste", dataCreateStudent, {
                        headers: {
                            Authorization: `Bearer ${token}`, // ⚡ envia o token
                        },
                    })

                console.log("resultado da verificação de lista: ", connect)
                const list: any= {
                       list: connect.data.userlist.listTest.map((element: any)=> {return {element: element, status: false}}),
                       recentmodifield: '',
                       status: connect.data.userlist.status
                }

                localStorage.setItem('data_CERF', list);

                if(typeof connect.data.userlist.listTest === typeof Array){
                    return list
                }
            }