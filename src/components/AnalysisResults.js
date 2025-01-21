// AnalysisResults.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { handleFilter, resetFilters } from '../utils/Filters';

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
`;

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
  position: relative;
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ProductCard = styled.a`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

function AnalysisResults() {
  const location = useLocation();
  const { analysisResults } = location.state || {};

  //Filter constants
  const [filteredProducts, setFilteredProducts] = useState(analysisResults?.products || []);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    return [...new Set([...finalMatchingIngredients, ...ingredientMatches])];
  };

  return (
    <ResultsContainer>
      <Section>
        <h2>Your Skin Analysis Results</h2>
        <div>
          <h3>Skin Type</h3>
          <p>{analysisResults?.skinType}</p>
          
          <h3>Detected Concerns</h3>
          {analysisResults?.concerns?.length > 0 ? (
            <ConcernsList>
              {analysisResults.concerns.map((concern, index) => (
                <ConcernItem key={index}>{concern.name}</ConcernItem>
              ))}
            </ConcernsList>
          ) : (
            <p>No concerns found. Your skin is clear!</p> //No concerns found.
          )}
        </div>
      </Section>

      <Section>
        <h2>Recommended Ingredients</h2>
        <IngredientList>
          {analysisResults?.ingredients?.map((ingredient, index) => (
            <Ingredient key={index}>{ingredient}</Ingredient>
          ))}
        </IngredientList>
      </Section>

      <Section>
        <h2>Recommended Products</h2>
        <FilterButton onClick={() => setIsFilterModalOpen(true)}>
          Filter By Price
        </FilterButton>

        <ProductGrid>
          {filteredProducts.map((product, index) => {
            const productIngredients = typeof product.clean_ingreds === 'string'
              ? product.clean_ingreds.replace(/[[\]']/g, '').split(', ').map(i => i.trim())
              : [];

            // Find the recommended ingredients in this recommended product (matched ingredients)
            const matchingIngredients = getMatchingIngredients(
              productIngredients,
              analysisResults.ingredients,
              product.product_name
            );

            return (
              <ProductCard 
                key={index}
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ProductName>{product.product_name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
                
                {matchingIngredients.length > 0 && (
                  <IngredientChipContainer>
                    {matchingIngredients.map((ingredient, idx) => (
                      <IngredientChip key={idx}>{ingredient}</IngredientChip>
                    ))}
                  </IngredientChipContainer>
                )}
              </ProductCard>
            );
          })}
        </ProductGrid>
      </Section>

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
              <ModalButton onClick={() => handleFilter(analysisResults.products, minPrice, maxPrice, setFilteredProducts, setIsFilterModalOpen, setErrorMessage)}>
                Apply
              </ModalButton>
              <ModalButton onClick={() => setIsFilterModalOpen(false)}>
                Cancel
              </ModalButton>
              <ModalButton 
                onClick={() => resetFilters(setMinPrice, setMaxPrice, setFilteredProducts, analysisResults.products, setIsFilterModalOpen, setErrorMessage)}
                style={{ backgroundColor: "#f44336" }}
              >
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

export default AnalysisResults;
