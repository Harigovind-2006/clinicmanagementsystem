const express = require("express")
const {loginUser} = require("../controller/authController")
const {authMiddleware} = require("../middleware/authMiddleWare")
const router = express.Router()
router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/profile", authMiddleware, (req, res) => {
    res.json(req.user);
});
router.post("/login",loginUser)

module.exports = router