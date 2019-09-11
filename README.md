# useApi custom fetching React hook

## Introduction

The useApi React hook is a small utility for React applications that abstracts away the fetching, loading and error handling when communicating to a remote API asynchronously in JavaScript using Axios.

## Installation

`npm install --save use-api-react-hook`

## Sample usage

### Fetch using lifecycle methods

```jsx
import React, { FC } from "react";
import useApi from "react-hooks-use-api";
import { AxiosInstance, AxiosPromise } from "axios";

export const Sample: FC = () => {
  const apiCall = axios.get(`some/api/route`);
  const [response, trigger] = useApi(apiCall);

  // Here we trigger the fetch on first render
  useEffect(() => {
    trigger();
  }, []);

  if (response.error) return <div>Problem occured</div>;
  if (response.loading) return <div>Loading...</div>;

  return <div>{response && response.result) || ""}</div>;
};
```

### Fetch on demand

```jsx
import React, { FC } from "react";
import useApi from "react-hooks-use-api";
import { AxiosInstance, AxiosPromise } from "axios";

export const Sample: FC = () => {
  const apiCall = axios.get(`some/api/route`);
  const [response, trigger] = useApi(apiCall);

  if (response.error) return <div>Problem occured</div>;
  if (response.loading) return <div>Loading...</div>;

  // Below we show the result (if exists yet) and render a button that will initiate fetches
  return <>
    <button onClick={()=> await trigger()}>Trigger re-fetch</button>
    <div>{(response && response.result) || ""}</div>
  </>;
};
```
