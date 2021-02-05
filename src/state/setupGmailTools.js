import React, { useState } from "react";

/**
 * Store:
 *  * basic user information
 *  * all token information
 *
 * Provide:
 *  * secureFetch: function with bearer token included
 */

export const useGmailTools = () => {
  const [tools, setTools] = useState(undefined);

  const setupGmailTools = res => {
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