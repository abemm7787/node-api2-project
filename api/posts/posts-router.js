// implement your posts router here
const Posts = require("./posts-model");

const router = require("express").Router();

router.get("/", (req, res) => {
  Posts.find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retriveing posts",
      });
    });
});

// array of all the post objects** contained in the database
router.get("/:id", async (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "The post information could not be retrieved",
        error: err,
      });
    });
});

router.post("/", async (req, res) => {
  try {
    const posted = req.body;
    if (!posted.title || !posted.contents) {
      res.status(400).json({
        message: "Please provide title and contents for the post",
      });
    } else {
   const {id} = await Posts.insert(posted);
    const newPosts =  await Posts.findById(id)
  res.status(201).json(newPosts);
    }
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the post to the database",
    });
  }


});


router.put("/:id", async (req, res) => {
  
    try {
       
        const checkIfexists = await Posts.findById(req.params.id)
          if (!checkIfexists) {
            res.status(404).json({message: "The post with the specified ID does not exist"});
          } 
         else if (!req.body.title || !req.body.contents){
          res.status(400).json({message:"Please provide title and contents for the post"})

         }
          else {
            await Posts.update(req.params.id, req.body)
            const checkPosts = await Posts.findById(req.params.id)
            res.status(200).json(checkPosts);
         
          }
      

    }
     catch (err) {
      console.log(err);
      res.status(500).json({
        message: "The post information could not be modified",
      });
    }
  } 
);

router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await Posts.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      err: err.message,
    });
  }
});

module.exports = router;

