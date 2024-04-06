import axios, {  AxiosResponse } from "axios";

interface AxiosErrorType {
  code : string,
  config : unknown,
  message : string,
  request : unknown,
  name : string,
  response : AxiosResponse,
  stack : string,
}
export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

interface FetchDataProps {
  method : Method,
  url : string,
  body? : unknown,
  token? : string,
  params? : unknown,
}


export default async function fetchData( data : FetchDataProps ) {

  try{
    const response: AxiosResponse = await axios({
      method :  data.method,
      headers : {
        Authorization : data.token,
      },
      url : data.url,
      data : data.body,
      params : data.params,
    });

    return response.data;
  }
  catch(err){
    const error = err as AxiosErrorType;
    return error.response.data || "Something went wrong";
  }
}
