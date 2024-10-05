const express = require('express');
const orchestraRoutes = require('./src/orchestra/routes');
const orchestraMemberRoutes = require('./src/orchestra_member/routes');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello World")
});

app.use('/api/orchestra', orchestraRoutes);
app.use('/api/orchestraMember', orchestraMemberRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));

