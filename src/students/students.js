const express = require("express");
const db = require("../../../db")
const uuid = require('uuid')

const studentRouter = express.Router();

// EX3) Write a query to insert a new Student (Your name, your email, your surname, your date of birth)
// CREATE TABLE Students (
//     _id UUID PRIMARY KEY, ? entry for uuid 
//     name TEXT NOT NULL, 
//     surname TEXT NOT NULL, 
//     email TEXT NOT NULL,
//     dob DATE              ? entry for dob
// )
router.post('/', async (req, res) => {
    try{
        const result = await db.query(`INSERT INTO Students (_id, name, surname, email, dob)
                                       VALUES ($1, $2, $3, $4)
                                       RETURNING *`
                                       [ uuid(), req.body.name, req.body.title, req.body.email, req.body.dob ])
        res.send(result.rows[0])
    }
    catch(err) {
        res.status(500).send(err)
    }
}); 

    // EX4) Write a query to insert a new Project (one of the previously created project, insert your 
    //student ID as studentid)
    // CREATE TABLE Project (
    //     _id UUID PRIMARY KEY,      ? entry for uuid
    //     Name TEXT NOT NULL,
    //     Description TEXT NOT NULL,
    //     Creation Date DATE         ? entry for creation date vs dob kind of date
    //     RepoURL URL                ? entry for URLS
    //     LiveURL URL                ? entry for URLS
    //     StudentID                  ? Foreign Key from Students Table
    //    )

    //ht get Foreign Key from Students Table?
    router.post('/:studentID', async (req, res) => {
        try{
            const result = await db.query(`INSERT INTO Projects (_id, Name, Description, RepoURL, LiveURL, so_id)
                                           VALUES ($1, $2, $3, $4)
                                           RETURNING *`
                                           [ req.body.uuid(), req.body.Name, req.body.Description, req.body.RepoURL, req.body.LiveURL, req.params.so_id])
            res.send(result.rows[0]);
        }
        catch(err) {
            res.status(500).send(err)
        }
    }); 


    //EX6) Write a query to update the second project you entered, changing name and LiveURL

    router.put("/:id", async (req, res) => {
        try {
            const result = await db.query(`UPDATE Project 
                                           SET Name = $1,
                                               LiveURL = $2 
                                           WHERE _id = $3`,
                                           [req.body.Name, req.body.LiveURL, req.params.id]);
            
            if (result.rowCount === 0)
                res.status(404).send("Check Your Project_id and Try Again!")
            else 
                res.send("Your Project has been Updated!")
        }
        catch(err) {
            res.status(500).send(err)
        }
    }); 

    //EX7) Write a query to select all the projects, specifying the student email too
    //how do you work with two dbs and get info from both?

    router.get("/:email", async (req, res) => {
        try {
            const projects = await db.query(`SELECT * FROM Students WHERE email = $1`, [req.params.email])
            if (projects.rowCount === 0)
                return res.status(404).send()
            else
                return res.send(projects.rows[0])
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    //EX8) Write a query to delete one of the two projects

router.delete("/:id", async (req, res) => {
    try {
        const result = await db.query(`DELETE FROM Projects WHERE _id = $1`, [req.params._id])

        if (result.rowCount === 0)
            res.status(404).send("not found")
        else
            res.send("Project Deleted")
    }
    catch (ex) {
        res.status(500).send(ex)
    }
});

    //EX10) Write a query to delete the second student

    router.delete("/:id", async (req, res) => {
        try {
            const result = await db.query(`DELETE FROM Students WHERE asin = $1`, [req.params._id])
    
            if (result.rowCount === 0)
                res.status(404).send("not found")
            else
                res.send("Student Deleted")
        }
        catch (ex) {
            res.status(500).send(ex)
        }
    })


module.exports = studentRouter;