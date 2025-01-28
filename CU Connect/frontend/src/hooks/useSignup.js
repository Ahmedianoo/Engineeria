import { useState } from "react";
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [error , setError] = useState(null)
    const [isLoading , setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    const signup = async (Name , Email , Password , UserType , OTP) => {
        
        setIsLoading(true)
        setError(null)

        if (!Email.endsWith("@eng-st.cu.edu.eg") && !Email.endsWith("@cu.edu.eg")) {
            setError("Invalid email. Please use your university email.");
            setIsLoading(false);
            throw error;
        }
        if(Email.endsWith("@eng-st.cu.edu.eg")){
            UserType = "student"
        }
        else if(Email.endsWith("@cu.edu.eg")){
            UserType = "teacher"
        }

        const response = await fetch("/api/auth/signup" , {
            method : "POST",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({Name , Email , Password , UserType , OTP})
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
    return {signup , isLoading , error}
}