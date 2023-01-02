const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const email = req.body;
  console.log(req.body);
  console.log(email, "jwt email");
  const token = jwt.sign(email, process.env.SECRET_KEY_TOKEN);
  res.send({ token });
});

module.exports = router;
