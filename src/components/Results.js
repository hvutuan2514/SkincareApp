// Results.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { fetchIngredients, fetchRecommendedProducts } from '../utils/ConcernToProduct';
import { handleFilter, resetFilters } from '../utils/Filters';


const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
`;

/*
This code puts FilterButton NEXT TO "Recommended Products" instead of below
  position: absolute;
  top: 10px; 
  right: 10px; 
*/
const FilterButton = styled.button`
  margin-top: 10px; 
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
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

const ResultsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  position: relative; /* Ensure FilterButton is positioned relative to this container */
`;

const UserProfile = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ConcernsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const ConcernItem = styled.li`
  display: inline-block;
  margin: 5px;
  padding: 5px 10px;
  background: #e9ecef;
  border-radius: 15px;
  font-size: 0.9rem;
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Ingredient = styled.li`
  padding: 10px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 4px;
`;

const ProductCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProductSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const ProductLink = styled.a`
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  &:hover {
    background-color: #45a049;
  }
`;

const IngredientChipContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const IngredientChip = styled.div`
  background-color: #e9ecef;
  color: #495057;
  padding: 8px 12px;
  margin: 5px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  text-transform: capitalize;
`;

function Results() {
  const location = useLocation();
  const { formData } = location.state || { formData: {} };
  const [recommendedIngredients, setRecommendedIngredients] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]); // Changed from {} to []

  //Constants for filter
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        if (!formData) return;
  
        const { skinType, isSensitive, skinConcerns } = formData;
  
        const ingredients = await fetchIngredients(
          skinType,
          isSensitive,
          skinConcerns,
          {}
        );
  
        const products = await fetchRecommendedProducts(ingredients);
        setRecommendedIngredients(ingredients);
        setRecommendedProducts(products); // Ensure this is an array
        setFilteredProducts(products); // Initialize filtered list with all products
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
  
    getRecommendations();
  }, [formData]);



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
    <ResultsContainer>
      <Section>
        <h2>Your Skin Profile</h2>
        <UserProfile>
          <p><strong>Skin Type:</strong> {formData.skinType}</p>
          <p><strong>Skin Color:</strong> {formData.skinColor}</p>
          <p><strong>Sensitive Skin:</strong> {formData.isSensitive ? 'Yes' : 'No'}</p>
          <p>
            <strong>Your Skin Concerns:</strong>{" "}
            {formData.skinConcerns && formData.skinConcerns.length > 0 ? null : "None"} {/*No Skin Concerns = "None"*/}
          </p>
          {formData.skinConcerns && formData.skinConcerns.length > 0 && ( 
            <ConcernsList>  {/*Display Concerns*/}
              {formData.skinConcerns.map((concern, index) => (  
                <ConcernItem key={index}>{concern}</ConcernItem>
              ))}
            </ConcernsList>
          )}
          {formData.acneType && (
            <p><strong>Acne Type:</strong> {formData.acneType}</p>
          )}
        </UserProfile>
      </Section>

      <Section>
        <h2>Recommended Ingredients</h2>
        <IngredientList>
          {recommendedIngredients.map((ingredient, index) => (
            <Ingredient key={index}>
              {ingredient}
            </Ingredient>
          ))}
        </IngredientList>
      </Section>

      <Section>
        <h2>Recommended Products</h2>
        <FilterButton onClick={() => setIsFilterModalOpen(true)}>Filter By Price</FilterButton>

        <ProductSection>
        {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              const { product_name, price, clean_ingreds, product_url } = product;

              if (!product_name || !price || !clean_ingreds || !product_url) {
                console.warn(`Product missing required fields:`, product);
                return null;
              }

            // Parse the product's ingredients
            const productIngredients = clean_ingreds
              .replace(/[\[\]']/g, '')  // Clean up the ingredients string
              .split(', ')               // Split into array
              .map(i => i.trim());       // Trim whitespace

            // Check which recommended ingredients the recommended product contains (match)
            const matchingIngredients = getMatchingIngredients(productIngredients, recommendedIngredients, product_name);
            console.log(`Required Ingredients found in Recommended Product #${index + 1}:\n`, matchingIngredients);

            return (
              <ProductCard key={index}>
                <h3>{product_name}</h3>
                <p><strong>Price:</strong> {price}</p>

                {/* Display matching ingredients as circular chips */}
                {matchingIngredients.length > 0 && (
                  <IngredientChipContainer>
                    {matchingIngredients.map((ingredient, idx) => (
                      <IngredientChip key={idx}>{ingredient}</IngredientChip>
                    ))}
                  </IngredientChipContainer>
                )}

                <ProductLink href={product_url} target="_blank" rel="noopener noreferrer">
                  Buy Now
                </ProductLink>
              </ProductCard>
            );
          })
          ) : (
            <p>No products found.</p>
          )}
        </ProductSection>
      </Section>

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
              <ModalButton onClick={() => handleFilter(recommendedProducts, minPrice, maxPrice, setFilteredProducts, setIsFilterModalOpen, setErrorMessage)}>Apply</ModalButton>
              <ModalButton onClick={() => setIsFilterModalOpen(false)}>Cancel</ModalButton>
              <ModalButton onClick={() => resetFilters(setMinPrice, setMaxPrice, setFilteredProducts, recommendedProducts, setIsFilterModalOpen, setErrorMessage)} style={{ backgroundColor: "#f44336", color: "white" }}>
                Reset Filters
              </ModalButton>
            </div>

            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          </ModalContent>
        </ModalOverlay>
      )}
    </ResultsContainer>
  );
}

export default Results;
