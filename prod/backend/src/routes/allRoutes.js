const express=require('express')
const router=express.Router()
const { registerUser, loginUser, getAllUsers ,updateUser,deleteUser, getUserById} = require("../controllers/auth");
const {registerProduct,getAllProducts, deleteProductById, updateProduct, deleteProductImages}=require('../controllers/productsController');

//Routes for Auth
router.post('/registerUser',registerUser)
router.post('/loginUser',loginUser)
router.get('/getAllUsers',getAllUsers)
router.get('/getUserById/:id',getUserById)
router.put('/updateUser/:id',updateUser)
router.delete('/deleteUser/:id',deleteUser)

//Routes for products
router.post('/registerProduct',registerProduct)
router.get('/getAllProducts',getAllProducts)
router.delete('/deleteProduct/:id',deleteProductById)
router.put('/updateProduct/:id',updateProduct)
router.delete('/deleteImage/:id', deleteProductImages);

module.exports=router