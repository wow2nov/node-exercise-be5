import express from "express";
import { pool } from "./db.mjs";

const app = express();
const port = 4000;


app.use(express.json());
 
/// สร้าง API ด้วย HTTP Method GET ใช้สำหรับ "ดึงข้อมูล"
// /movies คือ endpoint
// req = ข้อมูลที่ client ส่งมา
// res = ข้อมูลที่ server จะส่งกลับไปให้ client
app.get("/movies", async (req, res) => {
	
  // try-catch ใช้ดัก error ที่อาจเกิดขึ้นระหว่างทำงาน
	try { 

	// รับค่า genres จาก query string
    // ถ้า client ไม่ส่ง genres มา ให้ค่าเป็น null
	  const genresparams = req.query.genres || null;

	// ส่งคำสั่ง SQL ไปที่ Database
    // result จะเก็บผลลัพธ์ที่ database ตอบกลับมา
	  const result = await pool.query(
		
	  // เลือกข้อมูลทั้งหมดจากตาราง movies
      // ถ้า genresparams เป็น null → ดึงทุกแถว
      // ถ้ามีค่า → ดึงเฉพาะแถวที่ genres ตรงกับค่า
		`SELECT * FROM movies WHERE ($1 IS NULL OR genres = $1)`,
		[genresparams]
	  );
  
	  // ส่งข้อมูลที่ได้จาก database กลับไปให้ client
	  return res.status(200).json({
		data: result.rows,
	  });
    // ถ้าเกิด error (เช่น database ล่ม)
	} catch (error) {
	  // ส่ง status 500 กลับไปบอก client ว่า server มีปัญหา
	  return res.status(500).json({
		message: "ไม่สามารถเชื่อมต่อ Database ได้",
	  });
	}
  });
  

app.listen(port, () => {
  console.log(`🚀 Server is running at ${port}`);
});

