const router = require("express").Router();
const Car = require("../models/carservice.model");
const multer = require("multer");
const path = require("path");

// heelo

// image storage ---start
const storage = multer.diskStorage({
  destination: "./tmp",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
});
// image storage ---end

router.post("/insertcar", upload.array("images"), async (req, res) => {
  try {
    let images = [];
    for (let i = 0; i < req.files.length; i++) {
      images.push(`${process.env.IMG_URL}/tmp/${req.files[i].filename}`);
    }
    console.log(req.body);

    const carData = new Car({
      model: req.body.carmodel,
      price: req.body.price,
      images: images,
      phoneno: req.body.phoneno,
      userid: req.body.userid,
    });
    await carData.save();

    res.status(200).json({
      status: "ok",
      result: carData,
      message: "Car Added Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
