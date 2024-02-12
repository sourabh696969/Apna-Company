const asyncHandler = require("express-async-handler");
const Admin = require("../model/adminModel");

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const adminEmail = await Admin.findOne(email);

  if (adminEmail) {
    res.status(401);
    throw new Error("Admin already exist with this email!");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  res.status(401).json({ message: "Admin Registered!", admin });
});

module.exports = {
    registerAdmin
}