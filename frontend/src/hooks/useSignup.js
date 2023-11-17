import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
const baseUrl = process.env.REACT_APP_API_URL || '';

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, pin) => {

        setIsLoading(true)
        setError(null)

        const response = await fetch( baseUrl + '/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, pin})
        })

        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            // Save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // Update the Auth Context
            dispatch({type: 'LOGIN', payload: json})

            // Update loading state
            setIsLoading(false)
        }

    }
    
    return {signup, isLoading, error}

}