import React, { FC, useEffect, useContext, createContext } from "react";
import useApi from "react-hooks-use-api";
import { AxiosInstance, AxiosPromise } from "axios";

export const Sample: FC = () => {
  const apiCall = axios.get(`apiRoute`);
  const [response, trigger] = useApi(apiCall);

  useEffect(() => {
    trigger();
  }, []);

  if (response.error) return <div>Problem occured</div>;
  if (response.loading) return <div>Loading...</div>;

  return <div>{response.result}</div>;
};
