import { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { productData, countries } from "./Categories";
import Select from "@mui/material/Select";
import { Typography, IconButton, TextField, InputAdornment} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

//import CloudUploadIcon from '@mui/icons-material/CloudUpload';
//import { useLocation } from 'react-router-dom';

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [superCategory, setSuperCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [noOfUnits, setNoOfUnits] = useState("");
  const [siUnits, setSiUnits] = useState("");
  const [unitWeight, setUnitWeight] = useState("");
  const [netWeight, setNetWeight] = useState("0");
  const [grossWeight, setGrossWeight] = useState("");
  const [description, setDescription] = useState("");
  const [nutrition, setNutrition] = useState({
    calories: "",
    fat: "",
    saturatedFat: "",
    carbs: "",
    fibre: "",
    sugar: "",
    protein: "",
    salt: "",
  });
  const [ingredients, setIngredients] = useState("");
  const [dietary, setDietary] = useState("");
  const [storage, setStorage] = useState("");
  const [origin, setOrigin] = useState("");
  const [files, setFiles] = useState([]);
  const [productIdPrefix, setProductIdPrefix] = useState("");
  const location = useLocation();
  const data = location.state;

  const selectedSuperCategory =
    productData.find((sc) => sc._id === superCategory)?.name || "";
  const selectedCategory =
    productData
      .find((sc) => sc._id === superCategory)
      ?.categories.find((cat) => cat._id === category)?.name || "";
  const selectedSubCategory =
    productData
      .find((sc) => sc._id === superCategory)
      ?.categories.find((cat) => cat._id === category)
      ?.subCategories.find((sub) => sub._id === subCategory)?.name || "";
  // Load saved form data when the component mounts
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedProductForm"));
    if (savedData) {
      setProductName(savedData.productName);
      setProductBrand(savedData.productBrand);
      setSuperCategory(savedData.selectedSuperCategory);
      setCategory(savedData.selectedCategory);
      setSubCategory(savedData.selectedSubCategory);
      setNoOfUnits(savedData.numberOfUnits);
      setSiUnits(savedData.siUnits);
      setUnitWeight(savedData.unitWeight);
      setNetWeight(savedData.netWeight);
      setGrossWeight(savedData.grossWeight);
      setDescription(savedData.description);
      setNutrition(savedData.nutrition);
      setIngredients(savedData.ingredients);
      setDietary(savedData.dietary);
      setStorage(savedData.storage);
      setOrigin(savedData.origin);
      setFiles(savedData.files || []);
    }
  }, []);

  useEffect(() => {
    if (superCategory && category && subCategory) {
      setProductIdPrefix(`${superCategory}-${category}-${subCategory}`);
    }
  }, [superCategory, category, subCategory]);

  useEffect(() => {
    if (noOfUnits && unitWeight) {
      setNetWeight(noOfUnits * unitWeight);
    }
  }, [noOfUnits, unitWeight]);

  const handleFileChange = (e) => {
    // Append new files to the existing ones in the state
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleRemoveFile = (index) => {
    // Remove the file by index
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setNutrition({ ...nutrition, [name]: value });
  };

  const handleSave = () => {
    // Save the form data in local storage
    const formData = {
      productName,
      productBrand,
      selectedSuperCategory,
      selectedCategory,
      selectedSubCategory,
      noOfUnits,
      siUnits,
      unitWeight,
      netWeight,
      grossWeight,
      description,
      nutrition,
      ingredients,
      dietary,
      storage,
      origin,
      files,
    };
    localStorage.setItem("savedProductForm", JSON.stringify(formData));
    alert("Form saved! You can edit and submit later.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productBrand", productBrand);
    formData.append("superCategory", selectedSuperCategory);
    formData.append("category", selectedCategory);
    formData.append("subCategory", selectedSubCategory);
    formData.append("numberOfUnits", noOfUnits);
    formData.append("siUnits", siUnits);
    console.log(siUnits)
    formData.append("unitWeight", unitWeight);
    formData.append("netWeight", netWeight);
    formData.append("grossWeight", grossWeight);
    formData.append("productDescription", description);
    formData.append("calories", nutrition.calories);
    formData.append("fat", nutrition.fat);
    formData.append("saturatedFat", nutrition.saturatedFat);
    formData.append("carbs", nutrition.carbs);
    formData.append("fibre", nutrition.fibre);
    formData.append("sugar", nutrition.sugar);
    formData.append("protein", nutrition.protein);
    formData.append("salt", nutrition.salt);
    formData.append("ingredients", ingredients);
    formData.append("dietary", dietary);
    formData.append("storage", storage);
    formData.append("origin", origin);
    formData.append("productIdPrefix", productIdPrefix);
    formData.append("addedBy", data.info.name);
    files.forEach((file) => {
      console.log(file);
      formData.append("uploadImage", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/registerProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      if (response.status === 200) {
        console.log(response);
        alert("Product created successfully");
        localStorage.removeItem("savedProductForm"); // Clear saved form data after submission
        // Reset the form fields
        setProductName("");
        setProductBrand("");
        setSuperCategory("");
        setCategory("");
        setSubCategory("");
        setNoOfUnits("");
        setSiUnits("");
        setUnitWeight("");
        setNetWeight("0");
        setGrossWeight("");
        setDescription("");
        setNutrition({
          calories: "",
          fat: "",
          saturatedFat: "",
          carbs: "",
          fibre: "",
          sugar: "",
          protein: "",
          salt: "",
        });
        setIngredients("");
        setDietary("");
        setStorage("");
        setOrigin("");
        setProductIdPrefix("");
        setFiles([]);
      } else {
        alert("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("There was an error creating the product");
    }
  };

  const getCategories = (superCategoryId) => {
    const superCategoryData = productData.find(
      (data) => data._id === superCategoryId
    );
    return superCategoryData ? superCategoryData.categories : [];
  };

  const getSubCategories = (superCategoryId, categoryId) => {
    const superCategoryData = productData.find(
      (data) => data._id === superCategoryId
    );
    if (!superCategoryData) return [];
    const categoryData = superCategoryData.categories.find(
      (cat) => cat._id === categoryId
    );
    return categoryData ? categoryData.subCategories : [];
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });



  return (
    <>
      <Box sx={{width:'200vh',overflow:'auto',backgroundColor:'greenyellow',padding:'20px',marginLeft:'10px'}}>
        <Typography variant="h4" sx={{display:"flex",alignItems:"flex-start",paddingLeft:'140px'}} >Welcome to the RE-Search project</Typography>
        <Typography sx={{display:"flex",alignItems:"flex-start",paddingLeft:'140px'}}>Your work contributes to the world's largest Asian grocery database in Europe!</Typography>
      </Box>
      <Typography variant="h6" sx={{color:'white',display:'flex',alignItems:'flex-start',marginTop:'40px',paddingLeft:'30px'}}>Basic information</Typography>

      <Grid container spacing={2} paddingLeft="30px">
        <Grid item xs={4} marginTop='20px'>
          <TextField
            label="Product Name"
            variant="outlined"
            type="text"
            disableUnderline
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: '#FFFFFF' }, // Text color
            }}
            InputLabelProps={{
              style: { color: '#FFFFFF' }, // Label color
            }}
            placeholder="Product Name"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#656567', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#656567', // Border color on hover
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#FFFFFF', // Placeholder color
              },
            }}
          />
        </Grid>
        <Grid item xs={4} marginTop='20px'>
          <TextField
            label="Product Brand"
          
            type="text"
            value={productBrand}
            onChange={(e) => setProductBrand(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: '#FFFFFF' }, // Text color
            }}
            InputLabelProps={{
              style: { color: '#FFFFFF' }, // Label color
            }}
            placeholder="Product Brand"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#656567', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#656567', // Border color on hover
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#FFFFFF', // Placeholder color
              },
            }}
          />
        </Grid>
      </Grid>


      <Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
          
          <FormControl fullWidth>
  <Select
    value={superCategory}
    onChange={(e) => {
      setSuperCategory(e.target.value);
      setCategory(""); // Reset category and subcategory when supercategory changes
      setSubCategory("");
    }}
    displayEmpty // This will allow showing the placeholder when the value is empty
    sx={{
      color: 'white',
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: '#656567',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#656567',
      },
      '.MuiSvgIcon-root': {
        color: '#FFFFFF',
      },
    }}
  >
    {/* Placeholder item */}
    <MenuItem value="">
      Select Supercategory
    </MenuItem>

    {/* Dynamic productData options */}
    {productData.map((sc) => (
      <MenuItem key={sc._id} value={sc._id}>
        {sc.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </Grid>

        <Grid item xs={4} marginTop='20px'>
          <FormControl fullWidth>
          
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory(""); // Reset subcategory when category changes
              }}
              disabled={!superCategory}
              displayEmpty // This will allow showing the placeholder when the value is empty
    sx={{
      color: 'white',
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: '#656567',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#656567',
      },
      '.MuiSvgIcon-root': {
        color: 'white',
      },
    }}
            >
              {/* Placeholder item */}
    <MenuItem value="">
      Select Category
    </MenuItem>

              {getCategories(superCategory).map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4} marginTop='20px'>
          <FormControl fullWidth>
            <Select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!category}
              displayEmpty
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#656567',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#656567',
                },
                '.MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              {/* Placeholder item */}
    <MenuItem value="">
      Select Sub-Category
    </MenuItem>
              {getSubCategories(superCategory, category).map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      

      <Typography variant="h6" sx={{color:'white',display:'flex',alignItems:'flex-start',marginTop:'40px',paddingLeft:'30px'}}>Product Specifications</Typography>

      <Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
        <FormControl fullWidth>
      <select
        value={siUnits}
        onChange={(e) => {
          setSiUnits(e.target.value);
        }}
        style={{
          color:'white',
          borderColor: '#656567',
          backgroundColor:'#1A1A1A',
          height:'56px',
          borderRadius:'6px',
          padding:'0px 150px',
          outline:'none',
          fontFamily:'arial'
        }}
        // displayEmpty // Ensures that the placeholder is shown when value is empty
        // sx={{
        //   color: 'white',
        //   '.MuiOutlinedInput-notchedOutline': {
        //     borderColor: '#656567',
        //   },
        //   '&:hover .MuiOutlinedInput-notchedOutline': {
        //     borderColor: '#656567',
        //   },
        //   '.MuiSvgIcon-root': {
        //     color: 'white',
        //   },
        // }}
      >
        {/* Placeholder item */}
        <option value="">
          SI Unit
        </option>

        {/* Options */}
        <option value="Kilograms">Kilograms</option>
        <option value="Litres">Litres</option>
        <option value="Pieces">Pieces</option>
      </select>
    </FormControl>
        </Grid>
        <Grid item xs={4} marginTop='20px'>
          <TextField
            label="No. of units"
          
            type="text"
            value={noOfUnits}
            onChange={(e) => setNoOfUnits(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white' }, // Text color
            }}
            InputLabelProps={{
              style: { color: 'white' }, // Label color
            }}
            placeholder="Number of units"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#656567', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#656567', // Border color on hover
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#656567', // Placeholder color
              },
            }}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
          <TextField
            label="Unit Weight"
            variant="outlined"
            type="text"
            disableUnderline
            value={unitWeight}
            onChange={(e) => setUnitWeight(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white' }, // Text color
            }}
            InputLabelProps={{
              style: { color: 'white' }, // Label color
            }}
            placeholder="Unit Weight"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#656567', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#656567', // Border color on hover
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white', // Placeholder color
              },
            }}
          />
        </Grid>
        <Grid item xs={4} marginTop='20px'>
          <TextField
            label="Net Weight"
            variant="outlined"
            type="text"
            disableUnderline
            value={netWeight}
            onChange={(e) => setNetWeight(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white' }, // Text color
            }}
            InputLabelProps={{
              style: { color: 'white' }, // Label color
            }}
            placeholder="Net Weight"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#656567', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#656567', // Border color on hover
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white', // Placeholder color
              },
            }}
          />
        </Grid>
        <Grid item xs={4} marginTop='20px'>
          <TextField
            label="Gross Weight"
          
            type="text"
            value={grossWeight}
            onChange={(e) => setGrossWeight(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white' }, // Text color
            }}
            InputLabelProps={{
              style: { color: 'white' }, // Label color
            }}
            placeholder="Gross Weight"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#656567', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#656567', // Border color on hover
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white', // Placeholder color
              },
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ color: 'white',display:'flex',justifyItems:'center',marginTop:'40px',paddingLeft:'30px'}}>
      Nutritional Information(per 100g)
      </Typography>

      <Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="calories"
  label="Calories"
  variant="outlined"
  type="text"
  value={nutrition.calories}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[kJ or kCal]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Calories"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}
/>

        </Grid>
        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="fat"
  label="Fats"
  variant="outlined"
  type="text"
  disableUnderline
  value={nutrition.fat}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[g]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Fat"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}/>
        </Grid>
        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="saturatedFat"
  label="Saturated Fat"
  variant="outlined"
  type="text"
  disableUnderline
  value={nutrition.saturatedFat}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[g]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Saturated Fat"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}/>
        </Grid>
      </Grid>


      <Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="carbs"
  label="Carbs"
  variant="outlined"
  type="text"
  disableUnderline
  value={nutrition.carbs}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[g]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Carbs"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }} />
        </Grid>


        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="fibre"
  label="Fiber"
  variant="outlined"
  type="text"
  disableUnderline
  value={nutrition.fibre}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[g]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Fiber"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}/>
        </Grid>


        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="sugar"
  label="Sugar"
  variant="outlined"
  type="text"
  disableUnderline
  value={nutrition.sugar}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[g]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Sugar"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}/>
        </Grid>
      </Grid>


      <Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="protein"
  label="Protein"
  variant="outlined"
  type="text"
  disableUnderline
  value={nutrition.protein}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[g]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Protein"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}
          />
        </Grid>
        <Grid item xs={4} marginTop='20px'>
        <TextField
        name="salt"
  label="Salt"
  variant="outlined"
  type="text"
  disableUnderline
  value={nutrition.salt}
  onChange={handleNutritionChange}
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    endAdornment: (
      <InputAdornment position="end">
        <span style={{ color: 'white' }}>[g]</span> {/* Static text */}
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Salt"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" color="white" sx={{display:'flex',alignItems:'flex-start',marginTop:'40px',paddingLeft:'30px'}}>
            Ingredients
          </Typography>
      <textarea
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={{
                display:'flex',
                alignItems:'flex-start',
                backgroundColor: "#1A1A1A",
                color: "white",
                height: "100px",
                width: "65%",
                placeholder: "Type the ingredients here",
                marginLeft:'30px'
              }}
            />


          <Typography variant="h6" color="white" sx={{display:'flex',alignItems:'flex-start',marginTop:'40px',paddingLeft:'30px'}}>
            Description
          </Typography>
          <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                display:'flex',
                alignItems:'flex-start',
                backgroundColor: "#1A1A1A",
                color: "white",
                height: "100px",
                width: "65%",
                placeholder: "Type the description here",
                marginLeft:'30px'
              }}
            />

    
<Typography variant="h6" sx={{color:'white',display:'flex',alignItems:'flex-start',marginTop:'40px',paddingLeft:'30px'}}>Additional Information</Typography>

<Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
        <FormControl fullWidth>
      <Select
        value={dietary}
        placeholder="Dietary"
        onChange={(e) => {
          setDietary(e.target.value);
        }}
        displayEmpty // Ensures that the placeholder is shown when value is empty
        sx={{
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: '#656567',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#656567',
          },
          '.MuiSvgIcon-root': {
            color: 'white',
          },
        }}
      >
        {/* Placeholder item */}
        <MenuItem value="">
          Select Dietary
        </MenuItem>

        {/* Options */}
        <MenuItem value={"Vegan"}>Vegan</MenuItem>
        <MenuItem value={"Vegetarain"}>Vegetarian</MenuItem>
        <MenuItem value={"Lactose Free"}>Lactose Free</MenuItem>
        <MenuItem value={"Gluten Free"}>Gluten Free</MenuItem>
        <MenuItem value={"Non Vegetarian"}>Non Vegetarian</MenuItem>
      </Select>
    </FormControl>
      </Grid>

      <Grid item xs={4} marginTop='20px'>
          <TextField
            label="Storage Conditions"
          
            type="text"
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white' }, // Text color
            }}
            InputLabelProps={{
              style: { color: 'white' }, // Label color
            }}
            placeholder="Storage Conditions"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#656567', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#656567', // Border color on hover
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white', // Placeholder color
              },
            }}
          />
        </Grid>

        <Grid item xs={4} marginTop='20px'>
          
          <FormControl fullWidth>
  <Select
    value={origin}
    onChange={(e) => {
      setOrigin(e.target.value);
    }}
    displayEmpty // This will allow showing the placeholder when the value is empty
    sx={{
      color: 'white',
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: '#656567',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#656567',
      },
      '.MuiSvgIcon-root': {
        color: 'white',
      },
    }}
  >
    {/* Placeholder item */}
    <MenuItem value="">
      Select Origin
    </MenuItem>

    {countries.map((country, index) => (
                <MenuItem key={index} value={country}>
                  {country}
                </MenuItem>
              ))}
  </Select>
</FormControl>

        </Grid>
      

      </Grid>


      <Grid container spacing={2} paddingLeft='30px'>
        <Grid item xs={4} marginTop='20px'>
        <TextField
  label="Product Id Prefix"
  variant="outlined"
  type="text"
  disableUnderline
  value={productIdPrefix}
  readOnly
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Product Id Prefix"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}
          />
        </Grid>
        <Grid item xs={4} marginTop='20px'>
        <TextField
  label="Added By"
  variant="outlined"
  type="text"
  value={data.info.name}
  readOnly
  fullWidth
  InputProps={{
    style: { color: 'white' }, // Text color
    
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Label color
  }}
  placeholder="Salt"
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#656567', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#656567', // Border color on hover
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white', // Placeholder color
    },
  }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{color:'white',display:'flex',alignItems:'flex-start',marginTop:'40px',paddingLeft:'30px'}}>Attachments</Typography>
          <Button
            component="label"
            variant="contained"
            borderRadius={1}
            border="1px solid"
            bgcolor="neutral.800"
            borderColor="neutral.800"
            height="50px"
            sx={{
              backgroundColor: "#1A1A1A",
              color: "white",
              marginTop:'10px',
              marginRight:'1120px',
              paddingLeft:'30px',
              "&:hover": {
                backgroundColor: "#1A1A1A", // Prevent color change on hover
                boxShadow: "none",           // Prevent shadow on hover
              }
            }}
          >
            Upload
            <VisuallyHiddenInput
              type="file"
              multiple
              onChange={handleFileChange}
              name="uploadImage"
            />
          </Button>
      
      

      <Box display="flex" paddingLeft='30px' flexWrap="wrap" gap={2} width="100%" mt={2}>
        {files.map((file, index) => (
          <Box key={index} position="relative">
            <img
              src={URL.createObjectURL(file)} // Ensure that file is a valid File object here
              alt={`Preview ${index}`} // Corrected template literal
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onLoad={() => URL.revokeObjectURL(file)} // Clean up the object URL after it's loaded
            />
            <IconButton
              onClick={() => handleRemoveFile(index)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "red",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Grid
        container
      
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item sx={4}>
          <Button
            variant="contained"
            onClick={handleSave}
            style={{
              backgroundColor: "greenyellow",
              color: "black",
              marginLeft: "530px",
            }}
          >
            Save
          </Button>
        </Grid>
        <Grid item sx={4}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ backgroundColor: "greenyellow", color: "black", marginBottom: "20px" }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductForm;
