#! /usr/bin/env node

import { Client } from "pg"
import "dotenv/config"

const SQL = `
CREATE TABLE IF NOT EXISTS directors (
  id  INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (255),
  year INT,
  runtime INT,
  description TEXT,
  director_id INTEGER REFERENCES directors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO directors (name) VALUES 
('Martin Scorsese'), ('Vince Gilligan'), ('Guy Ritchie'), ('Christopher Nolan');

INSERT INTO genres (name) VALUES 
('Biography'), ('Comedy'), ('Crime'), ('Drama'), ('Thriller'), ('Action'), ('Sci-Fi'), ('Adventure');

INSERT INTO movies (title, year, runtime, description, director_id) VALUES 
('The Wolf of Wall Street', 2013, 180, 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime and corruption.', 1),
('Breaking Bad', 2008, 49, 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family''s future.', 2),
('The Gentlemen', 2019, 113, 'An American expat tries to sell off his highly profitable marijuana empire in London, triggering plots, schemes, bribery and blackmail in an attempt to steal his domain out from under him.', 3),
('Interstellar', 2014, 169, 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.', 4);

INSERT INTO movie_genres (movie_id, genre_id) VALUES 
(1, 1), (1, 2), (1, 3), -- Wolf: Bio, Comedy, Crime
(2, 3), (2, 4), (2, 5), -- Breaking Bad: Crime, Drama, Thriller
(3, 6), (3, 2), (3, 3), -- Gentlemen: Action, Comedy, Crime
(4, 7), (4, 4), (4, 8); -- Interstellar: Sci-Fi, Drama, Adventure
`

const connectionString = process.env.DATABASE_URL

async function main() {
  console.log("seeding...")
  const client = new Client({
    connectionString,
  })
  await client.connect()
  await client.query(SQL)
  await client.end()
  console.log("done")
}

main()
