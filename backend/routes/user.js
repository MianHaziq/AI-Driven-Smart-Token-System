const express=require("express")
const router=express.Router();

const{createUser,readUser,readUserId,updateUser,deleteUserbyid}=require('../controller/userController')



router.post("/create", createUser);
router.get("/read", readUser);
router.get("/read/:id", readUserId);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUserbyid);

module.exports=router;
