import {Router} from "express";
import {createValidator} from "express-joi-validation";
//other kini
import {signup as signupSchema} from "../request-schemas";
import validateSignUpDetails from "../middlewares/validateSignUpDetails";
import signupController from "../controllers/signup";

const router = Router();
const validator = createValidator();

router.post("/signup", validator.body(signupSchema), validateSignUpDetails, signupController);

export default router;