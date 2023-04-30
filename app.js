const express = require ("express");
const authR = require("./routes/authRoutes")
require("dotenv").config()
const port  = process.env.PORT || 5050
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Welcome to Raven Bank")
})
app.use("/auth", authR)
// app.get("/auth", authR)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
