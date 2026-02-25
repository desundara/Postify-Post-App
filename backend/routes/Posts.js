const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");

const { validateToken } = require ("../middlewares/AuthMiddleware")

router.get("/", validateToken, async (req, res) => {
    try{
        const listOfPosts = await Posts.findAll({ include: [Likes] })
        const likedPosts = await Likes.findAll({where: { UserId: req.user.id }})
        res.json({listOfPosts: listOfPosts,  likedPosts: likedPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/byId/:id', async (req, res) => {
    const id  = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
});

router.get('/byUserId/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const posts = await Posts.findAll({ 
            where: { UserId: userId },
            include: [Likes] 
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user posts" });
    }
});

router.post("/title", validateToken, async (req, res) => {
    try {
        const { newTitle, id } = req.body;
        if (!newTitle || !id) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // ✅ Ownership check
        const post = await Posts.findByPk(id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.UserId !== req.user.id) return res.status(403).json({ error: "Not authorized" });

        await Posts.update({ title: newTitle }, { where: { id: id } });
        res.json({ title: newTitle }); 
    } catch (error) {
        console.error("Error updating title:", error);
        res.status(500).json({ error: "Failed to update title" });
    }
});

router.post("/postText", validateToken, async (req, res) => {
    try {
        const { newText, id } = req.body;
        if (!newText || !id) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // ✅ Ownership check
        const post = await Posts.findByPk(id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.UserId !== req.user.id) return res.status(403).json({ error: "Not authorized" });

        await Posts.update({ postText: newText }, { where: { id: id } });
        res.json({ postText: newText });
    } catch (error) {
        console.error("Error updating post text:", error);
        res.status(500).json({ error: "Failed to update post text" });
    }
});

router.post("/", validateToken, async (req, res) => {
    try {
        const post = req.body;
        post.username = req.user.username;
        post.UserId = req.user.id;
        const createdPost = await Posts.create(post);
        res.json(createdPost); 
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    try {
        // ✅ Ownership check - only post owner can delete
        const post = await Posts.findByPk(Number(postId));
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.UserId !== req.user.id) return res.status(403).json({ error: "Not authorized to delete this post" });

        await Posts.destroy({ where: { id: Number(postId) } });
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete post" });
    }
})

module.exports = router;
