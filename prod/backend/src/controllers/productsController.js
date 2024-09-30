
const product = require('../models/products'); 
const cloudinary=require('cloudinary').v2


exports.registerProduct = async (req, res,next) => {
    try {
        const {
            productName,
            productBrand,
            superCategory,
            category,
            subCategory,
            numberOfUnits,
            siUnits,
            unitWeight,
            grossWeight,
            productDescription,
            calories,
            fat,
            saturatedFat,
            carbs,
            fibre,
            sugar,
            protein,
            salt,
            ingredients,
            dietary,
            storage,
            productIdPrefix,
            origin,
            addedBy
        } = req.body;

        let uploadImageUrls = [];

        const uploadedImages = req.files.uploadImage; // For multiple file uploads

        if (uploadedImages) {
            if (Array.isArray(uploadedImages)) {
                for (let i = 0; i < uploadedImages.length; i++) {
                    const uploadResult = await cloudinary.uploader.upload(uploadedImages[i].tempFilePath);
                    uploadImageUrls.push(uploadResult.secure_url);  
                }
            } else {
                const uploadResult = await cloudinary.uploader.upload(uploadedImages.tempFilePath);
                uploadImageUrls.push(uploadResult.secure_url);  
            }
        }
        console.log(uploadImageUrls)
        let netWeight = unitWeight * numberOfUnits;

        const newProduct = new product({
            productName,
            productBrand,
            superCategory,
            category,
            subCategory,
            numberOfUnits,
            siUnits,
            unitWeight,
            netWeight,
            grossWeight,
            productDescription,
            calories,
            fat,
            saturatedFat,
            carbs,
            fibre,
            sugar,
            protein,
            salt,
            ingredients,
            dietary,
            storage,
            productIdPrefix,
            origin,
            addedBy,
            uploadImage: uploadImageUrls 
        });

        await newProduct.save();

        return res.status(200).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};


exports.getAllProducts=async(req,res)=>{
    try {
        console.log("hello")
        const getProducts=await product.find()
        console.log(getProducts)
        console.log("hello")

        return res.status(200).json({
            success:true,
            data:getProducts,
            message:'All products fetched successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            data:"Data cannot be fetched",
            message:error.message
        })
    }
}

exports.deleteProductById=async(req,res)=>{
    try {
        console.log("hello")
        const{id}=req.params
        const deleteProduct=await product.findByIdAndDelete({_id:id})
        console.log(deleteProduct)
        return res.status(200).json({
            success:true,
            data:deleteProduct,
            message:'Product deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            data:'cannot fetched data',
            message:error.message
        })
    }
}



exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            productName,
            productBrand,
            superCategory,
            category,
            subCategory,
            numberOfUnits,
            siUnits,
            unitWeight,
            grossWeight,
            productDescription,
            calories,
            fat,
            saturatedFat,
            carbs,
            fibre,
            sugar,
            protein,
            salt,
            ingredients,
            dietary,
            storage,
            productIdPrefix,
            origin,
            addedBy,
        } = req.body;

        // Get the existing product and images
        const existingProduct = await product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const existingImageUrls = existingProduct.uploadImage || [];
        
        // Prepare new list of images
        let uploadImageUrls = [...existingImageUrls];

        // Handle new image uploads
        const uploadedImages = req.files?.uploadImage; // For multiple file uploads

        if (uploadedImages) {
            if (Array.isArray(uploadedImages)) {
                for (let i = 0; i < uploadedImages.length; i++) {
                    const uploadResult = await cloudinary.uploader.upload(uploadedImages[i].tempFilePath);
                    uploadImageUrls.push(uploadResult.secure_url);
                }
            } else {
                const uploadResult = await cloudinary.uploader.upload(uploadedImages.tempFilePath);
                uploadImageUrls.push(uploadResult.secure_url);
            }
        }

        // Calculate net weight (if needed in your product logic)
        const netWeight = unitWeight * numberOfUnits;

        // Update the product with the new data and uploaded images
        const updatedProduct = await product.findByIdAndUpdate(
            id,
            {
                productName,
                productBrand,
                superCategory,
                category,
                subCategory,
                numberOfUnits,
                siUnits,
                unitWeight,
                netWeight,
                grossWeight,
                productDescription,
                calories,
                fat,
                saturatedFat,
                carbs,
                fibre,
                sugar,
                protein,
                salt,
                ingredients,
                dietary,
                storage,
                productIdPrefix,
                origin,
                addedBy,
                uploadImage: uploadImageUrls, // Updated list of images
            },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

exports.deleteProductImages = async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrls } = req.body; // Array of image URLs to be deleted
  
      if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ message: 'No images provided for deletion' });
      }
  
      // Get the existing product
      const existingProduct = await product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Delete images from Cloudinary
      for (const imageUrl of imageUrls) {
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(publicId);
      }
  
      // Remove deleted images from product in the database
      const updatedProduct = await product.findByIdAndUpdate(
        id,
        {
          $pullAll: { uploadImage: imageUrls } // Remove image URLs from the array
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Images deleted successfully',
        product: updatedProduct
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error deleting images', error: error.message });
    }
  };





