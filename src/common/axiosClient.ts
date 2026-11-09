import axios from "axios";
import { BACKEND_URL } from "../constants/backend";
import { retrieveLaunchParams } from '@telegram-apps/sdk';

const testMode: string = import.meta.env.VITE_TEST_MODE;

const axiosClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `tma ${testMode === "true" ? "TEST_MODE" : retrieveLaunchParams().initDataRaw}`
  }
});

export default axiosClient;