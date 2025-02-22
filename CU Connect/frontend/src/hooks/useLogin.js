import { useState } from "react";
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    const login = async (Email , Password ) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/auth/login" , {
            method : "POST",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({Email , Password })
        })
        const json = await response.json();
        if(!response.ok){
            setIsLoading(false);
            setError(json.error)
            console.log(json.error)
            throw json.error;
            
        }
        else if(response.ok){
            localStorage.setItem("user" , JSON.stringify(json))
            dispatch({type : 'LOGIN' , payload : json})
            setIsLoading(false)
        }
    }
    return {login , isLoading , error}
}