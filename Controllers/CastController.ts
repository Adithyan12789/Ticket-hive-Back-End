import { Request, Response } from "express";
import { Cast } from "../Models/CastModel";
import { injectable } from "inversify";

@injectable()
export class CastController {

    async addCast(req: Request, res: Response): Promise<void> {
        try {
            const { name, role } = req.body;
            const file = req.file;

            if (!name || !role || !file) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            const newCast = new Cast({
                name,
                role,
                image: file.filename,
            });

            await newCast.save();
            res.status(201).json({ message: "Cast added successfully", cast: newCast });
        } catch (error) {
            console.error("Error adding cast:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }

    async getAllCast(req: Request, res: Response): Promise<void> {
        try {
            const cast = await Cast.find();
            res.status(200).json(cast);
        } catch (error) {
            console.error("Error fetching cast:", error);
            res.status(500).json({ message: "Server Error" });
        }
    }

    async deleteCast(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await Cast.findByIdAndDelete(id);
            res.status(200).json({ message: "Cast deleted successfully" });
        } catch (error) {
            console.error("Error deleting cast:", error);
            res.status(500).json({ message: "Server Error" });
        }
    }
}
