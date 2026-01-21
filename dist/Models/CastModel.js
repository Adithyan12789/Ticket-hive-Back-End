"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cast = void 0;
const mongoose_1 = require("mongoose");
const CastSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ["Actor", "Director"], required: true },
    image: { type: String, required: true },
});
exports.Cast = (0, mongoose_1.model)("Cast", CastSchema);
//# sourceMappingURL=CastModel.js.map