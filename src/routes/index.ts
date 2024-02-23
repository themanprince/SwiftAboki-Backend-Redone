import {Router} from "express";
//other kini
import {signup as signupSchema} from "../request-schemas";
import validateSignUpDetails from "../middlewares/validateSignUpDetails";
import signupController from "../controllers/signup";

const router = Router();

router.post("/signup", validateSignUpDetails, signupController);

export default router;