import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerUserStorage = diskStorage({
  destination: './uploads/users',
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
