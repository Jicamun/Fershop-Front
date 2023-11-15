import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'


const Navbar = ({ workMode, enableWorkMode }) => {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }

    return (
        <header>
            <div className="container">
                <Link to="/">
                <h1>Fershop Rallys</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                        {workMode ? (
                            <p>Work Mode Enabled</p>
                        ) : (
                            <>
                            <Link to="/workers">Workers</Link>
                            <Link to="/tasks">Tasks</Link>
                            <Link to="/monitor">Monitor</Link>
                            </>
                        )}
                        </div>
                    )}
                </nav>

                <nav>
                    {user && (
                        <div>
                        <span>{user.email}</span>
                        {workMode ? (""): (
                            <button onClick={handleClick}>Log out</button>
                        )}
                        </div>
                    )}
                    {!user && (
                        <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                        </div>
                    )}
                    {user && (
                        <div>
                        {workMode ? '' : (<Link to="/settings">Settings</Link>)}
                        {workMode ? (
                            <button onClick={() => enableWorkMode(prompt('Ingrese PIN:'))}>
                            Disable Work Mode
                            </button>
                        ) : (
                            <button onClick={() => enableWorkMode(prompt('Ingrese PIN:'))}>
                            Enable Work Mode
                            </button>
                        )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar