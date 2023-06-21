require("dotenv").config();

import path from "path";
import fs from "fs";
import colors from "colors";
import connectDB from "./config/db";
connectDB();

import User from "./models/User";
import Room from "./models/Room";
import Member from "./models/Member";
import Message from "./models/Message";

// Sample data files
const users = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src", "_data", "users.json"),
    "utf8"
  )
);
const rooms = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src", "_data", "rooms.json"),
    "utf8"
  )
);
const messages = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src", "_data", "messages.json"),
    "utf8"
  )
);

const arg = process.argv[2];

if (arg === "i") {
  importData();
} else if (arg === "d") {
  deleteData();
} else {
  console.log(`
Invlaid arg ❌

choose either 'i' or 'd'
args:
    i: Import sample data to database
    d: Delete all the data in the database
    `);
  process.exit(1);
}

async function importData() {
  try {
    await User.create(users);
    await Room.create(rooms);
    await Message.create(messages);

    console.log("Data imported ☑️".green.inverse);
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function deleteData() {
  try {
    await User.deleteMany();
    await Room.deleteMany();
    await Member.deleteMany();
    await Message.deleteMany();

    console.log("Data deleted ☑️".red.inverse);
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
