import { API_URL, DEV_API_URL } from "@env"

const BASE_URL = (process.env.NODE_ENV = "development" ? DEV_API_URL : API_URL)

export default BASE_URL
