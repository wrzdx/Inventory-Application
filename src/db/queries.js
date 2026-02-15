import pool from "./pool.js"

async function getMovies() {
  const { rows } = await pool.query("SELECT * FROM movies;")
  return rows
}

async function getMovie(id) {
  const { rows } = await pool.query("SELECT * FROM movies WHERE id=$1;", [id])
  return rows[0]
}

async function createMovie(title, year, genre, runtime, description, director) {
  const { rows } = await pool.query(
    `
    INSERT INTO movies VALUES 
    (DEFAULT, $1,$2,$3,$4,$5,$6)
    RETURNING *;`,
    [title, year, genre, runtime, description, director],
  )

  return rows[0]
}

async function updateMovie(
  id,
  title,
  year,
  genre,
  runtime,
  description,
  director,
) {
  const { rows } = await pool.query(
    `
    UPDATE movies SET 
    title=$2, year=$3, genre=$4, runtime=$5, description=$6, director=$7
    WHERE id=$1 
    RETURNING *;`,
    [id, title, year, genre, runtime, description, director],
  )

  return rows[0]
}

async function deleteMovie(id) {
  const { rows } = await pool.query(
    "DELETE FROM movies WHERE id = $1 RETURNING *;",
    [id],
  )
  return rows[0]
}

export default { getMovies, getMovie, createMovie, updateMovie, deleteMovie }
