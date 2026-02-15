import {
  body,
  matchedData,
  param,
  query,
  validationResult,
} from "express-validator"
import db from "../db/queries.js"

const movieValidations = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title size should be shorter than 255")
    .escape(),
  body("year").isInt({ min: 1800 }).withMessage("Invalid year"),
  body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Genre size should be shorter than 255")
    .escape(),
  body("runtime").isInt({ min: 1 }).withMessage("Invalid runtime"),
  body("description").trim().optional({ checkFalsy: true }).escape(),
  body("director")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ max: 255 })
    .escape(),
]

const getMovies = async (req, res) => {
  const movies = await db.getMovies()
  res.json(movies)
}

const getMovie = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid id"),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = matchedData(req)
    const movie = await db.getMovie(id)

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" })
    }

    res.json(movie)
  },
]

const postMovie = [
  movieValidations,
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, year, genre, runtime, description, director } =
      matchedData(req)
    const newMovie = await db.createMovie(
      title,
      year,
      genre,
      runtime,
      description,
      director,
    )
    res.status(201).json(newMovie)
  },
]

const updateMovie = [
  body("id").isInt({ gt: 0 }),
  movieValidations,
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id, title, year, genre, runtime, description, director } =
      matchedData(req)
    const updatedMovie = await db.updateMovie(
      id,
      title,
      year,
      genre,
      runtime,
      description,
      director,
    )

    if (!updatedMovie) {
      return res.status(404).json({
        error: `Movie with ID ${id} not found`,
      })
    }

    res.json(updatedMovie)
  },
]

const deleteMovie = [
  query("id").isInt({ gt: 0 }),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = matchedData(req)
    const deletedMovie = await db.deleteMovie(id)

    if (!deletedMovie) {
      return res
        .status(404)
        .json({ error: "Movie not found, nothing to delete" })
    }
    res
      .status(200)
      .json({ message: "Deleted successfully", movie: deletedMovie })
  },
]

export default { getMovies, getMovie, postMovie, updateMovie, deleteMovie }
