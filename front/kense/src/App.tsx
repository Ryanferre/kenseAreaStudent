import './App.css'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Nav from './pages/nav/nav.tsx'
import axios from 'axios'
import loadingBalls from './assets/Untitled file.gif'
import { ContextGeral } from './hook/hook.tsx'

function App() {
  const location= useLocation()
  const getQuery= new URLSearchParams(location.search)
  const [auth, setauth]= useState(false)
  const [dataForCadres, setData]= useState<any>({})

  const dataCripto= getQuery.get("data")


  useEffect(()=>{
    const verifyAcess= async ()=>{
      const link: any = "http://localhost:5173/?user=user_3Aa9dvEwYArWYLO3E3vP8bLEWJM&list=reading,listening&className=Classe_A&classID=1&datecreate=15/03/2026/#3488bc406a40d119e01220354cdb396ec397ab4d7cf7470b4266d3b8442a2fe2"


      const urlObj: any = new URL(link);

      const hashData = urlObj.hash.slice(1);

      const userTeacher = urlObj.searchParams.get('user');
      const listString = urlObj.searchParams.get('list');
      const className = urlObj.searchParams.get('className')
      const classID = urlObj.searchParams.get('classID')

      if(userTeacher != null && listString != null){

        console.log("dados foram chamados: ")
        const datahash: any= {
                      hash: hashData,
                      dataURl:{
                              userData: userTeacher,
                              listeingData: listString,
                              className: className,
                              classID: classID
                              }
        }


          console.log("dados: ", datahash)

          const connect= await axios.post("http://localhost:4000/verifyacess", datahash)

          console.log("dados enviados: ", connect)

          if(connect.data.success){
            setauth(true)
            setData({teacherId: userTeacher, classID: classID, list: listString})
          }
     }else{
      console.log("dados foram chamados no else ", userTeacher, listString)
     }
    }
    
    verifyAcess()
  }, [])
  
  if(auth){
  return (
    <ContextGeral>
      <div className='mt-3 gap-3 flex flex-row'>
        <Nav data={dataForCadres} />
        <Outlet />
      </div>
    </ContextGeral>
    )
    }else{
      return (
      <div className='gap-3 flex flex-col w-full h-200 items-center justify-center'>
        <div className='w-max flex flex-col items-center justify-center'>
           <img className='w-20' src={loadingBalls} />
           <p className="font-bold">Estamos validando o seu convite. Só um minuto...</p>
        </div>
      </div>
    )
  }
}

export default App