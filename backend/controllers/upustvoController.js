import asyncHandler from "express-async-handler"
// instsead  try-catch for async functoins
import Upustvo from "../models/upustvoModel.js"

//@ desc Fetch all upustva
//@ route POST /api/upustva
//@ acces  private
const getAllUpustva = asyncHandler(async (req, res) => {
  const { poslovnice, tipovi } = req.body

  /* get Upustva according to  "poslovnice" & "type" of loged User */
  const upustva_tipovi_poslovnica = await Upustvo.find(
    { poslovnice: { $in: poslovnice }, type: { $in: tipovi } },
    "isFinish user type administratori naslov podnaslov _id createdAt" //only sends this parameters to response
  ).sort({ createdAt: -1 }) //order from last added

  // Upustva with  finish:true
  const upustva_tipovi_poslovnica_finished = upustva_tipovi_poslovnica.filter(
    (upustvo) => upustvo.isFinish
  )

  //Upustva where loged User is in "singleUsers"
  const upustva_SingleUsers = await Upustvo.find({
    "singleUsers.name": `${req.user.name}`,
  })
  //Upustva where loged User is in "administratori"
  const upustva_Administrators = await Upustvo.find({
    "administratori.name": `${req.user.name}`,
  })
  /* Upustva where loged User is creator
If another 'administrator' deletes creator from SingleUsers , he will be abble to see Upustvo*/
  const myUpustva = await Upustvo.find({ user: req.user.name })

  // spread all three
  const upustva = [
    ...myUpustva,
    ...upustva_SingleUsers,
    ...upustva_Administrators,
    ...upustva_tipovi_poslovnica_finished,
  ]

  // spreaded ,filter to be  without duplicates & sort by latest first
  const unique = upustva
    .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
    .sort((a, b) => b.createdAt - a.createdAt)

  if (upustva || unique) {
    res.json(unique)
  } else {
    throw new Error("Upustva nisu pronađena")
  }
})

//@ desc Fetch single Upustvo by ID
//@ route GET /api/upustva/:id
//@ acces  private
const getUpustvoById = asyncHandler(async (req, res) => {
  const upustvo = await Upustvo.findById(req.params.id)
  if (upustvo) {
    res.json(upustvo)
  } else {
    res.status(404)
    throw new Error("Upustvo preko ID nije pronadjeno")
    // from middleware/errorMiddleware.js - errorHandler
  }
})

//@ desc Adding  new Upustvo
//@ route POST /api/upustva
//@ acces  private/admin
const addNovoUpustvo = asyncHandler(async (req, res) => {
  const {
    isFinish,
    type,
    poslovnice,
    singleUsers,
    administratori,
    naslov,
    podnaslov,
    logs,
  } = req.body
  const novoUpustvo = new Upustvo({
    user: req.user.name, // loged User will be the user(creator)
    isFinish,
    type,
    poslovnice,
    singleUsers,
    administratori,
    naslov,
    podnaslov,
    logs,
    createdAt: Date.now(),
  })

  await novoUpustvo.save()
  res.send("novo Upustvo je sačuvano")
})

//@ desc update current Upustvo
//@ route PUT /api/upustva
//@ acces  private/admin
const updateUpustvo = asyncHandler(async (req, res) => {
  const {
    isFinish,
    naslov,
    podnaslov,
    logs,
    type,
    poslovnice,
    singleUsers,
    administratori,
  } = req.body
  //find Upustvo by URL-id
  const upustvo = await Upustvo.findById(req.params.id)
  if (upustvo) {
    upustvo.isFinish = isFinish
    upustvo.naslov = naslov
    upustvo.podnaslov = podnaslov
    upustvo.logs = logs
    upustvo.type = type
    upustvo.poslovnice = poslovnice
    upustvo.singleUsers = singleUsers
    upustvo.administratori = administratori
    upustvo.editor = req.user.name
    upustvo.editedAt = Date.now()

    const updatedUpustvo = await upustvo.save()

    res.status(201).json(updatedUpustvo)
  } else {
    res.status(404)
    throw new Error("Upustvo za promjenu nije pronadjeno")
  }
})

//@desc delete Upustvo by  URL-id
//@route  DELETE /api/upustva/:id
//@acces   private/admin
const deleteUpustvo = asyncHandler(async (req, res) => {
  const upustvo = await Upustvo.findById(req.params.id)
  /* If we want the User to delete only his Upustva, 
  we would set the condition  -  if(req.user._id === upustvo.user._id) */
  if (upustvo) {
    await upustvo.remove()
    res.json({ mesage: "Upustvo obrisano" })
  } else {
    res.status(404)
    throw new Error("Upustvo nije pronađeno")
  }
})

export {
  getAllUpustva,
  getUpustvoById,
  addNovoUpustvo,
  deleteUpustvo,
  updateUpustvo,
}
