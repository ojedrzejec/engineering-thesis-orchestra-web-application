const express = require('express');
const orchestraRoutes = require('./src/orchestra/routes');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send("Hello World")
});

app.use('/api/orchestra', orchestraRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));

