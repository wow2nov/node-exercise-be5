import express from "express";
import { pool } from "./db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/movies", async (req, res) => {
  try {
    const genresParam = req.query.genres ? `%${req.query.genres}%` : null;
    // แก้ไขโค้ดให้สามารถกรองผลลัพธ์ด้วย Parameter ได้ข้างล่างนี้ 🔽🔽🔽
    const keywordsParam = req.query.keyword ? `%${req.query.keyword}%` : null;

    console.log("Query params", req.query);

    const result = await pool.query(
      `
      SELECT * FROM movies 
      WHERE (genres ILIKE $1 OR $1 IS NULL)  
	  AND (title ILIKE $2 OR $2 IS NULL)
      `,
      [genresParam, keywordsParam]
    );
    // แก้ไขโค้ดให้สามารถกรองผลลัพธ์ด้วย Parameter ได้ข้างบนนี้ 🔼🔼🔼

    return res.status(200).json({
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).json({
      message: "ไม่สามารถเชื่อมต่อ Database ได้",
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at ${port}`);
});
