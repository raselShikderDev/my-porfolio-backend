import { Router } from "express"
import { userController } from "./user.controller"
import authCheck from "../../middlewares/authCheck"
import { Role } from "./user.interface"

const router = Router()


router.get("/getme", authCheck(...Object.values(Role)), userController.getMe)

router.post("/", userController.create)

export const userRoute = router