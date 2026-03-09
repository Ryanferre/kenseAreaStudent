import './App.css'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useEffectEvent } from 'react'
import Nav from './pages/nav/nav.tsx'

function App() {
  const location= useLocation()
  const getQuery= new URLSearchParams(location.search)

  const dataCripto= getQuery.get("data")


  useEffect(()=>{
    console.log("dados na url: ", window.location.hash)
  }, [])
  
  return (
    <div className='mt-3 gap-3 flex flex-row'>
      <Nav />
      <Outlet />
    </div>
  )
}

export default App