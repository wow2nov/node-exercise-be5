import express from "express";
import { pool } from "./db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

//สร้าง GET API (Endpoint คือ movies , รอในการใช้ข้อมูล)
app.get("/movies", async (req, res) => {

  //ใช้ดัก error ถ้า query database พัง จะกระโดดไปที่ catch 
  try { 

// ประกาศตัวแปร genresParam เพื่อรับค่า genres ที่ client ส่งมาทาง URL
// หาก client ส่ง genres มา จะนำไปใช้กรองข้อมูล // แต่หากไม่ส่ง genres มา ค่าจะเป็น null และจะไม่ทำการกรองข้อมูล
    const genresParam = req.query.genres ? `%${req.query.genres}%` : null;

// ประกาศตัวแปร keywordsParam เพื่อรับค่า keyword ที่ client ส่งมาทาง URL
// หาก client ส่ง keyword มา จะนำไปใช้กรองข้อมูล // แต่หากไม่ส่ง keyword มา ค่าจะเป็น null และจะไม่ทำการกรองข้อมูล
    const keywordsParam = req.query.keyword ? `%${req.query.keyword}%` : null;

  //ประกาศ result มารอรับค่า ที่ติดต่อกับ SQL ในบรรทัดถัดไป 
    const result = await pool.query(


// เลือกข้อมูลทั้งหมดจากตาราง movies
// โดยกรองข้อมูลตามเงื่อนไขดังนี้:
// 1) ถ้า client ส่ง genres มา → ค้นหา genres แบบไม่สนตัวพิมพ์เล็ก–ใหญ่ (ILIKE)
//    ถ้าไม่ส่งมา (genresParam เป็น null) → ไม่กรองด้วย genres
// 2) ถ้า client ส่ง keyword (title) มา → ค้นหา title แบบไม่สนตัวพิมพ์เล็ก–ใหญ่ (ILIKE)
//    ถ้าไม่ส่งมา (keywordsParam เป็น null) → ไม่กรองด้วย title
      `
      SELECT * FROM movies 
      WHERE (genres ILIKE $1 OR $1 IS NULL)  
	  AND (title ILIKE $2 OR $2 IS NULL)
      `,
      //ค่าที่ไปแทน $1,$2 ตามลำดับ
      [genresParam, keywordsParam]
    );
   
//จะส่งกลับ สถานะ 200 สำเร็จ และอ่านค่า data คือข้อมูล movies ที่ถูกกรองแล้วจากฐานข้อมูล แล้วส่งกลับให้ client
    return res.status(200).json({
      data: result.rows,
    })

//แต่ถ้าหากเกิดข้อผิดพลาดระหว่างการทำงานกับฐานข้อมูล
  } catch (e) {
//จะส่งกลับสถานะ 500 ไม่สำเร็จ และอ่านค่า message: "ไม่สามารถเชื่อมต่อ Database ได้"
    return res.status(500).json({
      message: "ไม่สามารถเชื่อมต่อ Database ได้",
    });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server is running at ${port}`);
});

