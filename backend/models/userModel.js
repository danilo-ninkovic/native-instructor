import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  poslovnica: { type: Array },
  type: { type: Array },
  password: { type: String },
  /* at the first login to determine if there is a password ,if not register it */
  hasPassword: {
    type: Boolean,
    default: false,
  },
  usersAdmin: { type: Boolean, default: false },
  upustvaMaker: { type: Boolean, default: false },
  adminsForUser: { type: Array }, //administratos for this User
  creator: { type: String }, //User who created this User
  date: {
    type: Date,
    default: Date.now,
  },
  deviceId: { type: String },
  oneDevice: { type: Boolean, default: true },
  viewedUpustva: { type: Array },
})

//func for generated token with id,  during login
// In userController is called   token: user.generateToken(),
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })
}

/*adding matchPassword method inside userSchema to check the match of the entered password (enteredPassword)
with the one encrypted in this.password base*/
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//add method to encrypt password automatically here in UserSchema
/*before saving it - "save"
 the entered password will be encrypted
 entered "password string will be hashed with a 10-salt"
 but this will only be done if the password has been sent,
  for example if the User is updated (modified), then the password will not be touched
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //if password is not modified move to next
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)

export default User
