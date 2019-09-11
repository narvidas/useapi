# useApi - a handy React hook for fetching with Axios

## Introduction

The useApi React hook is a small utility for React applications that abstracts away the fetching, loading and error handling when communicating to a remote API asynchronously using [axios](https://github.com/axios/axios).

## Specifics

A typical way to consume useApi is as follows: `const [response, trigger] = useApi(axiosCall)`

In above snippet the `useApi` hook consumes an Axios HTTP method to a resource (get, post, put, etc.) and returns two items back:

- `trigger` - a function, that once called will initiate the API call (can be awaited)
- `response` object that in itself contains:
    - `error` (error message if any was returned during fetching)
    - `isFetching` (boolean to indicate that the fetch is ongoing)
    - `result` (the result returned from the endpoint)

## Installation

`npm install --save use-api-react-hook`

## Sample usage

### Fetch during component lifecycle

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
  return (
    <>
      <button onClick={trigger}>Trigger re-fetch</button>
      <div>{(response && response.result) || ""}</div>
    </>
  );
};
```
