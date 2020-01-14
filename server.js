const express = require("express"); 
const dotenv = require("dotenv")
const db = require("./db")
const studentsRouter = require("./src/students/students");
dotenv.config()
const listEndpoints = require("express-list-endpoints");
const cors = require("cors")


const server = express() 
server.get("/", async (req, res) => {
    const response = await db.query("SELECT * FROM Students")
    res.send(response.rows)
})

const port = 7007; //port number can be changed but also in .env

server.use(express.json());
server.use(cors());
server.use('/students', studentRouter)//http://localhost:7007/students, http://localhost:7007/students/students_id/projects/projects_id


console.log(listEndpoints(server))
server.listen(port, () => { //port number and a callback, server run and listen to port
    console.log(`Howdy! Your Server is running on port ${port}`); //`${can change port number}`
});