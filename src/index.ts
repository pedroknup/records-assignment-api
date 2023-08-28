import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(bodyParser.text());
app.use(bodyParser.urlencoded());

app.use('/', routes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
