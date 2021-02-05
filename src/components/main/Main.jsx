import { useContext, useState, useEffect } from "react";
import { GmailToolsContext } from "../../state/setupGmailTools";

const Main = () => {
  const { secureFetch, userDetails } = useContext(GmailToolsContext);
  const [exampleFetchedData, setExampleFetchedData] = useState();

  useEffect(() => {
    if (secureFetch) {
      const url = `https://gmail.googleapis.com/gmail/v1/users/${userDetails.googleId}/threads`;
      secureFetch(url)
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => {
          console.log(data);
          setExampleFetchedData(data);
        });
    }
  }, [userDetails, secureFetch]);

  if (exampleFetchedData) {
    return JSON.stringify(exampleFetchedData, null, 2);
  }
  return "loading...";
};

export default Main;
