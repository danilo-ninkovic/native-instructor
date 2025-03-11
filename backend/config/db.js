import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    console.log(`MongoDB Conected : ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(
      `Error prilikom connect MongoDB : ${error.message}`.red.underline.bold
    )
    process.exit(1)
  }
}
export default connectDB
