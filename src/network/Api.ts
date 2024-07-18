import axios from "axios";
import { BaseURL, X_API_KEY } from "../components/constants/api-paths.c";
import store, { useAppSelector } from "../redux";

const api = axios.create({
  baseURL: `${BaseURL}`,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": X_API_KEY
  },
});

// Intercept requests to add authorization token
api.interceptors.request.use(
  (config) => {
    const data = store?.getState(); // Access token from Redux store
    const token = data?.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAPI = async (url: string) => {
  try {
    const res = api.get(url).then((response) => {
      // Handle the response
      const result = handleResponse(response)?.data;
      return result;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postAPI = async (url: string, payload: any) => {
  try {
    const res = api.post(url, payload).then((response) => {
      // Handle the response
      const result = handleResponse(response)?.data;
      return result;
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export const putAPI = async (url: string, payload: any) => {
  try {
    const res = api.put(url, payload).then((response) => {
      // Handle the response
      const result = handleResponse(response)?.data;
      return result;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAPI = async (url: string) => {
  try {
    const res = api.delete(url).then((response) => {
      // Handle the response
      const result = handleResponse(response)?.data;
      return result;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const patchAPI = async (url: string, body: any) => {
  try {
    const res = api.patch(url, body).then((response) => {
      // Handle the response
      const result = handleResponse(response)?.data;
      return result;
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

function handleResponse(response: any) {
  if (response.success === false) {
    const error =
      // (response &&
      response.message;
    // ) || response.statusText;
    return Promise.reject(error);
  } else {
    return response;
  }
  // return response.json().then((data) => {
  //   return data;
  // });
}
