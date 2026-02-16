import {
  body,
  matchedData,
  param,
  query,
  validationResult,
} from "express-validator"
import db from "./../db/queries.js"

const directorValidation = [
  body("adminPassword").custom((value) => {
    const SECRET = process.env.PASSWORD
    if (value !== SECRET) {
      throw new Error("Incorrect password")
    }
    return true
  }),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Director cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Director size should be shorter than 255")
    .escape(),
]

const getDirectors = async (req, res) => {
  const directors = await db.getDirectors()
  res.render("index", { active: "directors", directors })
}

const getDirector = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid id").toInt(),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const id = matchedData(req).id
    const director = await db.getDirector(id)
    if (!director) {
      return res.status(404).json({ error: "Director not found" })
    }
    res.json(director)
  },
]

const postDirector = [
  directorValidation,
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name } = matchedData(req)
    try {
      const newDirector = await db.createDirector(name)
      res.redirect("/directors")
    } catch (err) {
      if (err.code === "23505") {
        return res.status(400).json({
          errors: [{ msg: `Director "${name}" already exists`, path: "name" }],
        })
      }

      console.error(err)
      res.status(500).send("Ошибка сервера")
    }
  },
]

const updateDirector = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid id").toInt(),
  ,
  directorValidation,
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id, name } = matchedData(req)
    const updatedDirector = await db.updateDirector(id, name)
    if (!updatedDirector) {
      return res.status(404).json({
        error: `Director with ID ${id} not found`,
      })
    }
    res.redirect("/directors")
  },
]

const deleteDirector = [
  body("adminPassword").custom((value) => {
    const SECRET = process.env.PASSWORD
    if (value !== SECRET) {
      throw new Error("Incorrect password")
    }
    return true
  }),
  param("id").isInt({ gt: 0 }).withMessage("Invalid id").toInt(),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = matchedData(req)
    const deleted = await db.deleteDirector(id)
    if (!deleted) {
      return res.status(404).json({
        error: `Director with ID ${id} not found`,
      })
    }
    res.redirect("/directors")
  },
]

export default {
  getDirectors,
  getDirector,
  postDirector,
  updateDirector,
  deleteDirector,
}
