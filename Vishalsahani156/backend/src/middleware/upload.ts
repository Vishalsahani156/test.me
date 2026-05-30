import multer from 'multer'

const MAX_FILE_SIZE = 5 * 1024 * 1024

export const uploadResumeFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(_req, file, cb) {
    const name = file.originalname.toLowerCase()
    const allowed =
      name.endsWith('.pdf') ||
      name.endsWith('.docx') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!allowed) {
      cb(new Error('Only PDF and DOCX files are supported'))
      return
    }

    cb(null, true)
  },
}).single('file')
