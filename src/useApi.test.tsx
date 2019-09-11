import { renderHook } from "@testing-library/react-hooks";
import useApi, { ApiResponse } from "./useApi";
import MockAdapter from "axios-mock-adapter";
import Axios, { AxiosPromise, AxiosInstance } from "axios";

interface MockApi {
  mockGetServiceMethod: () => AxiosPromise<string>;
}
const MockService = (axios: AxiosInstance): MockApi => {
  return {
    mockGetServiceMethod: () => axios.get("/test")
  };
};

const axiosMock = new MockAdapter(Axios);
const mockService = MockService(Axios);

describe("useApi", () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  test("triggers only when callback is called", async () => {
    axiosMock.onGet("/test").reply(200, "data");

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(mockService.mockGetServiceMethod)
    );
    let [apiResponse, apiCallback] = result.current;
    let emptyApiResponse: ApiResponse<string> = {
      result: undefined,
      isFetching: false,
      error: undefined
    };

    expect(apiResponse).toStrictEqual(emptyApiResponse);

    apiCallback();
    await waitForNextUpdate();
    [apiResponse] = result.current;

    expect(apiResponse.result).toEqual("data");
  });

  test("sets error if network error occurs", async () => {
    axiosMock.onGet("/test").networkError();

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(mockService.mockGetServiceMethod)
    );
    let [apiResponse, apiCallback] = result.current;
    apiCallback();

    expect(apiResponse.error).toBeUndefined();

    await waitForNextUpdate();
    [apiResponse] = result.current;

    expect(apiResponse.error).toStrictEqual(Error("Network Error"));
  });

  test("sets error if backend error occurs", async () => {
    axiosMock.onGet("/test").reply(500);

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(mockService.mockGetServiceMethod)
    );
    let [apiResponse, apiCallback] = result.current;
    apiCallback();

    expect(apiResponse.error).toBeUndefined();

    await waitForNextUpdate();
    [apiResponse] = result.current;

    expect(apiResponse.error).toStrictEqual(
      Error("Request failed with status code 500")
    );
  });

  test("re-sets error when new fetch is initiated", async () => {
    // 1st call - yields an error
    axiosMock.onGet("/test").reply(500);
    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(mockService.mockGetServiceMethod)
    );
    let [apiResponse, apiCallback] = result.current;
    apiCallback();

    expect(apiResponse.error).toBeUndefined();

    await waitForNextUpdate();
    [apiResponse] = result.current;

    expect(apiResponse.error).toStrictEqual(
      Error("Request failed with status code 500")
    );

    // 2nd call - does not yield an error, previous error should not persist
    axiosMock.onGet("/test").reply(200, "data");
    apiCallback();
    [apiResponse] = result.current;

    expect(apiResponse.error).toBeUndefined();

    await waitForNextUpdate();
    [apiResponse] = result.current;

    expect(apiResponse.error).toBeUndefined();
  });

  test("sets result if successful", async () => {
    axiosMock.onGet("/test").reply(200, "data");

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(mockService.mockGetServiceMethod)
    );
    const [, apiCallback] = result.current;
    apiCallback();

    await waitForNextUpdate();
    const [apiResponse] = result.current;

    expect(apiResponse.result).toEqual("data");
  });

  test("sets isFetching to true when fetching and re-sets once finished", async () => {
    axiosMock.onGet("/test").reply(200, "data");

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(mockService.mockGetServiceMethod)
    );
    const [, apiCallback] = result.current;
    apiCallback();
    let [apiResponse] = result.current;

    expect(apiResponse.isFetching).toEqual(true);

    await waitForNextUpdate();
    [apiResponse] = result.current;

    expect(apiResponse.isFetching).toEqual(false);
  });
});
