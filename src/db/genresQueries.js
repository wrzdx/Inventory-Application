import pool from "./pool.js"

async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY name ASC")
  return rows
}

async function getGenre(id) {
  const { rows } = await pool.query("SELECT * FROM genres WHERE id=$1;", [id])
  return rows[0]
}

async function createGenre(name) {
  const { rows } = await pool.query(
    "INSERT INTO genres (name) VALUES ($1) RETURNING *",
    [name],
  )
  return rows[0]
}

async function updateGenre(id, name) {
  const { rows } = await pool.query(
    "UPDATE genres SET name=$1 WHERE id=$2 RETURNING *",
    [name, id],
  )
  return rows[0]
}

async function deleteGenre(id) {
  const { rows } = await pool.query(
    "DELETE FROM genres WHERE id=$1 RETURNING *",
    [id],
  )
  return rows[0]
}

export default { getGenres, getGenre, createGenre, updateGenre, deleteGenre }
