// Navbar.js
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = ({ workMode, enableWorkMode, onClick }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogoutClick = () => {
    logout();
  };

  const handleEnableWorkMode = () => {
    const enteredPin = prompt("Ingrese PIN:");
    if (enteredPin) {
        const pinAsNumber = parseInt(enteredPin, 10); // Convert to number
        console.log("handleEnableWorkMode: " + pinAsNumber)
        enableWorkMode(pinAsNumber);
    }
  };

  const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
	};

  const handleKeyPress = (event) => {
        
    if (event.key === 'Enter' || event.key === ' ') {
        // Llama a la función de clic cuando se presiona Enter o Espacio
        onClick(showNavbar);
    }
};

  return (
    <header>
      <Link to="/"> <a> <h3>Fershop</h3> </a> </Link>
      <nav ref={navRef}>
        <div className="nav-elements">
          { workMode ? (  
              <>
                <a onClick={showNavbar}> <Link to="/workers">Workers</Link> </a>
                <a onClick={showNavbar}> <Link to="/tasks">Tasks</Link> </a>
              </>      
            ) : (
              <>
                <a onClick={showNavbar}> <Link to="/workers">Workers</Link> </a>
                <a onClick={showNavbar}> <Link to="/tasks">Tasks</Link> </a>
                <a onClick={showNavbar}> <Link to="/monitor">Monitor</Link> </a>
              </>
            )
          }
        </div>
      
        <div className="nav-elements">
        {user && (
              <div className="user-options">
                {workMode ? "" : <a><Link to="/settings">{user.email}</Link></a>}
                {workMode ? (
                  ""
                ) : (
                  <button onClick={handleLogoutClick}>Log out</button>
                )}
              </div>
        )}

        {!user && (
          <div className="authentication">
            <button> <Link to="/login">Login</Link> </button>
            <button> <Link to="/signup">Signup</Link> </button>
          </div>
        )}

        {user && (
          <div className="workmode">
            {workMode ? (
                <div>                         
                    <button onClick={handleEnableWorkMode}>
                        Disable Work Mode
                    </button>
                </div> 
            ) : (
                <div>                         
                    <button onClick={handleEnableWorkMode}>
                        Enable Work Mode
                    </button>
                </div>
            )}
          </div>
        )}


        <a
					className="nav-btn nav-close-btn material-symbols-outlined"
					onClick={showNavbar}
          onKeyDown={handleKeyPress}
        >
					menu
				</a>
        </div>        
      </nav>
      <a
					className="nav-btn material-symbols-outlined"
					onClick={showNavbar}
          onKeyDown={handleKeyPress}
        >
					menu
      </a>
    </header>
  );
};

export default Navbar;