"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/users/user.route");
const project_route_1 = require("../modules/project/project.route");
const workExp_route_1 = require("../modules/workExperience/workExp.route");
const blog_route_1 = require("../modules/blog/blog.route");
const router = (0, express_1.Router)();
const mainRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoute,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoute,
    },
    {
        path: '/projects',
        route: project_route_1.projectRoute,
    },
    {
        path: '/work-experience',
        route: workExp_route_1.workExpRoute,
    },
    {
        path: '/blogs',
        route: blog_route_1.blogRouter,
    },
];
mainRoutes.forEach((item) => {
    router.use(item.path, item.route);
});
exports.appRoutes = router;
