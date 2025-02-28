const express = require("express");

const { upload } = require("../../helpers/cloudinary");
const {
  hanldeImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct
} = require("../../controllers/admin/products-controller");

const router = express.Router();

router.post("/upload-image", upload.single('my_file'), hanldeImageUpload);
router.post('/add',addProduct)
router.put('/edit/:id',editProduct)
router.delete('/delete/:id',deleteProduct)
router.get('/get',fetchAllProducts)
module.exports=router;