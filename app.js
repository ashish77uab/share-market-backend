import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import tournamentRoutes from "./routes/tournament.js";
import matchRoutes from "./routes/match.js";
import teamRoutes from "./routes/team.js";
import userTeamRoutes from "./routes/userTeam.js";
import prizeRoutes from "./routes/prizePyramid.js";
import playerRoutes from "./routes/player.js";
import upload from "./middleware/upload.js";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("./public/uploads"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.set("view engine", "ejs");
app.set("views", "./views");
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// routes
app.use("/auth", userRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/match", matchRoutes);
app.use("/team", teamRoutes);
app.use("/match-team", userTeamRoutes);
app.use("/player", playerRoutes);
app.use("/prize",prizeRoutes);
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));


