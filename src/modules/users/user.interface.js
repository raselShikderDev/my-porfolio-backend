"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.isActive = void 0;
var isActive;
(function (isActive) {
    isActive["ACTIVE"] = "ACTIVE";
    isActive["INACTIVE"] = "INACTIVE";
    isActive["BLOCKED"] = "BLOCKED";
})(isActive || (exports.isActive = isActive = {}));
var Role;
(function (Role) {
    Role["OWNER"] = "OWNER";
    Role["MANAGER"] = "MANAGER";
})(Role || (exports.Role = Role = {}));
