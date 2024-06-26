import axios, { AxiosResponse } from "axios";

interface AxiosErrorType {
  code: string;
  config: unknown;
  message: string;
  request: unknown;
  name: string;
  response: AxiosResponse;
  stack: string;
}
export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

interface FetchDataProps {
  method: Method;
  url: string;
  body?: unknown;
  token?: string;
  params?: unknown;
}

export default async function fetchData(data: FetchDataProps) {
  try {
    const response: AxiosResponse = await axios({
      method: data.method,
      headers: {
        Authorization: data.token,
      },
      url: data.url,
      data: data.body,
      params: data.params,
    });
    if (response.data.save) {
      for (const key in response.data.save) {
        localStorage.setItem(key, response.data.save[key]);
      }
    }
    response.data.status = response.status;
    return response.data || "Something went wrong";
  } catch (err) {
    const error = err as AxiosErrorType;
    if (error.response.data.save) {
      for (const key in error.response.data.save) {
        localStorage.setItem(key, error.response.data.save[key]);
      }
    }
    error.response.data.status = error.response.status;
    return error.response.data || "Something went wrong";
  }
}
