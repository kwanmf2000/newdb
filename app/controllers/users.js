const Usermodel = require('../models/users');
let authController = require('../controllers/auth');


module.exports.list = async function (req, res, next) {
    try {
        let list = await Usermodel.find({}, '-hashed_password -salt');
        res.json(list);
    } catch (error) {
        next(error);
    }
}

module.exports.userByID = async function (req, res, next) {
    try {
        console.log(`/getu/${req.params.userID}`);
        const user = await Usermodel.findById(req.params.userID);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Send the user data in the response
        res.json({
            success: true,
            message: "User found by ID",
            user: user
        });
    } catch (error) {
        console.error("Error in search", error);
        res.status(500).send("Invalid search");
    }
}

module.exports.read = async function (req, res) {


    try {
        
        let userID = req.params.userID;
        let updatedUser = Usermodel(req.body);
        updatedUser._id = userID;

        let result = await Usermodel.updateOne({ _id: userID }, updatedUser);

        if (result.modifiedCount > 0) {
            res.json(
                {
                    success: true,
                    message: "User updated sucessfully."
                });
        }
        // Express will catch this on its own.
        else {
            throw new Error('User not updated. Are you sure it exists?')
        }

    }
    catch (error) {
        console.error("Error in update:", error);
        res.status(500).send("Invalid update");
    }

}

module.exports.create = async function (req, res, next) {
    try {
        let newUser = new Usermodel(req.body);
        // newUser.hashed_password = await hashPassword(newUser.hashed_password);

        console.log(newUser);


        let result = await Usermodel.create(newUser);
        res.json({
            success: true,
            message: "User created successfully.",
            user: result
        });
    } catch (error) {
        console.error("Cannot create user", error);
        res.status(500).send("Invalid user create");
    }
}

module.exports.remove = async function (req, res, next){
    try{
        console.log("/deleteu/:userID");
        const deleteUser = await Usermodel.findById(req.params.userID);
        if (!deleteUser) {
            return res.status(404).send("User not found");
        }

        console.log("====> Result: ", result);
        if (result.deletedCount > 0) {
            res.json(
                {
                    success: true,
                    message: "User deleted"
                }
            );
        } else {
            return res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error in delete:", error);
        res.status(500).send("Invalid delete");
    }
}

module.exports.hasAuthorization = async function(req, res, next){
    console.log("Payload", req.auth);
    let authorized = req.auth.id == req.params.userID;
    console.log(authorized);
    if(!authorized){
        return res.status('403').json(
            {
                success: false,
                message: "User is not authorized"
            }
        )
    }
    next();
}
module.exports.isAdmin = async function(req, res, next){
    console.log("Payload", req.auth);
    const user = await Usermodel.findById(req.auth.id);

    let isAdmin = user.admin;

    if(!isAdmin){
        return res.status('403').json(
            {
                success: false,
                message: "User is not authorized"
            }
        )
    }
    next();

}

module.exports.setAdmin = async function(req, res, next){
    const user = await Usermodel.findById(req.body.id);
    user.admin = true;
    if(user.admin){
        return res.status('403').json(
            {
                success: true,
                message: "User is now authorized as admin"
            });
    }
}
