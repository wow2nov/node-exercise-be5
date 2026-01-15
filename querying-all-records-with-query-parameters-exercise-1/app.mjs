import express from "express";
import { pool } from "./db.mjs";

const app = express();
const port = 4000;


app.use(express.json());

app.get("/movies", async (req, res) => {
	try {
	  const genresparams = req.query.genres || null;
  
	  const result = await pool.query(
		`SELECT * FROM movies WHERE ($1 IS NULL OR genres = $1)`,
		[genresparams]
	  );
  
	  return res.status(200).json({
		data: result.rows,
	  });
  
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({
		message: "ไม่สามารถเชื่อมต่อ Database ได้",
	  });
	}
  });
  

app.listen(port, () => {
  console.log(`🚀 Server is running at ${port}`);
});

