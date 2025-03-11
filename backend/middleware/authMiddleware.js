import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"

/* It will take token from req.headers.authorizaton validate it (decoded) extract ID from token and  move next() to route func*/
//middleware function
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    /* Bearer UserInfo token will bee sent from frontend UpustvoActions & UserAction inside headers*/
  ) {
    try {
      token = req.headers.authorization.split(" ")[1] //take toke without Bearer
      const decoded = jwt.verify(token, process.env.JWT_SECRET) //extract ID
      req.user = await User.findById(decoded.id).select("-password") // Now the req.user is user founded by id from token
      next() //exit from middleware
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error("Nema autorizacije, token ne ipravan")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Nemate token za  autorizaciju - protect middlevare !!!")
  }
})

export { protect }
