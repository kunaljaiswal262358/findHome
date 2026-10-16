import "./config/configuration.js";

import express from "express";
import { User, userSchema } from "./models/userModel.js";
import { joiErrorFormater } from "./utils/errorFormater.js";
import { createJWT } from "./utils/jwtUtility.js";
import { authenticate } from "./middleware/authentication.js";
import { connectDB } from "./db/connection.js";
import { isValidObjectId } from "mongoose";

connectDB();
const app = express();
app.use(express.json());

const port = process.env.PORT;
if (!port) console.error("Port is not configured.");

const router = express.Router();

router.post("/create", async (req, res, next) => {
  //mobile should be verified
  try {
    const { error } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorObject = joiErrorFormater(error);
      return res.status(400).json(errorObject);
    }

    const { name, username, phone, password, accountType } = req.body;
    const user = {
      name,
      username,
      contactNumber: phone,
      password,
      accountType,
    };
    console.log(user);
    const createdUser = await User.create(user);

    delete user.password;
    delete user.phone;
    const token = createJWT(user);
    res.status(201).json({ user: createdUser, token: token });
  } catch (error) {
    console.error("User Method=POST Error:" + error.message);
    next(error);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ Error: "Invalid search id" });

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ Error: "User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("User Method=GET Error:" + error.message);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  // CMS admin
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("User Method=GET Error:" + error.message);
    next(error);
  }
});

router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ Error: "Invalid search id" });

    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorObject = joiErrorFormater(error);
      return res.status(400).json(errorObject);
    }

    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ Error: "User not found!" });
    }

    const { name, username, phone, password, accountType } = req.body;
    user.name = name;
    user.username = username;
    user.contactNumber = phone;
    user.password = password;
    user.accountType = accountType;
    user.save();

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    console.error("User Method=PUT Error:" + error.message);
    next(error);
  }
});

//authenticate - user specific
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ Error: "Invalid search id" });

    const user = await User.findByIdAndDelete(id); //delete logic
    if (!user) {
      return res.status(400).json({ Error: "User not found!" });
    }

    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    onsole.error("User Method=DELETE Error:" + error.message);
    next(error);
  }
});

router.use((err, req, res, next) => {
  res.status(500).json({ Error: "Something went wrong." });
});

app.use("/api/users", router);

app.listen(port, () => {
  console.log("Server is running on port=" + port + ".");
});
