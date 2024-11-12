import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.originalname}`)
  },
})

interface MulterFile extends Express.Multer.File {
  mimetype: string
  originalname: string
}

const fileFilter = (
  req: Express.Request,
  file: MulterFile,
  cb: multer.FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|pdf/
  const mimetype = filetypes.test(file.mimetype)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed!'))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

export default upload
