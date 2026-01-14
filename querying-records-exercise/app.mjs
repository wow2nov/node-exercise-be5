import express from "express";
import { pool } from "./db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/movies", async (req, res) => {
	
	 try {
	const result = await pool.query(`SELECT * FROM movies`);
	return res.status(200).json({
		data: result.rows,
	});
   } catch (error){
	return res.status(500).json({
		message : "ไม่สามารถเชื่อมต่อ Database ได้"
	}); 
   }
});

// 📍 **** สร้าง API เพื่อใช้ในการดูข้อมูลหนังแต่ละเรื่องด้วย movieId ตรงนี้ ****

app.get("/movies/:movieId", async (req, res)=>{
	try {
	const movieIdFromClient = req.params.movieId;
		const results = await pool.query(`SELECT * FROM movies WHERE movie_id = $1`,
		[movieIdFromClient]
	);

	if(!results.rows[0]) {
		return res.status(404).json({
		message:"Movie not found",
		});
	};

	return res.status(200).json({
		data : results.rows[0],
	});
	} catch (error) {
		return res.status(500).json({
		  message: "ไม่สามารถเชื่อมต่อ Database ได้",
		});

	}
});

app.listen(port, () => {
	console.log(`🚀 Server is running at ${port}`);
});
