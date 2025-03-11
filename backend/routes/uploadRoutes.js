import path from "path"
import express from "express"
import asyncHandler from "express-async-handler"
import multer from "multer"

import { protect } from "../middleware/authMiddleware.js"

import pkg from "cloudinary"
import { FOLDER_CLOUDINARY } from "../backendUtils.js"

const cloudinary = pkg

const router = express.Router()

const storage = multer.diskStorage({})

//func for validation file type
function checkFileType(file, cb) {
  //expression od fileTypes
  const filetypes = /pdf|document|msword|docx|doc/
  //testing file type & mime type
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  //if true then return callback
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    // for false callback only for error "
    cb("Only  pdf or word document !")
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

/*T0 CLOUDINARY UPLOAD */
router.post(
  "/",
  protect,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    /* UPLOAD BY FILE TYPE (fileType), response is uploadFile.url */
    const fileType = req.file.mimetype.split("/")[0]

    /* declaring Word document */
    const word =
      req.file.originalname.endsWith(".docx") ||
      req.file.originalname.endsWith(".doc")
    const fileName = `${Date.now()}.docx`

    /* create pdf url */
    function convertToPdfUrl(rawUrl, version) {
      let imageUrl = rawUrl.replace("/raw/", "/image/")
      let newVersion = parseInt(version.substr(1)) + 1
      let newVersionString = "v" + newVersion.toString()
      let pdfUrl = imageUrl
        .replace("/" + version + "/", "/" + newVersionString + "/")
        .replace(".docx", ".docx.pdf")
      return pdfUrl
    }

    /*  fileType === "image"
      ? await cloudinary.v2.uploader.upload(
          `${req.file.path}`,
          {
            resource_type: "image",
            folder: "Omega-security",
            quality: "auto:eco",
          },
          function (error, result) {
            if (error) {
              console.log(error)
            } else {
              res.send(result.url)
            }
          }
        )
      : */
    word
      ? await cloudinary.v2.uploader.upload(
          `${req.file.path}`,
          {
            folder: FOLDER_CLOUDINARY,
            public_id: fileName,
            resource_type: "raw",
            raw_convert: "aspose",
          },
          function (error, result) {
            if (error) {
              console.log(error)
            } else {
              let pdfUrl = convertToPdfUrl(
                result.secure_url,
                `v${result.version}`
              )
              res.send(pdfUrl)
            }
          }
        )
      : /* fileType === "application" && !word  */ /* PDF */
        /* ? */ await cloudinary.v2.uploader.upload(
          `${req.file.path}`,
          { folder: FOLDER_CLOUDINARY },
          function (error, result) {
            if (error) {
              console.log(error)
            } else {
              res.send(result.url)
              /*  console.log(result.url) */
            }
          }
        )
    /*  : fileType === "video" && req.file.size < 90000000
      ? await cloudinary.v2.uploader.upload(
          `${req.file.path}`,
          {
            resource_type: "video",

            eager: [
              {
                format: "mp4",
                transformation: [
                  {
                    width: 160,
                    height: 100,
                    crop: "crop",
                    gravity: "south",
                    audio_codec: "none",
                  },
                  { quality: "auto:eco" },
                ],
              },
            ],

            folder: "Omega-security",
          },
          function (error, result) {
            if (error) {
              console.log(error)
            } else {
              res.send(result.url)
            }
          }
        ) */
    /*  : await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_large(
            `${req.file.path}`,
            {
              resource_type: "video",
              chunk_size: 6000000,

              eager: [
                {
                  format: "mp4",
                  transformation: [
                    {
                      width: 160,
                      height: 100,
                      crop: "crop",
                      gravity: "south",
                      audio_codec: "none",
                    },
                    { quality: "auto:eco" },
                  ],
                },
              ],

              folder: "Omega-security",
            },
            function (error, result) {
              if (error) {
                reject(error)
                console.log(error)
              }
              resolve(result.url)
              console.log(result)
            }
          )
        }) */
  })
)

router.delete("/", async (req, res) => {
  const file = req.body.file

  const Word = file.endsWith("docx.pdf")

  const public_id = file.split("/").pop().split(".")[0]

  const type = file.split("/")[4]

  async function deleteFiles() {
    const publicId = `${FOLDER_CLOUDINARY}/${public_id}.docx`

    try {
      await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: "raw",
      })
      /* console.log("Raw file deleted:", deleteRawResponse) */

      await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: "image",
      })
      /* console.log("PDF file deleted:", deletePdfResponse) */
    } catch (error) {
      console.error("Error while deleting raw & pdf files:", error)
    }
  }

  type === "video"
    ? await cloudinary.v2.uploader.destroy(
        `${FOLDER_CLOUDINARY}/${public_id}`,
        { resource_type: "video" },
        function (error, result) {
          if (error) {
            console.error("Error while deleting  Video file", error)
          } else {
            /*  console.log(`Video file ${public_id}  deleted`, result) */
          }
        }
      )
    : Word
    ? deleteFiles()
    : await cloudinary.v2.uploader.destroy(
        `${FOLDER_CLOUDINARY}/${public_id}`,

        function (error, result) {
          if (error) {
            console.error("Error while deleting Image(pdf)", error)
          } else {
            /* console.log(`Image(pdf) file ${public_id} deleted`, result) */
          }
        }
      )
})
//Delete all files when delete Upustvo
router.delete("/all", async (req, res) => {
  const filesforDelete = req.body.file
  const folder = FOLDER_CLOUDINARY

  const docxFiles = filesforDelete
    .filter((url) => url.includes(".docx"))
    .map((url) => {
      const parts = url.split("/")
      const fileNameWithExtension = parts[parts.length - 1]
      const fileName = fileNameWithExtension.split(".")[0]
      return `${folder}/${fileName}.docx`
    })
  const otherFiles = filesforDelete
    .filter((url) => !url.includes(".docx"))
    .map((url) => {
      const parts = url.split("/")
      const fileNameWithExtension = parts[parts.length - 1]
      const fileName = fileNameWithExtension.split(".")[0]
      return `${folder}/${fileName}`
    })
  const publicIds = [...docxFiles, ...otherFiles]
  const resourceTypes = ["image", "video", "raw"]

  /* Deleting for all resource_type-s  and for all publicId-s */
  async function deleteResources() {
    try {
      for (const resourceType of resourceTypes) {
        for (const publicId of publicIds) {
          await cloudinary.v2.api.delete_resources(publicId, {
            resource_type: resourceType,
          })
        }
        console.log(`Svi resursi tipa ${resourceType} su obrisani.`)
      }
      console.log("Svi resursi su uspješno obrisani.")
    } catch (error) {
      console.error("Greška prilikom brisanja resursa:", error)
    }
  }
  deleteResources()
})

export default router
