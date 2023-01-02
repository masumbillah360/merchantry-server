const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    const email = req.body;
    const token = jwt.sign(email, process.env.SECRET_KEY_TOKEN);
    res.send({ token });
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
