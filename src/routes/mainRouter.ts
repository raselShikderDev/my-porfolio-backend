import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/users/user.route";
import { projectRoute } from "../modules/project/project.route";
import { workExpRoute } from "../modules/workExperience/workExp.route";


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
    {
        path:"/work-experience",
        route:workExpRoute,
    },
]

mainRoutes.forEach((item)=>{
    router.use(item.path, item.route)
})


export const appRoutes = router