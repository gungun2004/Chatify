import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users

  {
    email: "reetusaini21@example.com",
    fullName: "Reetu Saini",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    fullName: "Simran",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    fullName: "Ava Wilson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },



  // Male Users
  
  {
    email: "william.clark@example.com",
    fullName: "Aman",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
 
  {
    email: "lucas.moore@example.com",
    fullName: "Gokul",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    fullName: "Mahavir",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },

];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();