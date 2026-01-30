import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export const deleteFile = (req: Request, res: Response) => {
  const { filename } = req.body

  if (filename && typeof filename === 'string') {
    const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads')
    const safeName = path.basename(filename)
    const filePath = path.resolve(uploadsDir, safeName)

    if (!safeName || filePath !== path.join(uploadsDir, safeName)) {
      return res.status(400).json({ message: 'Invalid filename' })
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err)
        return res
          .status(500)
          .json({ message: 'Error deleting file', error: err })
      }

      res.status(200).json({ message: 'File deleted successfully' })
    })
  } else {
    return res.status(400).json({ message: 'Filename is required' })
  }
}
