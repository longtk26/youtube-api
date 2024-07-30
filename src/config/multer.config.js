import multer from "multer";

const storageDisk = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/");
  },

  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const storageMemory = multer.memoryStorage();

const upload = multer({ storage: storageMemory });

export default upload;
