import { Router } from "express"
import { authController } from "./auth.controller"
import { requestValidator } from "../../middlewares/requestValidator"
import { LoginSchema } from "./auth.schema"

const router = Router()


router.post("/login", requestValidator(LoginSchema), authController.ownerLogin)

export const authRoute = router