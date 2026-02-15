import pool from "./pool.js"

async function getDirectors() {
  const { rows } = await pool.query("SELECT * FROM directors ORDER BY name ASC")
  return rows
}

async function getDirector(id) {
  const { rows } = await pool.query("SELECT * FROM directors WHERE id=$1;", [
    id,
  ])
  return rows[0]
}

async function createDirector(name) {
  const { rows } = await pool.query(
    "INSERT INTO directors (name) VALUES ($1) RETURNING *",
    [name],
  )
  return rows[0]
}

async function updateDirector(id, name) {
  const { rows } = await pool.query(
    "UPDATE directors SET name=$1 WHERE id=$2 RETURNING *",
    [name, id],
  )
  return rows[0]
}

async function deleteDirector(id) {
  const { rows } = await pool.query(
    "DELETE FROM directors WHERE id=$1 RETURNING *",
    [id],
  )
  return rows[0]
}

export default {
  getDirectors,
  getDirector,
  createDirector,
  updateDirector,
  deleteDirector,
}
