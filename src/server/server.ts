import express from 'express';
import path from 'path';
import apiRouter from './routes';

const app = express();
app.use(express.static('public'));
app.use(apiRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
  console.log(`Open http://localhost:${port} in your browser`);
});