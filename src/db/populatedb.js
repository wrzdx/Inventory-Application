#! /usr/bin/env node

import { Client } from "pg"
import "dotenv/config"

const SQL = `
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (255),
  year INT,
  genre VARCHAR (255),
  runtime INT,
  description TEXT,
  director varchar (255)
);
INSERT INTO movies 
VALUES (
  DEFAULT, 
  'Naruto', 
  2006, 
  'Anime', 
  24, 
  'Some boy with problems', 
  'Kishimoto' 
);
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
