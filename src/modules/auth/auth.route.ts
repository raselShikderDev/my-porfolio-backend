import { Router } from "express"
import { authController } from "./auth.controller"
// import { requestValidator } from "../../middlewares/requestValidator"
// import { LoginSchema } from "./auth.schema"

const router = Router()


router.post("/login",  authController.ownerLogin)
router.post("/logout", authController.ownerLogOut)
router.post("/generate-token", authController.generateNewAccessToken)

export const authRoute = router