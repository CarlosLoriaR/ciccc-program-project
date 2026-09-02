import multer from 'multer';
import { BadRequestError } from '../../common/errors/httpErrors';

// Stored as base64 inside the User document — no disk storage, no external bucket.
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new BadRequestError('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});
