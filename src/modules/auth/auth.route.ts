import { Router } from "express"
import { authController } from "./auth.controller"

const router = Router()


router.post("/admin-login", authController.ownerLogin)

export const userRouter = router