const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server up on", PORT));


app.use(express.json());
app.use(express.static('public'));

// CORS - תמיכה בפרונטנד
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api", require("./routers"));

const db = require('./db');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 