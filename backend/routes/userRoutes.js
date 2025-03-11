import express from "express"
import { protect } from "../middleware/authMiddleware.js"
/*protect serves to check whether the user has a "token"
and he gets it only if he is successfully logged in.
The Bearer token is sent from "actions" in the frontend*/
import {
  checkUser,
  registerUser,
  registerUserPassword,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getUsersByDepartmens,
  updateLoged,
} from "../controllers/userController.js"
const router = express.Router()

//('/') je /api/users
router.route("/").post(protect, registerUser).get(protect, getUsers)
router.route("/password/:id").put(registerUserPassword)
router.route("/login").post(checkUser).put(updateLoged)
router.route("/login/password").post(loginUser)
router.route("/departmens").post(protect, getUsersByDepartmens)
router
  .route("/:id")
  .get(protect, getUserById)
  .delete(protect, deleteUser)
  .put(protect, updateUser)

export default router
