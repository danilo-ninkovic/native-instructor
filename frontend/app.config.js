import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

export default {
  name: "Native-instructor",
  slug: "native-instructor",
  version: "1.0",
  extra: {
    API_URL: process.env.API_URL,
    DEV_API_URL: process.env.DEV_API_URL,
  },
}
