const jwt = require("jsonwebtoken");
const handler = {};
handler.verifyJWT = async (req, res, next) => {
  console.log("call jwt");
  const token = req.header("authorisation");
  if (!token) {
    res.status(401).send({ message: "Unauthorised access" });
  }
  try {
    const selectedToken = token.split(" ")[1];
    const user = jwt.verify(
      selectedToken,
      process.env.SECRET_KEY_TOKEN,
      (err, decoded) => {
        if (err) {
          res.status(403).send({ message: "Invalid access" });
        }
        req.decoded = decoded;
        next();
      }
    );
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};

module.exports = handler;
