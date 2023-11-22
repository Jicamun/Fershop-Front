import {useState} from 'react'
import { useSignup } from '../hooks/useSignup'
import { Link } from 'react-router-dom'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [pin, setPin] = useState('')
    const {signup, isLoading, error} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password, pin)
    }

    const handleInputChange = (e) => {
        const input = e.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito
        setPin(input);
    };


    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>

            <label>Email:</label>
            <input 
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password:</label>
            <input 
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <label>Pin:</label>
            <input 
                type="password"
                pattern='[0-9]*'
                onChange={handleInputChange}
                value={pin}
            />

            <button disabled={isLoading}>Sign up</button> <Link to="/login"><a>Already have an Account?</a></Link>
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default Signup