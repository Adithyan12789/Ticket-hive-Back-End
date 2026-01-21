"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CastController = void 0;
const CastModel_1 = require("../Models/CastModel");
const inversify_1 = require("inversify");
let CastController = class CastController {
    async addCast(req, res) {
        try {
            const { name, role } = req.body;
            const file = req.file;
            if (!name || !role || !file) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }
            const newCast = new CastModel_1.Cast({
                name,
                role,
                image: file.filename,
            });
            await newCast.save();
            res.status(201).json({ message: "Cast added successfully", cast: newCast });
        }
        catch (error) {
            console.error("Error adding cast:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }
    async getAllCast(req, res) {
        try {
            const cast = await CastModel_1.Cast.find();
            res.status(200).json(cast);
        }
        catch (error) {
            console.error("Error fetching cast:", error);
            res.status(500).json({ message: "Server Error" });
        }
    }
    async deleteCast(req, res) {
        try {
            const { id } = req.params;
            await CastModel_1.Cast.findByIdAndDelete(id);
            res.status(200).json({ message: "Cast deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting cast:", error);
            res.status(500).json({ message: "Server Error" });
        }
    }
};
exports.CastController = CastController;
exports.CastController = CastController = __decorate([
    (0, inversify_1.injectable)()
], CastController);
//# sourceMappingURL=CastController.js.map