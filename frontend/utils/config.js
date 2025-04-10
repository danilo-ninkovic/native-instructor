import Constants from "expo-constants"

const { API_URL, DEV_API_URL, NODE_ENV } = Constants.expoConfig.extra

const BASE_URL = NODE_ENV === "development" ? DEV_API_URL : API_URL

export default BASE_URL
