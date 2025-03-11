import mongoose from "mongoose"

const upustvoSchema = mongoose.Schema({
  user: {
    //Upustvo creator  -name
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  isFinish: {
    type: Boolean,
    default: false,
  },
  type: { type: Array },
  poslovnice: { type: Array },
  singleUsers: { type: Array },
  administratori: { type: Array },
  naslov: { type: String },
  podnaslov: { type: String },
  logs: [
    {
      log: { type: String },
      code: { type: String },
      image: { type: String },
      video: { type: String },
      pdf: { type: String },
      // for text style
      logStyle: {
        color: { type: String },
        textDecoration: { type: String },
        fontWeight: { type: String },
      },
      accordion: {
        head: { type: String },
        details: { type: String },
      },
      changeTime: { type: Number },
      changeBy: { type: String },
    },
  ],
  createdAt: {
    type: Date,
  },
  editor: { type: String },
  editedAt: {
    type: Date,
  },
})

const Upustvo = mongoose.model("Upustvo", upustvoSchema)

export default Upustvo
