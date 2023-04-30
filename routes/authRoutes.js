const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController")
const bodyParser = require ('body-parser');
const cors = require ('cors');
// const { requireAuth } = require("../utls/authMiddleWare");

router.use (bodyParser.urlencoded ({extended: true}));
router.use (bodyParser.json ());
router.use (express.json ());
router.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true,

}))

router
.post("/register", authController.register)

// router
// .post("/login", authController.login)

module.exports = router