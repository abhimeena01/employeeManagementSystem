import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'
import User from './models/User.js'


dotenv.config()

const userRegister = async () => {
  try {
    await connectToDatabase()

    const hashPassword = await bcrypt.hash("admin", 10)
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin"
    })

    await newUser.save()
    console.log("✅ Admin user created.")
    process.exit()
  } catch (error) {
    console.error("❌ Error creating user:", error)
    process.exit(1)
  }
}

userRegister()
