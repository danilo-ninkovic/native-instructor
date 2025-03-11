// umjesto try-catch za async funkcije - errors se onda mogu podesiti kao custom "errorHandler" za sve
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"

//trigers in  "loginMaterialUIScreen-u" by fn "checkName" -userActions.js
//route....POST /api/users/login
//..........public acces
const checkUser = asyncHandler(async (req, res) => {
  // checking(by 'name') if User exists
  const { name } = req.body
  const user = await User.findOne({ name })
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      hasPassword: user.hasPassword,
      oneDevice: user.oneDevice,
      deviceId: user.deviceId,
    })
  } else {
    res.status(404)
    throw new Error("Korisnik nije pronađen ")
  }
})

//trigers in  "PasswordMaterialUiscreen-u" by fn "login" -userActions.js
//route....... POST /api/users/login/password
//.............. public acces
const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body
  // checking(by 'name')
  const user = await User.findOne({ name })
  // if User exists & if password is matched
  if (user && (await user.matchPassword(password))) {
    //matchPassword is  medhod in userSchema
    res.json({
      _id: user._id,
      name: user.name,
      type: user.type,
      poslovnica: user.poslovnica,
      usersAdmin: user.usersAdmin,
      upustvaAdmin: user.upustvaAdmin,
      upustvaMaker: user.upustvaMaker,
      viewedUpustva: user.viewedUpustva,
      /* also generate token (userShema method) */
      token: user.generateToken(),
    })
  } else {
    res.status(404)
    throw new Error("Pogrešna šifra - pokušajte ponovo ") //  middleware/errorMiddleware.js
  }
})

//trigers in  "PasswordMaterialUiscreen-u" by fn "registerPassword" -userActions.js
//route......PUT /api/users/pass/:id
//access........private
const registerUserPassword = asyncHandler(async (req, res) => {
  const { password, uuid } = req.body
  //find User by URL-id
  const user = await User.findById(req.params.id)
  // setting up with password, deviceId form req.body & hasPasword
  if (user) {
    user.password = password
    user.hasPassword = true
    user.deviceId = uuid

    const udatedUser = await user.save()

    res.json({
      _id: udatedUser._id,
      name: udatedUser.name,
      type: udatedUser.type,
      deviceId: udatedUser.deviceId,
      poslovnica: udatedUser.poslovnica,
      usersAdmin: udatedUser.usersAdmin,
      upustvaAdmin: udatedUser.upustvaAdmin,
      upustvaMaker: udatedUser.upustvaMaker,
    })
  } else {
    res.status(404)
    throw new Error("Problem prilikom logovanja - korisnik nije pronađen")
  }
})

// Register new User
//route.....POST /api/users
//access.....private/admin
const registerUser = asyncHandler(async (req, res) => {
  const {
    oneDevice,
    name,
    type,
    poslovnica,
    usersAdmin,
    upustvaMaker,
    adminsForUser,
    creator,
  } = req.body
  //checking(by name) if it currently exists
  const userExist = await User.findOne({ name })
  if (userExist) {
    res.status(400)
    throw new Error(`Korisnik ${name} već postoji`)
  }
  //if not currently exists
  const user = await User.create({
    oneDevice,
    name,
    type,
    poslovnica,
    usersAdmin,
    upustvaMaker,
    adminsForUser,
    creator,
    /*  password will be encripted & created at the first login */
  })
  /* if User create successfully send back object (created User) */
  if (user) {
    res.status(201).json({
      _id: user._id,
      oneDevice: user.oneDevice,
      name: user.name,
      type: user.type,
      poslovnica: user.poslovnica,
      usersAdmin: user.usersAdmin,
      upustvaMaker: user.upustvaMaker,
      adminsForUser: user.adminsForUser,
      creator: user.creator,
      hasPassword /* false  default */,
    })
  } else {
    res.status(400)
    throw new Error("ne ispravni podaci za User-a")
  }
})

//@desc.....Get all Users
//@route......GET /api/users
//access........private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}) //find all
  res.json(users)
})

//@desc.....Get  User by URL-id
//@route......GET /api/users/:id
//access........private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password") // don't use password to send back
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User nije pronadjen")
  }
})

//@desc.....Get  User by Departmens -
// returns Users who have any departmens from the logged in User -
// We will need for SingleUsers in Upustvo & UsersList
//@route......GET /api/users/departmens
//access........private
const getUsersByDepartmens = asyncHandler(async (req, res) => {
  const { departmens } = req.body

  const users = await User.find({ poslovnica: { $in: departmens } })
  /*If we want remain Users who don't have any departmens of loged User, then 
  const users = await User.find({ poslovnica: { $nin: departmens } })
  */
  if (users) {
    res.json(users)
  } else {
    res.status(404)
    throw new Error("Useri po Poslovnicama nisu pronađeni")
  }
})

//@desc.....update User
//@route......PUT /api/users/:id
//access........private
const updateUser = asyncHandler(async (req, res) => {
  const {
    oneDevice,
    name,
    type,
    poslovnica,
    usersAdmin,
    upustvaMaker,
    adminsForUser,
  } = req.body
  // find User by URL-id & setting up with new req.body parameters
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      oneDevice,
      name,
      type,
      poslovnica,
      usersAdmin,
      upustvaMaker,
      adminsForUser,
    },
    { new: true }
  )
  if (updatedUser) {
    res.json(updatedUser)
  } else {
    res.status(404)
    throw new Error("Korisnik nije pronadjen")
  }
})

//@desc.....Update loged user, for updating his viewedUpustva parameter
//@route......put /api/users/login
//access........public
const updateLoged = asyncHandler(async (req, res) => {
  const { id, vUpustva } = req.body
  const user = await User.findById(id)
  if (user) {
    user.viewedUpustva = vUpustva
    await user.save()
    res.json(user)
  } else {
    res.status(404)
    throw new Error("updade viewedUpustava nije uspjelo")
  }
})

//@desc.....Delete user by URL-id
//@route......DELETE  /api/users/:id
//access........private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id) //ID je u URL-u

  if (user) {
    await user.remove()
    res.json({ mesage: "Korisnik je obrisan" })
  } else {
    res.status(404)
    throw new Error("Ne postoji korisnik za brisanje")
  }
})

export {
  checkUser,
  registerUser,
  registerUserPassword,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getUsersByDepartmens,
  updateLoged,
}
