import "dotenv/config"
import express from "express"
import path from "path"
import { fileURLToPath } from "url"

import router from "./routes/router.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 8000

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

app.use("/", router)

app.listen(PORT, (error) => {
  if (error) {
    throw error
  }
  console.log(`You can access site on http://localhost:${PORT}`)
})
