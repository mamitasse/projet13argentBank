import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import argentBankLogo from '../assets/img/argentBankLogo.png';
import { logout } from '../Redux/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userState = useSelector(state => state.user);
  const { user } = userState;

  const handleLogout = () => {
    dispatch(logout());
   console.log('handellogout')
    //navigate('/sign-in'); // Redirige vers la page d'accueil après la déconnexion
  };

  return (
    <header>
      <nav className="main-nav">
        <Link className="main-nav-logo" to="/">
          <img
            className="main-nav-logo-image"
            src={argentBankLogo}
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
        <div>
          {user ? (
            <>
              <i className="fa fa-user-circle"></i>
              <span className="user-name"> {user.firstName}   <i className="fa-solid fa-arrow-right-from-bracket" /> </span>
              <Link to='/sign-in' className="main-nav-item" onClick={handleLogout} >Sign Out</Link>
            </>
          ) : (
            <Link className="main-nav-item" to="/sign-in">
              <i className="fa fa-user-circle"></i>
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
