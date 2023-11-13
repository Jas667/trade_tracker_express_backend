const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userFolderPath = path.join(
      __dirname,
      "..",
      "public",
      "userImageUploads",
      req.userId.toString()
    );

    fs.mkdir(userFolderPath, { recursive: true }, (err) => {
      if (err) throw err;
      cb(null, userFolderPath);
    });
  },
  filename: function (req, file, cb) {
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
    const uniqueFilename = `${Date.now()}-${uuidv4()}-${sanitizedFileName}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: fileFilter,
});

//for handling excel uploads in tradedetails

const excelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "excelUploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const excelFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only XLSX and CSV are allowed!"), false);
  }
};

const excelUpload = multer({
  storage: excelStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: excelFileFilter,
});

module.exports = { upload, excelUpload };
