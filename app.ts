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
  const pathOnly = _req.path
  const queryType = String((_req.query as any)?.type ?? "").toLowerCase()

  // Prevent indexing of private/utility pages (works even if bot doesn't run JS)
  if (pathOnly === "/login" || pathOnly === "/message") {
    res.setHeader("X-Robots-Tag", "noindex, nofollow")
  }

  const fiTypeByInternal: Record<string, string> = {
    arrangement: "sovitus",
    composition: "savellys",
    parts: "osien-nauhoitukset",
    notation: "nuottikirjoitus",
    other: "muu",
  }

  const fiTypeSlugs = new Set(Object.values(fiTypeByInternal))
  const enTypeSlugs = new Set(Object.keys(fiTypeByInternal))

  // Legacy about
  if (pathOnly === "/about") {
    res.redirect(301, "/tietoa")
    return
  }

  // Legacy contact base + query
  if (pathOnly === "/contact") {
    if (enTypeSlugs.has(queryType)) {
      res.redirect(301, `/yhteys/${fiTypeByInternal[queryType]}`)
      return
    }
    if (fiTypeSlugs.has(queryType)) {
      res.redirect(301, `/yhteys/${queryType}`)
      return
    }
    res.redirect(301, "/yhteys")
    return
  }

  // Legacy contact type path
  if (pathOnly.startsWith("/contact/")) {
    const slug = pathOnly.split("/").filter(Boolean)[1]?.toLowerCase() ?? ""
    if (enTypeSlugs.has(slug)) {
      res.redirect(301, `/yhteys/${fiTypeByInternal[slug]}`)
      return
    }
    res.redirect(301, "/yhteys")
    return
  }

  // Support localized query on canonical paths
  if (pathOnly === "/yhteys") {
    if (enTypeSlugs.has(queryType)) {
      res.redirect(301, `/yhteys/${fiTypeByInternal[queryType]}`)
      return
    }
    if (fiTypeSlugs.has(queryType)) {
      res.redirect(301, `/yhteys/${queryType}`)
      return
    }
  }

  if (pathOnly === "/en/contact" && enTypeSlugs.has(queryType)) {
    res.redirect(301, `/en/contact/${queryType}`)
    return
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
