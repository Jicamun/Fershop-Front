import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const baseUrl = process.env.REACT_APP_API_URL || '';

    const login = async (email, password) => {
        try{

            setIsLoading(true)
            setError(null)

            const response = await fetch( baseUrl +'/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            })

            const json = await response.json()

            if(!response.ok){
                setIsLoading(false)
                setError(json.error)
            }
            if(response.ok){
                
                const { ['pin']: removedProperty, ...newJson } = json

                // Update the Auth Context
                dispatch({type: 'LOGIN', payload: newJson})                
                
                // Save the user to local storage
                localStorage.setItem('user', JSON.stringify(newJson))               

                // Update loading state
                setIsLoading(false)
            }

        } catch(error) {
            console.log(error.message)
        }

        

    }
    
    return {login, isLoading, error}

}