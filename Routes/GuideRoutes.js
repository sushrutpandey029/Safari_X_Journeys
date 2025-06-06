import express from 'express'
const GuideRoute = express.Router();

GuideRoute.get('/',(req,res)=>{
    return res.send("hello guide how are")
});

export default GuideRoute;
