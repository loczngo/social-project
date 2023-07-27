const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();
//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.gensalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});
//DELETE
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.gensalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been removed");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account");
    }
  });
//LOGIN
//GET

router.get("/:id", async(req,res) => {
        try {
            const user = await User.findById(req.params.id);
            const {password,updatedAt,...other} = user._doc;
            res.status(200).json(other);
        } catch (err) {
            res.status(500).json(err)
        }


})
//FOLLOW

router.put("/:id/follow",async(req,res) => {
        if(req.body.userId !== req.params.id ){
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if(!user.follower.includes(req.body.userId)){
                await user.updateOne({$push:{follower:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.body.userId}});
                res.status(200).json("user has been followed");
                } else {
                res.status(403).json("you already follow this user")
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
             
            res.status(403),json("cant follow urself")
        }

})
//UNFOLLOW
module.exports = router;
