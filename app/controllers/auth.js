let User = require('../models/users');
let config = require('../../config/config');
let { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');

const createToken = (id) =>{
    return jwt.sign({ id }, config.TOKENKEY,{
        algorithm: 'HS512',
        expiresIn: "20min"
    });
}

module.exports.view = function (req, res, next) {
    res.send('login');
}

module.exports.signIn = async function(req, res, next){
    console.log("before findOne");
    try{
        let sentPassword = req.body.hashed_password;
        let user = await User.findOne({"email" : req.body.email});
        console.log("after findOne");
        console.log(user);

        if((user === undefined || user === null) ){
            console.log("in if");
            res.status(200).json({ message: "User not found" });
            
            throw new Error("User does not exist.");
            
        }
        else{
            
        let hashedPassword = user.hashed_password;  
         
        console.log(hashedPassword);     
            console.log("in else");
            console.log("hashedPassword = "+ hashedPassword);
            console.log("sentPassword = "+sentPassword);
           if(hashedPassword == sentPassword){
            // res.status(200).json({ message: "Login successful" });
            
            const payload = {
                id: user._id,
                username: user.username
            }
            let token = createToken(payload.id);
            res.status(200).json({ token: token });
            res.json(req.body);

            return true;

           }
           if(user.password!=sentPassword){
            res.status(200).json({ message: "Login unsuccessful" });

            return false;

           }
        
        }
    }catch(err){

    }

}




module.exports.requireLogin = expressjwt({
    secret: config.TOKENKEY,
    algorithms: ['HS512'],
    userProperty: 'auth' 
});


