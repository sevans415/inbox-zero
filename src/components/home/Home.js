import React from "react";
import { useGoogleLogin } from "react-google-login";

import { useGmailTools, GmailToolsContext } from "../../state/setupGmailTools";
import Main from "../main/Main";
import logo from "../../assets/logo.svg";
import "./App.css";

const scope = "https://mail.google.com/";

const Home = () => {
  const { tools, setupGmailTools } = useGmailTools();

  const onFailure = res => {
    console.log(res);
  };

  const { signIn, loaded } = useGoogleLogin({
    onSuccess: setupGmailTools,
    scope,
    onFailure,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
  });

  const isLoggedIn = loaded && tools;

  return (
    <div className="App">
      {!isLoggedIn && (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button onClick={signIn}>Google sign in</button>
        </header>
      )}
      {isLoggedIn && (
        <GmailToolsContext.Provider value={tools}>
          <Main />
        </GmailToolsContext.Provider>
      )}
    </div>
  );
};

export default Home;
