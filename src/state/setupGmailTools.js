import React, { useState } from "react";

const AUTH_RESPONSE_DATA = "auth_response_data";
/**
 * a function that sets up state to hold information from the gmail auth flow
 *
 * * secureFetch passes in some default options, importantly the Authorization token
 */

export const useGmailTools = () => {
  const [tools, setTools] = useState(undefined);

  const setupGmailTools = res => {
    window.localStorage.setItem(AUTH_RESPONSE_DATA, JSON.stringify(res));
    console.log("res", res);

    const authToken = res.tokenObj.access_token;
    const fullName = res.Es.sd;
    const googleId = res.profileObj.googleId;
    const imageUrl = res.profileObj.imageUrl;

    const secureFetch = (url, options = {}, body) => {
      const defaultOptions = {
        mode: "cors"
      };
      const defaultHeaders = {
        Authorization: `Bearer ${authToken}`
      };
      const headers = {
        ...defaultHeaders,
        ...options.headers
      };

      const finalOptions = {
        ...defaultOptions,
        headers: new Headers(headers),
        method: options.method || "GET",
        body: body ? JSON.stringify(body) : undefined
      };

      return fetch(url, finalOptions);
    };

    const userDetails = { fullName, googleId, imageUrl };

    setTools({ userDetails, secureFetch });
  };

  return { tools, setupGmailTools };
};

export const GmailToolsContext = React.createContext();

export const getFromStorage = () => {
  const authResponse = window.localStorage.getItem(AUTH_RESPONSE_DATA);
  if (!authResponse) return;

  const res = JSON.parse(authResponse);
  if (new Date(res.tokenObj.expiresAt) < new Date()) {
    window.localStorage.removeItem(AUTH_RESPONSE_DATA);
    return;
  }

  return res;
};
