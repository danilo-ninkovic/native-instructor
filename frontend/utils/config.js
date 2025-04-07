import Constants from "expo-constants";

const { API_URL, DEV_API_URL } = Constants.expoConfig.extra;

const BASE_URL = process.env.NODE_ENV === "development" ? DEV_API_URL : API_URL;

/* console.log("BASE_URL:", BASE_URL); */

export default BASE_URL;
