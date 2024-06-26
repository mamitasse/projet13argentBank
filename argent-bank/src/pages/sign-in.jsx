import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, fetchUserProfile } from "../Redux/userSlice"; // Importez fetchUserProfile aussi

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user, token } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("User state on SignIn mount:", user);
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email: username, password }));
    if (login.fulfilled.match(resultAction)) {
      // navigate("/user"); // Commenter cette ligne pour permettre le fetchUserProfile avant navigation
    } else {
      console.log("Login failed: ", resultAction);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user)
      navigate("/user");
    }
  }, [user, navigate]);

  return (
    <div>
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-remember">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && error && <p>Error: {error}</p>}
        </section>
      </main>
    </div>
  );
};

export default SignIn;
