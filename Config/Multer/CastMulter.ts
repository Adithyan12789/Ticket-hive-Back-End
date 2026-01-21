import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const baseDir = process.cwd();

class CastImageUploads {
    private static ensureDirectoryExists(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    private static createStorage(): StorageEngine {
        const uploadPath = path.join(baseDir, "Back-End/public", "CastImages");
        this.ensureDirectoryExists(uploadPath);

        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                cb(
                    null,
                    `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
                );
            },
        });
    }

    private static fileFilter(
        req: Express.Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ): void {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"));
        }
    }

    public static uploadCastImage = multer({
        storage: this.createStorage(),
        fileFilter: this.fileFilter,
    }).single("image");
}

export default CastImageUploads;
