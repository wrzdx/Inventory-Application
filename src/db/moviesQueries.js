import pool from "./pool.js"

async function getMovies() {
  const subquery = `
  SELECT COALESCE(json_agg(g.name), '[]') 
  FROM movie_genres mg 
  JOIN genres g ON g.id = mg.genre_id 
  WHERE mg.movie_id = m.id
  `
  const query = `
  SELECT 
    m.id,m.title, m.year, m.runtime, m.description,  
    d.name AS director,
    (${subquery}) AS genres
  FROM movies m
  LEFT JOIN directors d ON d.id = m.director_id;
  `

  const { rows } = await pool.query(query)
  return rows
}

async function getMovie(id) {
  const subquery = `
  SELECT COALESCE(json_agg(g.name), '[]') 
  FROM movie_genres mg 
  JOIN genres g ON g.id = mg.genre_id 
  WHERE mg.movie_id = m.id
  `
  const query = `
  SELECT 
    m.id,m.title, m.year, m.runtime, m.description,  
    d.name AS director,
    (${subquery}) AS genres
  FROM movies m
  LEFT JOIN directors d ON d.id = m.director_id WHERE m.id=$1;
  `

  const { rows } = await pool.query(query, [id])
  return rows[0]
}

async function createMovie(
  title,
  year,
  genreIds,
  runtime,
  description,
  directorId,
) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const { rows } = await client.query(
      `INSERT INTO movies (title, year, runtime, description, director_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, year, runtime, description, directorId],
    )

    const movieId = rows[0].id
    const placeholders = genreIds.map((_, i) => `($1, $${i + 2})`).join(", ")
    const sql = `INSERT INTO movie_genres (movie_id, genre_id) VALUES ${placeholders}`
    await client.query(sql, [movieId, ...genreIds])

    await client.query("COMMIT")
    return await getMovie(movieId); 
  } catch (e) {
    await client.query("ROLLBACK")
    console.error("Error in createMovie transaction:", e)
    throw e
  } finally {
    client.release()
  }
}

async function updateMovie(
  id,
  title,
  year,
  genreIds,
  runtime,
  description,
  directorId,
) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const { rows } = await client.query(
      `UPDATE movies SET title=$2, year=$3, runtime=$4, description=$5, director_id=$6
       WHERE id=$1 RETURNING *`,
      [id, title, year, runtime, description, directorId],
    )
    if (rows.length === 0) throw new Error("Movie not found")

    await client.query("DELETE FROM movie_genres WHERE movie_id = $1", [id])

    if (genreIds && genreIds.length > 0) {
      const placeholders = genreIds.map((_, i) => `($1, $${i + 2})`).join(", ")
      const sql = `INSERT INTO movie_genres (movie_id, genre_id) VALUES ${placeholders}`
      await client.query(sql, [id, ...genreIds])
    }

    await client.query("COMMIT")
    return await getMovie(id); 
  } catch (e) {
    await client.query("ROLLBACK")
    console.error("Error in createMovie transaction:", e)
    throw e
  } finally {
    client.release()
  }
}

async function deleteMovie(id) {
  const { rows } = await pool.query(
    "DELETE FROM movies WHERE id = $1 RETURNING *;",
    [id],
  )
  return rows[0]
}

export default { getMovies, getMovie, createMovie, updateMovie, deleteMovie }
