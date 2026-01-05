const express = require('express');
const app = express();
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use("/api", require("./routers"));

const db = require('./db');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 