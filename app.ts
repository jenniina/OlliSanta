import express, { Express } from "express"
import mongoose from "mongoose"
import fs from "fs"
import path from "path"
import routes from "./src/routes/routes"

require("dotenv").config()

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(express.json())
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))

const distClientPath = path.join(__dirname, "dist", "client")
app.use(express.static(distClientPath))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api", routes)

app.get("*", (_req, res) => {
  if (_req.path === "/contact") {
    const type = String((_req.query as any)?.type ?? "").toLowerCase()
    const allowed = new Set(["arrangement", "composition", "parts", "notation"])
    if (allowed.has(type)) {
      res.redirect(302, `/contact/${type}`)
      return
    }
  }

  const reqPath = _req.path.replace(/^\/+/, "")
  const prerenderedHtmlPath = path.join(distClientPath, reqPath, "index.html")
  if (fs.existsSync(prerenderedHtmlPath)) {
    res.sendFile(prerenderedHtmlPath)
    return
  }
  res.sendFile(path.join(distClientPath, "index.html"))
})
app.use((req, res) => {
  res.status(404).send("404 Not Found")
})

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.zzpvtsc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

mongoose
  .connect(uri)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch((error) => {
    throw error
  })
