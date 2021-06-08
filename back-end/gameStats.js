const express = require("express");
const mongoose = require("mongoose");
const argon2 = require("argon2");

const router = express.Router();

//
// User schema and model
//

// This is the schema.
const gameStatSchema = new mongoose.Schema({
    gamesWon: Number,
    gamesLost: Number,
    wonScopas: Number,
    setebellos: Number,
});

const gameStats = mongoose.model("gameStatSchema", gameStatSchema);

module.exports = {
    model: gameStats,
    routes: router,
};