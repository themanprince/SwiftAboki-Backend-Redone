import Joi from "joi";

const signupRequestSchema = Joi.object({
    password: Joi.string().trim(true).required(),
    email: Joi.string().trim(true).required(),
    isVerified: Joi.boolean().required(), //users become verified after confirming emails
    fname: Joi.string().trim(true).required(),
    lname: Joi.string().trim(true).required(),
    mname: Joi.string().trim(true),
    gender: Joi.string().length(1).required()
    /*
    I'll ignore the country and other props for now
    until I have created their entity models
    */
});

export default signupRequestSchema;