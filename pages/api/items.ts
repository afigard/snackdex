import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("Connecting to the database...");
    const client = await pool.connect();

    console.log("Connected. Fetching data...");
    const result = await client.query("SELECT * FROM macros;");

    client.release();
    console.log("Data successfully fetched");

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
