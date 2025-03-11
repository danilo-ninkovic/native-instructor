import express from "express"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import mongoSanitize from "express-mongo-sanitize"
import helmet from "helmet"
import xss from "xss-clean"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import cors from "cors"
import crypto from "crypto"
import colors from "colors" // for coloring console.log
import { notFound, errorHandler } from "./middleware/errorMiddleware.js" //custom error handling for req/res cycle
import connectDB from "./config/db.js"
import upustvoRoutes from "./routes/upustvoRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import pkg from "cloudinary"
const cloudinary = pkg

dotenv.config() // to get all ENV anywhere in application
connectDB() // connecting  Mongo Atlas base
const app = express()

//using this middleware, data from the body is taken into the app (as a body-parser)
app.use(express.json())

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

//prevent noSql injection & sanitize data
app.use(mongoSanitize())

const generateNonce = () => {
  return crypto.randomBytes(16).toString("base64")
}

// Dodajte ovo prije postavljanja CSP politike u vašem Express.js serveru
const nonceValue = generateNonce()

// Vaša CSP politika
const cspPolicy = `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.cloudinary.com https://upload-widget.cloudinary.com example.com 'nonce-${nonceValue}'; img-src 'self' https: data:; frame-src 'self' https: data:; media-src * 'self' https: data:`

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ["*"],
    },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://widget.cloudinary.com",
          "https://upload-widget.cloudinary.com",
          "example.com",
          `nonce-${nonceValue}`,
        ],
        "img-src": ["'self'", "https:", "data:"],
        "frame-src": ["'self'", "https:", "data:"],
        "media-src": ["*", "'self'", "https:", "data:"],
      },
    },
  })
)

//prevent XSS attacks
app.use(xss())

//limit to many requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

//prevent hpp param pollution
app.use(hpp())

//enable CORS
app.use(cors())

app.use("/api/upustva", upustvoRoutes) /* "/"  upustvaRoutes */
app.use("/api/users", userRoutes) /* "/"  userRoutes */
app.use("/api/upload", uploadRoutes) /* "/"  uploadRoutes */

/* for the folder where images, CSS files are, if we want to use them, that folder must set as "static" */
const __dirname = path.resolve()
/* app.use("/uploads", express.static(path.join(__dirname, "uploads")))
//folder 'uploads' in backend ,but he was replaced with Cloudinary */

//Serve static assets in production (production setup )
// Postavljanje sigurnosnih zaglavlja
//Serve static assets in production (production setup )
if (process.env.NODE_ENV === "production") {
  //Set static frontend - "build"
  app.use(express.static(path.join(__dirname, "/frontend/build")))

  /*   app.get (for request '*' which is not one of API routes defined above) send "index.html" from build*/
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  )
} else {
  app.get("/", (req, res) => {
    res.send("Please set production")
  })
}

//error middleware functions
app.use(notFound) //If URL is something not defined
app.use(errorHandler) //for error request

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .underline
  )
)
