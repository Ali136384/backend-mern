import express from "express";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import PostsDB from "./models/PostsSchema.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressFileUpload from "express-fileupload";
// import cookieRoutes from "./routes/users.js";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cookieParser());

app.use(express.json());

app.use(cors()); // Replace with your client's domain

const allowedOrigins = ["https://ali-haseni.onrender.com"];
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use("/api/auth", authRoutes);
app.use("/api", postRoutes); 
app.use(expressFileUpload());
// app.use("/api", cookieRoutes);

// app.get("/test", (req, res) => {
//   res.setHeader("set-cookie", "user=rino");
//   res.send("Hello Ali");
// });

app.get("/api/data", async (req, res) => {
  try {
    const data = await PostsDB.find();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});



// Listen for the 'connected' event
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

// Listen for the 'error' event
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: " + err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(5000, () => {
  console.log("Connected to the Server!");
});
