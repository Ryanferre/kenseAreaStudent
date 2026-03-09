import { SignInButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const User= ()=>{
    const { user, isLoaded, isSignedIn } = useUser();
    const [isLoad, setLoad]= useState(false)
    const [dataUser, setData]= useState<any []>(['', '', '', '', ''])
    useEffect(()=>{
        if(isLoaded){
          setLoad(true)
        }else{
          setLoad(false)
        }
    }, [])

    useEffect(()=>{
        if(isLoad){
            const datafromUser= [ user?.fullName, user?.primaryEmailAddress?.emailAddress, user?.imageUrl]
            setData(datafromUser)
        }
    }, [isLoad])
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