const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

mongoose
  .connect("mongodb://localhost:27017/forum", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Configure multer to store uploaded files in a "uploads" directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg"); // Store as a JPG file
  }
});

const upload = multer({ storage: storage });

const submissionSchema = new mongoose.Schema({
  productName: String,
  productSKU: String,
  quantity: Number,
  transactionType: String,
  contactEmail: String,
  sellingPrice: Number,
  timestamp: String,
  image: String // Store the filename of the uploaded image
});

const Submission = mongoose.model("Submission", submissionSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", upload.single("image"), async (req, res) => {
  const { productName, productSKU, quantity, transactionType, contactEmail, sellingPrice } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    const submission = new Submission({
      productName,
      productSKU,
      quantity,
      transactionType,
      contactEmail,
      sellingPrice,
      timestamp,
      image: req.file ? req.file.filename : null // Store the uploaded file's filename
    });

    await submission.save();
    res.redirect("/submissions");
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ timestamp: -1 });
    res.render("submissions.ejs", { submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
