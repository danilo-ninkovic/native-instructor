import express from "express"
import { protect } from "../middleware/authMiddleware.js"
/*protect serves to check whether the user has a "token"
and he gets it only if he is successfully logged in.
The Bearer token is sent from "actions" in the frontend*/
const router = express.Router()
import {
  addNovoUpustvo,
  deleteUpustvo,
  getAllUpustva,
  getUpustvoById,
  updateUpustvo,
} from "../controllers/upustvoController.js"

/* /api/upustva */
router.route("/").post(protect, getAllUpustva)
router.route("/add").post(protect, addNovoUpustvo)
/* /api/upustva/:id */
router
  .route("/:id")
  .get(protect, getUpustvoById)
  .delete(protect, deleteUpustvo)
  .put(protect, updateUpustvo)

export default router
