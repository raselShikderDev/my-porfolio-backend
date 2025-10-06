"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoute = void 0;
const express_1 = require("express");
const requestValidator_1 = require("../../middlewares/requestValidator");
const project_schema_1 = require("./project.schema");
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const user_interface_1 = require("../users/user.interface");
const project_controller_1 = require("./project.controller");
const multerConfig_1 = require("../../configs/multerConfig");
const router = (0, express_1.Router)();
// Creating a project
router.post("/create", multerConfig_1.multerUpload.single("file"), (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), (0, requestValidator_1.requestValidator)(project_schema_1.ProjectCreateSchema), project_controller_1.projectController.createProject);
// edit a project
router.patch("/edit/:id", multerConfig_1.multerUpload.single("file"), (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), (0, requestValidator_1.requestValidator)(project_schema_1.ProjectUpdateSchema), project_controller_1.projectController.editProject);
// get all project
router.get("/all", (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), project_controller_1.projectController.getAllProject);
// get a project
router.get("/:id", (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), project_controller_1.projectController.getProject);
// remove a project
router.delete("/:id", (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), project_controller_1.projectController.removeProject);
exports.projectRoute = router;
