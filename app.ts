import express, { Express } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import routes from './src/routes/routes'

require('dotenv').config()

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(express.json())
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'dist')))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api', routes)

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
app.use((req, res) => {
  res.status(404).send('404 Not Found')
})

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.zzpvtsc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

mongoose
  .connect(uri)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  )
  .catch((error) => {
    throw error
  })
