const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require('../middlewares/AuthMiddleware');
const { sign } = require('jsonwebtoken');

// Register
router.post("/", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }
    
    try {
        const existingUser = await Users.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        
        const hash = await bcrypt.hash(password, 5);
        await Users.create({ username: username, password: hash });
        
        res.json({ message: "SUCCESS" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup failed" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Username or password required" });
        }

        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Wrong username and password combination" });
        }

        // ✅ Use JWT_SECRET from env
        const secret = process.env.JWT_SECRET || "importantSecret";
        const accessToken = sign(
            { username: user.username, id: user.id }, 
            secret
        );
        res.json({ 
            token: accessToken,
            username: user.username,
            id: user.id 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Get authenticated user info
router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;

    const basicinfo = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
    });

    if (!basicinfo) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(basicinfo);
});

// Change Password
router.put('/changepassword', validateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await Users.findOne({ where: { username: req.user.username } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: "Wrong password entered!" });
        }

        const hash = await bcrypt.hash(newPassword, 5);
        await Users.update(
            { password: hash }, 
            { where: { username: req.user.username } }
        );

        res.json({ message: "Password changed successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to change password" });
    }
});

module.exports = router;
