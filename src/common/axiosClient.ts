import axios from "axios";
import { BACKEND_URL, BACKEND_URL_LOCAL } from "../constants/backend";
import { retrieveLaunchParams } from '@telegram-apps/sdk';

const testMode: string = import.meta.env.VITE_TEST_MODE;
const baseURL = testMode === "true" && BACKEND_URL_LOCAL ? BACKEND_URL_LOCAL : BACKEND_URL;

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `tma ${testMode === "true" ? "TEST_MODE" : retrieveLaunchParams().initDataRaw}`
  }
});

export default axiosClient;