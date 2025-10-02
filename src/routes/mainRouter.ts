import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/users/user.route";
import { projectRoute } from "../modules/project/project.route";


const router = Router()

const mainRoutes =[
    {
        path:"/users",
        route:userRoute,
    },
    {
        path:"/auth",
        route:authRoute,
    },
    {
        path:"/projects",
        route:projectRoute,
    },
]

mainRoutes.forEach((item)=>{
    router.use(item.path, item.route)
})


export const appRoutes = router