const express = require("express");
import * as cors from "cors";
const path = require("path");
import { v4 as uuid_v4 } from "uuid";
import { fireStore, rtdb } from "./db";
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const port = process.env.PORT || 3048;
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use(express.static(path.join(__dirname, "../dist")));

app.use(express.json());

const usersCollection = fireStore.collection("users");
const roomsCollection = fireStore.collection("rooms");

app.get("/env", async (req, res) => {
  res.json({
    enviroment: process.env.NODE_ENV,
  });
});

app.get("/history/:id", async (req, res) => {
  const roomSnapshot = await roomsCollection.doc(req.params["id"]).get();
  roomSnapshot.data();
  if (roomSnapshot.exists === false) return res.status(201).json({ history: "createDashboard" });
  if (roomSnapshot.exists === true) return res.status(200).json({ history: roomSnapshot.data() });
});

app.post("/history/save/:id", async (req, res) => {
  const scoreboard = await req.body;

  const snapshot = await roomsCollection.doc(req.params["id"]).get();
  const roomRef = roomsCollection.doc(req.params["id"]);

  if (snapshot.exists) {
    await roomRef.update({ scoreboard });
    res.status(202).json({ message: "updated" });
  } else return res.status(404).json({ message: "room not found" });
});

app.post("/auth", async (req, res) => {
  const data = req.body;
  const obj = {
    name: data.gameState.name,
    scoreboard: data.scoreboard,
  };
  const chekingIfUserExists = await usersCollection.where("name", "==", obj.name).get();
  if (chekingIfUserExists.empty === false) {
    chekingIfUserExists.forEach((doc) => {
      return res.status(200).json({ usrId: doc.id });
    });
  }

  if (chekingIfUserExists.empty === true) {
    const newUserIdRef = await usersCollection.add(obj);

    res.json({ success: true, usrId: newUserIdRef.id });
  }
});

app.post("/rooms", async (req, res) => {
  const { gameState } = await req.body;
  const snapshot = await usersCollection.doc(await gameState.userId).get();
  if (snapshot.exists) {
    const uniqueId = uuid_v4();
    const roomRef = rtdb.ref("rooms/" + uniqueId);
    await roomRef.set({
      owner: gameState,
    });
    const publicRoomId = 10000 + Math.floor(Math.random() * 9999);
    await roomsCollection.doc(publicRoomId.toString()).set({ rtdbId: roomRef.key, owner: gameState.userId });
    res.json({
      success: true,
      roomId: publicRoomId.toString(),
      privateRoomId: roomRef.key,
    });
  } else return res.status(401).json({ message: "unauthorized" });
});

app.post("/room/:id", async (req, res) => {
  const { gameState } = req.body;
  const userSnapshot = await usersCollection.doc(gameState.userId).get();
  const roomSnapshot = await roomsCollection.doc(gameState.roomPublicId).get();
  if (userSnapshot.exists === false) return res.status(401).json({ message: "Access denied, log in required" });
  if (userSnapshot.exists && roomSnapshot.exists === false) return res.status(404).json({ message: "Room not found" });
  if (userSnapshot.exists && roomSnapshot.exists) {
    const realTimeDbId = roomSnapshot.data();
    return res.json({ success: true, privateId: realTimeDbId.rtdbId });
  }
});

app.post("/room/:id/join", async (req, res) => {
  const { gameState } = req.body;
  const userSnapshot = await usersCollection.doc(gameState.userId).get();
  const roomSnapshot = await roomsCollection.doc(gameState.roomPublicId).get();
  if (userSnapshot.exists === false) return res.status(401).json({ message: "Access denied, log in required" });
  if (userSnapshot.exists && roomSnapshot.exists === false) return res.status(404).json({ message: "Room not found" });
  if (userSnapshot.exists && roomSnapshot.exists) {
    const roomRef = rtdb.ref(`rooms/${gameState.roomPrivateId}`);
    await roomRef.update({
      guest: gameState,
    });
    return res.json({ success: true });
  }
});

app.post("/room/:id/play", async (req, res) => {
  const { gameState } = req.body;
  const userSnapshot = await usersCollection.doc(gameState.userId).get();
  const roomSnapshot = await roomsCollection.doc(gameState.roomPublicId).get();
  if (userSnapshot.exists === false) return res.status(401).json({ message: "Access denied, log in required" });
  if (userSnapshot.exists && roomSnapshot.exists === false) return res.status(404).json({ message: "Room not found" });
  if (userSnapshot.exists && roomSnapshot.exists) {
    const roomRef = rtdb.ref(`rooms/${gameState.roomPrivateId}`);
    if (gameState.owner) {
      await roomRef.update({
        owner: gameState,
      });
      return res.json({ success: true });
    } else if (gameState.owner == false) {
      await roomRef.update({
        guest: gameState,
      });
      return res.json({ success: true });
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
