"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workExpRoute = void 0;
const express_1 = require("express");
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const user_interface_1 = require("../users/user.interface");
const workExp_controller_1 = require("./workExp.controller");
const multerConfig_1 = require("../../configs/multerConfig");
const router = (0, express_1.Router)();
// Creating a Work Experince
router.post("/create", multerConfig_1.multerUpload.single("file"), (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), 
// requestValidator(WorkExperienceCreateSchema),
workExp_controller_1.workExpController.createWorkExp);
// edit a Work Experince
router.patch("/edit/:id", multerConfig_1.multerUpload.single("file"), (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), 
// requestValidator(WorkExperienceUpdateSchema),
workExp_controller_1.workExpController.editWorkExp);
// get all Work Experince
router.get("/all", (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), workExp_controller_1.workExpController.getAllWorkExp);
// get a Work Experince
router.get("/:id", (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), workExp_controller_1.workExpController.getWorkExp);
// remove a Work Experince
router.delete("/:id", (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), workExp_controller_1.workExpController.removeWorkExp);
exports.workExpRoute = router;
