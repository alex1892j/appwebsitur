import { useNavigate, NavLink } from "react-router-dom";
import { isAdmin } from "../utils/roles";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";


function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => { 
    logout();
    navigate("/");
  };
  useEffect(() => {
  
}, [user]);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="app-header">
      <h2 className="logo" onClick={() => navigate("/")}>
          <img className="logo-img" src="https://i.pinimg.com/1200x/eb/69/28/eb6928b3c06030803a01a3bf47b8d00b.jpg" alt="" />
        </h2>

         {user && (
        <article className="header-right">
          <span className="user-info">
            👤 {user.username}
          </span>
        </article>
      )}
      <article className="header-left">
        
        <button className="menu-toggle" onClick={toggleMenu}> <span /><span /><span /></button>

        {/* menu bobile */}

        <nav className={ `mobile-menu ${menuOpen ? 'open' : ''}`} >
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Servicios</NavLink>
          <NavLink to="/appointment" onClick={() => setMenuOpen(false)}>Turnos</NavLink>

          {isAdmin(user) && (
            <NavLink to="/productsEdit" onClick={() => setMenuOpen(false)}>Productos</NavLink>
          )}
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
          </NavLink>
        </nav>
      </article>

      

     
    </header>
  );
}

export default Header;
