import {
  body,
  matchedData,
  param,
  query,
  validationResult,
} from "express-validator"
import db from "./../db/queries.js"

const genreValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Genre cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Genre size should be shorter than 50")
    .escape(),
]

const getGenres = async (req, res) => {
  const genres = await db.getGenres();
  res.render("index", { active: 'genres', genres });
}

const getGenre = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid id").toInt(),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const id = matchedData(req).id
    const genre = await db.getGenre(id)
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" })
    }
    res.json(genre)
  },
]

const postGenre = [
  genreValidation,
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name } = matchedData(req)
    try {
      const newGenre = await db.createGenre(name)
      res.redirect("/genres/")
    } catch (err) {
      if (err.code === "23505") {
        return res.status(400).json({
          errors: [{ msg: `Genre "${name}" already exists`, path: "name" }],
        })
      }

      console.error(err)
      res.status(500).send("Ошибка сервера")
    }
  },
]

const updateGenre = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid id").toInt(),
  ,
  genreValidation,
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id, name } = matchedData(req)

    const updatedGenre = await db.updateGenre(id, name)
    if (!updatedGenre) {
      return res.status(404).json({
        error: `Genre with ID ${id} not found`,
      })
    }
    res.redirect("/genres/")
  },
]

const deleteGenre = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid id").toInt(),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = matchedData(req)
    const deleted = await db.deleteGenre(id)
    if (!deleted) {
      return res.status(404).json({
        error: `Genre with ID ${id} not found`,
      })
    }
    res.redirect("/genres/")
  },
]

export default {
  getGenres,
  getGenre,
  postGenre,
  updateGenre,
  deleteGenre,
}
