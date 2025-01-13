// Results.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { fetchIngredients, fetchRecommendedProducts } from '../utils/ConcernToProduct';

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

function Results() {
  const location = useLocation();
  const { formData } = location.state || { formData: {} };
  const [recommendedIngredients, setRecommendedIngredients] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        if (!formData) return;
  
        const { skinType, isSensitive, skinConcerns } = formData;
        console.log('Fetching ingredients for skinType:', skinType, '\nisSensitive:', isSensitive, '\nskinConcerns:', skinConcerns);
  
        // Map only "Blackheads" for now
        const formattedConcerns = skinConcerns
        ? skinConcerns.map(concern => (concern === 'Blackheads' ? 'blackhead' : concern))
        : [];

        console.log('Testing with formatted concerns:', formattedConcerns);

        // Fetching ingredients
        const ingredients = await fetchIngredients(
          skinType,
          isSensitive,
          skinConcerns,  
          {}  // Default to general subtypes
        );
        console.log('Fetched Ingredients:', ingredients);
  
        // Fetching recommended products
        const products = await fetchRecommendedProducts(ingredients);
        console.log('Fetched Recommended Products:', products);
  
        // Set the state with the fetched data
        setRecommendedIngredients(ingredients);
        setRecommendedProducts(products);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
  
    getRecommendations();
  }, [formData]);
  
  
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
        <ProductSection>
          {Object.entries(recommendedProducts).map(([ingredient, products]) => (
            <div key={ingredient}>
              <h3>Products with {ingredient}</h3>
              {products.map((product, index) => (
                <ProductCard key={index}>
                  <h3>{product.product_name}</h3>
                  <p><strong>Price:</strong> {product.price}</p>
                  <ProductLink href={product.product_url} target="_blank" rel="noopener noreferrer">
                    Buy Now
                  </ProductLink>
                </ProductCard>
              ))}
            </div>
          ))}
        </ProductSection>
      </Section>
    </ResultsContainer>
  );                                
}

export default Results;

