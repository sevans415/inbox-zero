import { useContext, useState, useEffect } from "react";
import { GmailToolsContext } from "../../state/setupGmailTools";
import { processData } from "../../data-processing/danielCode";

const Main = () => {
  const { secureFetch, userDetails } = useContext(GmailToolsContext);
  const [processedData, setProcessedData] = useState();

  useEffect(() => {
    if (secureFetch) {
      processData(secureFetch, userDetails).then(data => {
        setProcessedData(data);
      });
    }
  }, [userDetails, secureFetch]);

  if (processedData) {
    return JSON.stringify(processedData, null, 2);
  }
  return "loading...";
};

export default Main;
