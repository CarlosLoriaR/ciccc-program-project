import multer from 'multer';
import { BadRequestError } from '../../common/errors/httpErrors';

// Images are stored as base64 inside the User document itself (see user.controller.ts) —
// no disk storage, no external bucket/account needed. Keeping the size limit modest keeps
// documents small and requests reasonably fast.
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
