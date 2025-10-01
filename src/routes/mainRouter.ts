import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/users/user.route";


const router = Router()

const mainRoutes =[
    {
        path:"/user",
        route:userRoute,
    },
    {
        path:"/auth",
        route:authRoute,
    },
]

mainRoutes.forEach((item)=>{
    router.use(item.path, item.route)
})


export const appRoutes = router