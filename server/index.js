require("dotenv").config();
const mongoRoutes = require("./mongo-routes/index.js");

const express = require("express");
const upload = require("./middleware/multer");
const cloudinary = require("./utils/cloudinary");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


app.use("/products", mongoRoutes.products)
// mọi request bắt đầu bằng /products sẽ được chuyển vào mongoRoutes.products
// /products      → router.get("/")
// /products/search → router.get("/search")
// /products/123  → router.get("/:id")

app.post("/upload", upload.single("file"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error",
      });
    }

    res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result,
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
