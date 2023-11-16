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
                    <div className='logo'>                                                
                        <h1>Fershop</h1>
                    </div>                
                </Link>
                <div id='mainNav'>
                    <nav className='options'>
                        {user && (
                            <div className='options'>
                            {workMode ? (
                                <>
                                <Link to="/workers">Workers</Link>
                                <Link to="/tasks">Tasks</Link>                        
                                </>
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

                    <nav className='user-options'>
                        {user && (
                            <div className='user-options'>
                                {workMode ? '' : (<Link to="/settings">Settings</Link>)}
                                <a>{user.email}</a>
                                {workMode ? (""): (
                                    <button onClick={handleClick}>Log out</button>
                                )}
                            </div>
                        )}
                        {!user && (
                            <div className='authentication'>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                            </div>
                        )}
                        {user && (
                            <div className='workmode' >                        
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
                
            </div>
        </header>
    )
}

export default Navbar