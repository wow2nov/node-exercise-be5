import express from "express";
import { pool } from "./db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/movies", async (req, res) => {
	try {
		// แก้ไขโค้ดให้สามารถกรองผลลัพธ์ด้วย Parameter ได้ข้างล่างนี้ 🔽🔽🔽
		const genresParam = req.query.genres || null;
		const result = await pool.query(
			`
    SELECT * FROM movies
	WHERE ($1 IS NULL OR genres = $1)
    `,
			[genresParam]
		);

		if(result.rows.length === 0) {
			return res.status (404).json ({
				message : "movie not found",
			});
		};

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
