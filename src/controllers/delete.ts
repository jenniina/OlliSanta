import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export const deleteFile = (req: Request, res: Response) => {
  const { filename } = req.body

  if (filename && typeof filename === 'string') {
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename)

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error deleting file', error: err })
      }

      res.status(200).json({ message: 'File deleted successfully' })
    })
  } else {
    return res.status(400).json({ message: 'Filename is required' })
  }
}
