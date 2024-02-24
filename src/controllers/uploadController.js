const firebaseAdmin = require("../configs/firebase");
const bucket = firebaseAdmin.storage().bucket();
const multer = require("multer");
const upload = multer({
  limit: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

async function uploadImage(req, res) {
  const file = req.file;
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on("finish", () => {
    // 設定檔案的存取權限
    const config = {
      action: "read",
      expires: "12-31-2500",
    };

    blob.getSignedUrl(config, (err, imgUrl) => {
      res.send({
        imgUrl,
      });
    });
  });

  blobStream.on("error", (err) => {
    res.status(500).send("上傳失敗");
  });

  // 將檔案的 buffer 寫入 blobStream
  blobStream.end(file.buffer);
}

module.exports = { upload, uploadImage };
