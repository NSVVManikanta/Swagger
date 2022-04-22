const Joi = require('joi');


    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      });
    function authenticate(req,res,next){
          const dataToValidate = {
            username : req.body.username,
            password : req.body.password
          };
          const schemaerr1 = schema.validate(dataToValidate);
          if (schemaerr1.error) {
            return res.status(404).send(schemaerr1.error.message);
          } 
          next();
        };

  const schema1 = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    refresh_token : Joi.string().required(),
  });
   function refresh_token(req,res,next){
      const dataToValidate = {
        username : req.body.username,
        refresh_token : req.body.refresh_token
      };
      const schemaerr1 = schema1.validate(dataToValidate);
      if (schemaerr1.error) {
        return res.status(404).send(schemaerr1.error.message);
      } 
      next();
    };

    module.exports = {
        authenticate,refresh_token
    }
