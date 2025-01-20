// SkinAnalysis.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import supabase from '../config/supabaseClient';
import Pica from 'pica'; // Image resizing
import { fetchIngredients, fetchRecommendedProducts } from '../utils/ConcernToProduct';
import { handleFilter, resetFilters } from '../utils/Filters';

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const FilterButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px; /* Adds space above the button */

  &:hover {
    background-color: #45a049;
  }
`;


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
  text-align: center;
`;

const ModalInput = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ModalButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 5px;
  &:hover {
    background-color: #45a049;
  }
`;


const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
`;

const GuideContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const GuideList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 8px 0;
    display: flex;
    align-items: center;
    
    &:before {
      content: "✓";
      color: #3498db;
      font-weight: bold;
      margin-right: 10px;
    }
  }
`;

const ImageUpload = styled.div`
  border: 3px dashed #3498db;
  padding: 30px;
  text-align: center;
  border-radius: 15px;
  margin-bottom: 30px;
  background: white;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2980b9;
    transform: translateY(-2px);
  }
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2980b9;
  }

  input {
    display: none;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const AnalysisContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const AnalysisSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 8px;
    margin-bottom: 15px;
  }
`;

const ConcernsList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 8px 0;
    display: flex;
    align-items: center;
    
    &:before {
      content: "•";
      color: #3498db;
      font-weight: bold;
      margin-right: 10px;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #3498db;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 18px;
  padding: 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductCard = styled.a`
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const ProductName = styled.h4`
  margin: 10px 0;
  color: #2c3e50;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  color: #3498db;
`;


const IngredientChipContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const IngredientChip = styled.div`
  background-color: #3498db;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  text-transform: capitalize;
`;



function SkinAnalysis() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [error, setError] = useState(null); 
  
  //Filter constants
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  //Indicates whether the scan just happened or not. Is set to false once the user adds a filter.
  const [rightAfterScan, setRightAfterScan] = useState(true); 
  useEffect(() => {
    if (minPrice || maxPrice) { // If the user inputs filter options, consider the filter used.
      setRightAfterScan(false); // Set right after scan to false when any filter is applied
    }
  }, [minPrice, maxPrice]);



  useEffect(() => {
    fetchSkinData();
  }, []);

  const fetchSkinData = async () => {
    const { data: types } = await supabase.from('skin_type').select('*');
    const { data: concerns } = await supabase.from('skin_concerns').select('*');
    setSkinTypes(types);
    setSkinConcerns(concerns);
  };

  const compressImage = async (file) => {
    const pica = new Pica();

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    const canvas = document.createElement('canvas');
    const maxDimension = 4096;

    const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const resultCanvas = await pica.resize(img, canvas);
    return new Promise((resolve) => {
      resultCanvas.toBlob(resolve, file.type, 0.9); // Adjust quality as needed
    });
  };

  const formatConcerns = (result) => {
    const concerns = [];
    skinConcerns.forEach(concern => {
      if (result[concern.api_key]?.value === 1) {
        concerns.push({ name: concern.name });
      }
    });
    return concerns;
  };
  

  const analyzeSkin = async (imageFile) => {
    setLoading(true);
    setError(null);  //Clear previous error msgs
    
    try {
      const formData = new FormData();
      formData.append('api_key', process.env.REACT_APP_FACEPP_API_KEY);
      formData.append('api_secret', process.env.REACT_APP_FACEPP_API_SECRET);
      formData.append('image_file', imageFile);

      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        formData.append('image_base64', base64Image);
      };

      const response = await fetch('https://api-us.faceplusplus.com/facepp/v1/skinanalyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Print the entire API response to the console 
      console.log('API Response:', data);
      
      if (data.error_message) {
        if (data.error_message === "NO_FACE_FOUND") {
          setError("No face found in the image. Please upload an image with a visible face.");
        } else {
          throw new Error(data.error_message);
        }
        return; 
      }

      const detectedSkinType = skinTypes.find(
        type => type.api_value === data.result.skin_type.skin_type
      );

      const detectedConcerns = formatConcerns(data.result);
      console.log("data result", data.result);
      console.log("Detected Concerns (Formatted): \n", detectedConcerns);
      console.log("Skin Concerns (Unformatted): \n", skinConcerns);

      const concernNames = detectedConcerns.map(concern => concern.name);
      
      const ingredients = await fetchIngredients(
        detectedSkinType.name,
        false, // Default to non-sensitive skin
        concernNames,
        {} // Default to general subtypes
      );

      const recommendedProducts = await fetchRecommendedProducts(ingredients);
      console.log("Recommended Products - Print: \n", recommendedProducts);
      console.log('Right after scan', rightAfterScan);

      setAnalysis({
        skinType: detectedSkinType?.name || 'Unknown',
        concerns: detectedConcerns,
        ingredients: ingredients,
        products: recommendedProducts
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysis(null);
      setError(error.message || "An error occurred during the analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    // Reset all fields from last analysis
    setImage(null);
    setAnalysis(null);
    setLoading(true);
    setError(null);

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      //Case: Image is too small
      img.onload = async () => {
        if (img.naturalWidth < 200 || img.naturalHeight < 200) {
          setError('The image is too small. Please upload an image bigger than 200x200 pixels.');
          return;
        }
  
        //Case: image is too big --> Pica compresses it
        const compressedFile = await compressImage(file);
        setImage(URL.createObjectURL(compressedFile));
        analyzeSkin(compressedFile);
      };
    }
  };
  
  // Function to find the recommended ingredients that the product contains
  const getMatchingIngredients = (productIngredients, requiredIngredients, productName) => {
    if (!Array.isArray(productIngredients) || !Array.isArray(requiredIngredients)) {
      return [];
    }
  
    const finalMatchingIngredients = [];
  
    // Crossreference ingredient to product Name
    requiredIngredients.forEach(ingredient => {
      if (productName.toLowerCase().includes(ingredient.toLowerCase())) {
        finalMatchingIngredients.push(ingredient); // Add the ingredient itself if the product name contains it
      }
    });
  
    // Crossreference ingredient to product Ingredients
    const ingredientMatches = requiredIngredients.filter(ingredient =>
      productIngredients.some(prodIngred =>
        prodIngred.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  
    // Combine both matches (name match and ingredient matches)
    return [...new Set([...finalMatchingIngredients, ...ingredientMatches])]; // Ensure no duplicates
  };


  return (
    <Container>
      <h2>AI Skin Analysis</h2>
      <GuideContainer>
        <h3>Tips for Best Results</h3>
        <GuideList>
          <li>Find good lighting - natural daylight works best</li>
          <li>Face the camera directly, keeping your face centered</li>
          <li>Remove glasses and pull hair away from your face</li>
          <li>Ensure your face is clean and makeup-free</li>
          <li>Keep your expression neutral</li>
          <li>Take photo at arm's length (about 12-18 inches away)</li>
          <li>Avoid shadows on your face</li>
        </GuideList>
      </GuideContainer>
      
      <ImageUpload>
        <UploadButton>
          Upload Your Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            capture="user"
          />
        </UploadButton>
        {image && <PreviewImage src={image} alt="Skin preview" />}
      </ImageUpload>
      
      {loading && !error && (
        <LoadingSpinner>
          Analyzing your skin...
        </LoadingSpinner>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && analysis && (
        <AnalysisContainer>
          <AnalysisSection>
            <h3>Your Skin Type</h3>
            <p>{analysis.skinType}</p>
          </AnalysisSection>
          
          <AnalysisSection>
            <h3>Detected Concerns</h3>
            {analysis.concerns.length === 0 ? (
            <p>No concerns found. Your skin is clear!</p> //No concerns found.
            ) : (
              <ConcernsList> {/*Else, list concerns */}
                {analysis.concerns.map((concern, index) => (
                  <li key={index}>{concern.name}</li>
                ))}
              </ConcernsList>
            )}
          </AnalysisSection>

          <AnalysisSection>
            <h3>Recommended Ingredients</h3>
            {analysis.ingredients?.length === 0 ? (
              <p>No specific ingredients recommended.</p>
            ) : (
              <ConcernsList>
                {analysis.ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ConcernsList>
            )}
          </AnalysisSection>

          <AnalysisSection>
            <h3>Recommended Products</h3>
            <FilterButton onClick={() => setIsFilterModalOpen(true)}>Filter By Price</FilterButton>
    
            <ProductGrid>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                // Parse product ingredients if they are a string
                console.log('Filtered products -- Right after scan', rightAfterScan);
                let productIngredients = [];
                if (typeof product.clean_ingreds === 'string') {
                  try {
                    const fixedIngredients = product.clean_ingreds.replace(/'/g, '"');
                    productIngredients = JSON.parse(fixedIngredients);
                  } catch (e) {
                    console.error('Error parsing ingredients:', e);
                  }
                }

                // Find the recommended ingredients in this recommended product (matched ingredients)
                const matchingIngredients = getMatchingIngredients(productIngredients, analysis.ingredients, product.product_name);
                console.log(`Required Ingredients found in Recommended Product #${index + 1}:\n`, matchingIngredients);

                return (
                  <ProductCard key={index} href={product.product_url} target="_blank" rel="noopener noreferrer">
                    <ProductName>{product.product_name}</ProductName>
                    <ProductPrice>{product.price}</ProductPrice>

                    {/* Display matching ingredients as circular chips */}
                    {matchingIngredients.length > 0 && (
                      <IngredientChipContainer>
                        {matchingIngredients.map((ingredient, idx) => (
                          <IngredientChip key={idx}>{ingredient}</IngredientChip>
                        ))}
                      </IngredientChipContainer>
                    )}
                  </ProductCard>
                );
              })
            ) : rightAfterScan ? (
              // Show all products if right after scan and no filtered products
            
              analysis.products.map((product, index) => {
                // Parse product ingredients if they are a string
                console.log('NO filtered products & Right after scan=true, show all products \n', rightAfterScan);
                let productIngredients = [];
                if (typeof product.clean_ingreds === 'string') {
                  try {
                    const fixedIngredients = product.clean_ingreds.replace(/'/g, '"');
                    productIngredients = JSON.parse(fixedIngredients);
                  } catch (e) {
                    console.error('Error parsing ingredients:', e);
                  }
                }

                // Find the recommended ingredients in this recommended product (matched ingredients)
                const matchingIngredients = getMatchingIngredients(productIngredients, analysis.ingredients, product.product_name);
                console.log(`Required Ingredients found in Recommended Product #${index + 1}:\n`, matchingIngredients);

                return (
                  <ProductCard key={index} href={product.product_url} target="_blank" rel="noopener noreferrer">
                    <ProductName>{product.product_name}</ProductName>
                    <ProductPrice>{product.price}</ProductPrice>

                    {/* Display matching ingredients as circular chips */}
                    {matchingIngredients.length > 0 && (
                      <IngredientChipContainer>
                        {matchingIngredients.map((ingredient, idx) => (
                          <IngredientChip key={idx}>{ingredient}</IngredientChip>
                        ))}
                      </IngredientChipContainer>
                    )}
                  </ProductCard>
                );
              })
            ) : (
              // Show 'No products found' if no filtered products and not right after scan
              console.log('NO filtered products, rightafterscan = FALSE', rightAfterScan),
              <p>No products found.</p>
            )}
          </ProductGrid>


          {/* Filter Modal */}
          {isFilterModalOpen && (
            <ModalOverlay onClick={() => setIsFilterModalOpen(false)}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <h3>Filter Products</h3>
                <ModalInput
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min Price"
                />
                <ModalInput
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max Price"
                />
                <div>
                  <ModalButton onClick={() => handleFilter(analysis.products, minPrice, maxPrice, setFilteredProducts, setIsFilterModalOpen, setErrorMessage)}>
                    Apply
                  </ModalButton>
                  <ModalButton onClick={() => setIsFilterModalOpen(false)}>Cancel</ModalButton>
                  <ModalButton onClick={() => resetFilters(setMinPrice, setMaxPrice, setFilteredProducts, analysis.products, setIsFilterModalOpen, setErrorMessage)} style={{ backgroundColor: "#f44336", color: "white" }}>
                    Reset Filters
                  </ModalButton>
                </div>

                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              </ModalContent>
            </ModalOverlay>
          )}
          </AnalysisSection>
        </AnalysisContainer>
      )}
    </Container>
  );
}

export default SkinAnalysis;
