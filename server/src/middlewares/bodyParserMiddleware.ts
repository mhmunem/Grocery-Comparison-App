import bodyParser from 'body-parser';
import { Application } from 'express';

const bodyParserMiddleware = (app: Application) => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
};

export default bodyParserMiddleware;
