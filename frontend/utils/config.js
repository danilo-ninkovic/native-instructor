import { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_DEV_API_URL } from "@env";
console.log(EXPO_PUBLIC_API_URL, EXPO_PUBLIC_DEV_API_URL);

const BASE_URL = "http://192.168.0.14:5000";
/* const BASE_URL =
  process.env.NODE_ENV === "development"
    ? EXPO_PUBLIC_DEV_API_URL
    : EXPO_PUBLIC_API_URL;

console.log("BASE_URL:", BASE_URL); */

export default BASE_URL;
