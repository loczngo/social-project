const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
const User = require("../models/User");
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post.userID === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("updated post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  const post = Post.findById(req.params.id);
  try {
    if (post.userId === req.body.userId) {
      await post.deleteOne();
    }
    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//update post
router.get("/", (req, res) => {
  console.log("post page");
});
//like
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("the post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("the post has been dissliked");
    }
  } catch (err) {
    console.log(err);
  }
});
//get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json("post not found");
  }
});

//timeline post
router.get("/timeline/:userId", async (req, res) => {
  // console.log(req.body);
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
       return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
