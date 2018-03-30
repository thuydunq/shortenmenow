import { Router } from 'express';
import { ShortenURLController } from "../controllers/v1/ShortenURLController";

let v1Route = Router();

v1Route.route("/urls")
        .get(ShortenURLController.v1.getUserURL)
        .post(ShortenURLController.v1.createUserURL);

export default v1Route;