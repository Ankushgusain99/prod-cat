

import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Box,
  Drawer,
  Tooltip,
  Typography,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { countries, productData } from "./Categories";
const ProductTable = ({username}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false); 
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSuperCategory, setSelectedSuperCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSuperCategoryId, setSelectedSuperCategoryId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productId, setProductId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [existing, setExisting] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  }


  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  // Handle superCategory change
  const handleSuperCategoryChange = (event) => {
    const selectedSuperCategoryName = event.target.value;
    setSelectedSuperCategory(selectedSuperCategoryName);

    // Find selected superCategory's categories by name now
    const foundSuperCategory = productData.find(
      (superCategory) => superCategory.name === selectedSuperCategoryName
    );
    setSelectedSuperCategoryId(foundSuperCategory._id);
    setCategories(foundSuperCategory?.categories || []);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSubCategories([]);
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    const selectedCategoryName = event.target.value;
    setSelectedCategory(selectedCategoryName);

    // Find selected category's subCategories by name now
    const foundCategory = categories.find(
      (category) => category.name === selectedCategoryName
    );
    setSelectedCategoryId(foundCategory._id);
    setSubCategories(foundCategory?.subCategories || []);
    setSelectedSubCategory("");
  };

  const handleSubCategoryChange = (event) => {
    const selectedSubCategoryName = event.target.value;

    // Find the selected subCategory object based on the name
    const foundSubCategory = subCategories.find(
      (subCategory) => subCategory.name === selectedSubCategoryName
    );

    setSelectedSubCategory(selectedSubCategoryName); // Store the name in the state
    setSelectedSubCategoryId(foundSubCategory._id); // Store the ID in the state
  };

  // Use useEffect to react to changes in selectedSubCategoryId
  useEffect(() => {
    if (selectedSubCategoryId) {
      setProductId(
        `${selectedSuperCategoryId}-${selectedCategoryId}-${selectedSubCategoryId}`
      );
      console.log(selectedSubCategoryId); // This will log the updated ID after the state update
    }
  }, [selectedSubCategoryId, selectedSuperCategoryId, selectedCategoryId]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/getAllProducts"
      );
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/deleteProduct/${productId}`
        
      );
      setProducts(products.filter((product) => product._id !== productId));
      alert("Deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle Edit click
  const handleEdit = (product) => {
    setSelectedProduct(product); 
    setExisting(product.uploadImage);
    setLoggedInUser(username);
    setOpenEditModal(true); 
  };

  useEffect(() => {
    if (selectedProduct) {
      console.log("Selected Product: ", selectedProduct); // This will log the correct value
    }
  }, [selectedProduct]);

  // Handle form change
  const handleChange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      [e.target.name]: e.target.value,
    });
  };

    const createFormData = () => {
    const formData = new FormData();

    // Append all product fields
    formData.append("superCategory", selectedSuperCategory);
    formData.append("category", selectedCategory);
    formData.append("subCategory", selectedSubCategory);
    formData.append("productIdPrefix", productId);
    formData.append("origin", selectedCountry);
    formData.append("addedBy", loggedInUser);

    // Append other fields from selectedProduct, except for the ones manually appended above
    const excludedKeys = [
      "superCategory",
      "category",
      "subCategory",
      "productIdPrefix",
      "origin",
      "addedBy",
      "images",
    ];

    Object.keys(selectedProduct).forEach((key) => {
      if (!excludedKeys.includes(key)) {
        // Skip already appended fields and 'images'
        formData.append(key, selectedProduct[key]);
      }
    });

    existing.forEach((file) => {
      console.log("prev", file);
      formData.append(`uploadImage`, file); // 'uploadImage' matches the field in your backend
    });
    selectedImages.forEach((file) => {
      formData.append(`uploadImage`, file); // 'uploadImage' matches the field in your backend
    });

    // Log all form data entries
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return formData;
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert file list to array
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };
  
  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const imageToDelete = existing[index]; // Get the image to delete
    const updatedExisting = existing.filter((_, i) => i !== index);
  
    // Call the API to remove the image from the backend
    fetch(`http://localhost:8000/api/v1/deleteImage/${selectedProduct._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrls: [imageToDelete] }), // Pass the image URL in the request body
    })
      .then((response) => {
        if (response.ok) {
          // If the delete operation succeeds, update the local state
          setSelectedImages(updatedImages);
          setExisting(updatedExisting);
        } else {
          console.error("Failed to delete the image from the backend");
        }
      })
      .catch((error) => {
        console.error("An error occurred while deleting the image:", error);
      });
  };
  
  const handleUpdate = async () => {
    try {
      const formData = createFormData(); // Get the FormData
  
      // Send the PUT request with FormData
      const response = await axios.put(
        `http://localhost:8000/api/v1/updateProduct/${selectedProduct._id}`, // Use backticks for interpolation
        formData, // Use formData here
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
  
      console.log(response.data);
      alert("Product updated successfully");
      setSelectedImages([]);
      setExisting([]);
      setOpenEditModal(false);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  

  return (
    <>
      <Box sx={{width:'200vh',overflow:'auto',backgroundColor:'#262626',margin: '30px 0px 0px 40px'}}>
        <Typography variant="h4" sx={{display:'flex',alignItems:'flex-start',color:'white',padding:'20px'}}>Product Database</Typography>
      </Box>
      <TableContainer
        sx={{
          maxHeight: '80vh',
          width: '200vh',
          marginBottom:'30px',
          marginLeft:'40px',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              {/* Display only the first 6 columns */}
              <TableCell sx={{ backgroundColor: "greenyellow", color: "black", borderLeft: "1px solid black" }}>Product Id</TableCell>
              <TableCell sx={{ backgroundColor: "greenyellow", color: "black", borderLeft: "1px solid black" }}>Product Name</TableCell>
              <TableCell sx={{ backgroundColor: "greenyellow", color: "black", borderLeft: "1px solid black" }}>Product Brand</TableCell>
              <TableCell sx={{ backgroundColor: "greenyellow", color: "black", borderLeft: "1px solid black" }}>Super Category</TableCell>
              <TableCell sx={{ backgroundColor: "greenyellow", color: "black", borderLeft: "1px solid black" }}>Category</TableCell>
              <TableCell sx={{ backgroundColor: "greenyellow", color: "black", borderLeft: "1px solid black" }}>Subcategory</TableCell>
              <TableCell sx={{ backgroundColor: "greenyellow", color: "black", borderLeft: "1px solid black" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ backgroundColor: "#333", color: "white" }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ backgroundColor: "#333", color: "white" }}>
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell sx={{ color: "white", backgroundColor: "#262626", borderLeft: "1px solid black" }}>
                    {String(index + 1).padStart(6, "0")}
                  </TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#262626", borderLeft: "1px solid black" }}>{product.productName}</TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#262626", borderLeft: "1px solid black" }}>{product.productBrand}</TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#262626", borderLeft: "1px solid black" }}>{product.superCategory}</TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#262626", borderLeft: "1px solid black" }}>{product.category}</TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#262626", borderLeft: "1px solid black" }}>{product.subCategory}</TableCell>
                  <TableCell sx={{ color: "white", backgroundColor: "#262626", borderLeft: "1px solid black" }}>
                    <IconButton onClick={() => handleDrawerOpen(product)}>
                      <VisibilityIcon style={{ color: "lightblue" }} />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      color="inherit"
                      onClick={() => handleEdit(product)}

                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="inherit"
                      onClick={() => handleDelete(product._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer component to show more details */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: '500px', padding: '20px' }}>
          {selectedProduct && (
            <>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Typography><strong>Product Name:</strong> {selectedProduct.productName}</Typography>
              <Typography><strong>Product Brand:</strong> {selectedProduct.productBrand}</Typography>
              <Typography><strong>Super Category:</strong> {selectedProduct.superCategory}</Typography>
              <Typography><strong>Category:</strong> {selectedProduct.category}</Typography>
              <Typography><strong>Subcategory:</strong> {selectedProduct.subCategory}</Typography>
              <Typography><strong>No. of Units:</strong> {selectedProduct.numberOfUnits}</Typography>
              <Typography><strong>Unit Weight:</strong> {selectedProduct.unitWeight}</Typography>
              <Typography><strong>Net Weight:</strong> {selectedProduct.netWeight}</Typography>
              <Typography><strong>Gross Weight:</strong> {selectedProduct.grossWeight}</Typography>
              <Typography><strong>Origin:</strong> {selectedProduct.origin}</Typography>
              <Typography><strong>Added By:</strong> {selectedProduct.addedBy}</Typography>
              <Typography><strong>Calories:</strong> {selectedProduct.calories}</Typography>
              <Typography><strong>Fat:</strong> {selectedProduct.fat}</Typography>
              <Typography><strong>Saturated Fat:</strong> {selectedProduct.saturatedFat}</Typography>
              <Typography><strong>Carbs:</strong> {selectedProduct.carbs}</Typography>
              <Typography><strong>Fibre:</strong> {selectedProduct.fibre}</Typography>
              <Typography><strong>Sugar:</strong> {selectedProduct.sugar}</Typography>
              <Typography><strong>Protein:</strong> {selectedProduct.protein}</Typography>
              <Typography><strong>Salt:</strong> {selectedProduct.salt}</Typography>
              <Typography><strong>Ingredients:</strong> {selectedProduct.ingredients}</Typography>
              <Typography><strong>Description:</strong> {selectedProduct.productDescription}</Typography>
              <Typography><strong>Origin:</strong> {selectedProduct.origin}</Typography>
              <Typography><strong>Added By:</strong> {selectedProduct.addedBy}</Typography>
              {/* Render other data */}
              <Box>
                <strong>Images:</strong>
                {selectedProduct.uploadImage && selectedProduct.uploadImage.length > 0 ? (
                  <Grid container spacing={1}>
                    {selectedProduct.uploadImage.map((image, index) => (
                      <Grid item xs={6} key={index}>
                        <img
                          src={image}
                          alt={`Product Image ${index}`}
                          style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography>No Images</Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </Drawer>


      {/* Edit Product Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Product Name"
                name="productName"
                value={selectedProduct.productName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Product Brand"
                name="productBrand"
                value={selectedProduct.productBrand}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Super Category</InputLabel>
                <Select
                  label="Super Category"
                  name="superCategory"
                  value={selectedSuperCategory} // This will be the name of the superCategory
                  onChange={handleSuperCategoryChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {productData.map((superCategory) => (
                    <MenuItem
                      key={superCategory._id}
                      value={superCategory.name}
                    >
                      {superCategory.name} {/* Store and display the name */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="category"
                  value={selectedCategory} // This will be the name of the category
                  onChange={handleCategoryChange}
                  disabled={!selectedSuperCategory} // Disable if no superCategory is selected
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category.name}>
                      {category.name} {/* Store and display the name */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Subcategory</InputLabel>
                <Select
                  label="Subcategory"
                  name="subCategory"
                  value={selectedSubCategory} // This will be the name of the subCategory
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategory} // Disable if no category is selected
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {subCategories.map((subCategory) => (
                    <MenuItem key={subCategory._id} value={subCategory.name}>
                      {subCategory.name} {/* Store and display the name */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                type="number"
                label="No. of Units"
                name="numberOfUnits"
                value={selectedProduct.numberOfUnits}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="si-units-label">SI Units</InputLabel>
                <Select
                  labelId="si-units-label"
                  name="siUnits"
                  value={selectedProduct.siUnits}
                  onChange={handleChange}
                  label="SI Units"
                >
                  <MenuItem value="Kilogram">Kilogram</MenuItem>
                  <MenuItem value="Litre">Litre</MenuItem>
                  <MenuItem value="Pieces">Pieces</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Unit Weight"
                name="unitWeight"
                value={selectedProduct.unitWeight}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Net Weight"
                name="netWeight"
                value={selectedProduct.netWeight}
                onChange={handleChange}
                readOnly
              />
              <TextField
                fullWidth
                margin="normal"
                label="Gross Weight"
                name="grossWeight"
                value={selectedProduct.grossWeight}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Product Description"
                name="productDescription"
                value={selectedProduct.productDescription}
                onChange={handleChange}
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Calories"
                name="calories"
                value={selectedProduct.calories}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">j</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fat"
                name="fat"
                value={selectedProduct.fat}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Saturated Fat"
                name="saturatedFat"
                value={selectedProduct.saturatedFat}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Carbs"
                name="carbs"
                value={selectedProduct.carbs}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Fibre"
                name="fibre"
                value={selectedProduct.fibre}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Sugar"
                name="sugar"
                value={selectedProduct.sugar}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Protein"
                name="protein"
                value={selectedProduct.protein}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Salt"
                name="salt"
                value={selectedProduct.salt}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Ingredients"
                name="ingredients"
                value={selectedProduct.ingredients}
                onChange={handleChange}
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="dietary-label">Dietary</InputLabel>
                <Select
                  labelId="dietary-label"
                  name="dietary"
                  value={selectedProduct.dietary}
                  onChange={handleChange}
                  label="dietary"
                >
                  <MenuItem value="Vegan">Vegan</MenuItem>
                  <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="Gluten Free">Gluten Free</MenuItem>
                  <MenuItem value="Lactose Free">Lactose Free</MenuItem>
                  <MenuItem value="Non Vegetarian">Non Vegetarian</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Storage"
                name="storage"
                value={selectedProduct.storage}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="country-label">Origin</InputLabel>
                <Select
                  labelId="country-label"
                  name="origin"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  label="Origin"
                >
                  {countries.map((country, index) => (
                    <MenuItem key={index} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Added By"
                name="addedBy"
                value={loggedInUser}
                InputProps={{ readOnly: true }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="ProductId Prefix"
                name="productIdPrefix"
                value={productId}
                disabled
              />

              <div>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="upload-images"
                  multiple
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-images">
                  <Button
                    variant="contained"
                    component="span"
                    color="primary"
                    style={{ marginLeft: "200px" }}
                  >
                    Upload Images
                  </Button>
                </label>
              </div>

              <div>
                {existing.length > 0 && (
                  <div>
                    <h4>Existing Images:</h4>
                    {existing.map((image, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <p>View</p>
                        <IconButton
                          color="secondary"
                          onClick={() => removeImage(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {selectedImages.length > 0 && (
                  <div>
                    <h4>Selected Images:</h4>
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <p>{image.name}</p>
                        <IconButton
                          color="secondary"
                          onClick={() => removeImage(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductTable;