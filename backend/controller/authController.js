const User = require("../models/user");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv")
dotenv.config()
async function userLogin(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.send("Invalid User!!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.send("Invalid Password!!");
  }
  
  const token = jwt.sign(
    {
      userid: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    },
  );

  res.json({
    message: "Login Successful",
    token,
  });
}

module.exports = { userLogin };
