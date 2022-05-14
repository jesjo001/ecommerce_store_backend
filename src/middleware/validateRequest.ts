 import {AnySchema} from 'yup';
 import {Request, Response, NextFunction } from "express";
 import log from '../logger'

 const validate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
     try{

        await schema.validate({
            body: req.body,
            query:req.query,
            params: req.params,
        }); 
        
        next()

     } catch(err){
         const newError = err as any; //stops typescript error 
         log.error(newError);
         return res.status(400).send(newError.error)
     }
 }

 export default validate