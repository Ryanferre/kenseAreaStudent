
import User from "./Comp/user"
import IconHome from "./../../assets/uicons/svg/fi-rr-home.svg"
import IconDescrib from "./../../assets/uicons/svg/fi-rr-notes.svg"
import IconProgress from "./../../assets/uicons/svg/fi-rr-graphic-tablet.svg"
import FoxTense from "./../../assets/—Pngtree—fox little fox animal pet_14115929.png"
import { Link } from "react-router-dom"
import { useContext, useEffect } from "react"
import contextsTypeInit from "../../hook/hook"


const Nav= ({data}: any)=>{
    const StyleList= 'flex flex-row items-center bg-blue-300 rounded-lg hover:bg-white rounded-lg hover:border-[1px] hover:border-[#ededf2] hover:cursor-pointer w-60 h-12'
    const {saveInformation}= useContext(contextsTypeInit)
    useEffect(()=>{
        
    })
    return(
        <div className="flex flex-col">
         <User data={data} />
         <div className="w-max h-max">
             <ul className="flex flex-col p-3 gap-3 border-b-[3px] border-[#ededf2] w-full">
                <li className={StyleList}>
                    <Link className={StyleList} to={"/"}>
                        <img src={IconHome} alt="Home" className="w-10 h-6" />
                        <p>Home</p>
                    </Link>
                </li>
                
                <li>
                    <Link className={StyleList} to={"ia"}>
                        <img className="w-10" src={FoxTense} />
                        <p>Exercicio do dia</p>
                    </Link>
                </li>
                <li className={StyleList}>
                    <Link className={StyleList} to={"correcoes"}>
                        <img src={IconDescrib} alt="Home" className="w-10 h-6" />
                        <p>Atividades</p>
                    </Link>
                </li>
                <li className={StyleList}>
                    <Link className={StyleList} to={"aplytest"}>
                        <img src={IconProgress} alt="Home" className="w-10 h-6" />
                        <p>Identificar nivel</p>
                    </Link>
                </li>
            </ul>
         </div>
        </div>
    )
}

export default Nav