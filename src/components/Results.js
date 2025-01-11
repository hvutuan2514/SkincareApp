// Results.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import supabase from '../config/supabaseClient';

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

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; 
  margin-bottom: 15px;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; 
  border-radius: 4px;
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

const getRecommendedProducts = (ingredients) => {
  const productDatabase = {
    'Salicylic Acid': [
      {
        name: 'CeraVe Acne Control Cleanser',
        price: 14.24,
        image: 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/skincare/cleansers/acne-salicylic-acid-cleanser/acne-control-cleanser/desktop-700x785/acne-control-cleanser-packshot-desktop-700x785-v1.jpg?rev=85ca2b20496a42419b8ddf50200b483d&w=500&hash=3BB1AACFCDD161F5D9C9DD8E962E4860',
        link: 'https://www.cerave.com/skincare/cleansers/acne-salicylic-acid-cleanser',
        retailer: 'CeraVe'
      }
    ],
    'Niacinamide': [
      {
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        price: 6.00,
        image: 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwce8a7cdf/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png?sw=860&sh=860&sm=fit',
        link: 'https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html?dwvar_100436_size=30ml&quantity=1&gQT=1',
        retailer: 'The Ordinary'
      }
    ],
    // Add more products for other ingredients
  };

  let recommendedProducts = [];
  ingredients.forEach(ingredient => {
    if (productDatabase[ingredient.name]) {
      recommendedProducts = [...recommendedProducts, ...productDatabase[ingredient.name]];
    }
  });

  return recommendedProducts;
};

function Results() {
  const location = useLocation();
  const { formData } = location.state || { formData: {} };

  const getRecommendedIngredients = () => {
    let ingredients = [];

    const skinTypeIngredients = {
      oily: [
        { name: 'Salicylic Acid', benefit: 'Unclogs pores and reduces oil production' },
        { name: 'Niacinamide', benefit: 'Controls oil production and reduces inflammation' },
        { name: 'Tea Tree Oil', benefit: 'Natural antibacterial properties' },
        { name: 'Retinoid', benefit: 'Brightens skin and reduces fine lines' }
      ],
      dry: [
        { name: 'Hyaluronic Acid', benefit: 'Deeply hydrates and plumps skin' },
        { name: 'Ceramides', benefit: 'Strengthens skin barrier' },
        { name: 'Glycerin', benefit: 'Attracts and retains moisture' }
      ],
      combination: [
        { name: 'Niacinamide', benefit: 'Balances oil production' },
        { name: 'Alpha Hydroxy Acids', benefit: 'Gentle exfoliation' },
        { name: 'Peptides', benefit: 'Strengthens and repairs skin' }
      ],
      normal: [
        { name: 'Vitamin C', benefit: 'Brightens and protects' },
        { name: 'Peptides', benefit: 'Maintains skin health' },
        { name: 'Antioxidants', benefit: 'Protects from environmental damage' }
      ]
    };

    const concernIngredients = {
      'Acne': [
        { name: 'Benzoyl Peroxide', benefit: 'Kills acne-causing bacteria' },
        { name: 'Azelaic Acid', benefit: 'Reduces inflammation and breakouts' }
      ],
      'Dark spots': [
        { name: 'Kojic Acid', benefit: 'Lightens dark spots' },
        { name: 'Vitamin C', benefit: 'Brightens and evens skin tone' }
      ],
      'Fine lines': [
        { name: 'Retinol', benefit: 'Reduces fine lines and wrinkles' },
        { name: 'Peptides', benefit: 'Boosts collagen production' }
      ],
      'Dryness': [
        { name: 'Squalane', benefit: 'Moisturizes without clogging pores' },
        { name: 'Shea Butter', benefit: 'Rich, nourishing moisturizer' }
      ]
    };

    if (formData.skinType && skinTypeIngredients[formData.skinType]) {
      ingredients = [...ingredients, ...skinTypeIngredients[formData.skinType]];
    }

    formData.skinConcerns.forEach(concern => {
      if (concernIngredients[concern]) {
        ingredients = [...ingredients, ...concernIngredients[concern]];
      }
    });

    if (formData.isSensitive) {
      ingredients = ingredients.filter(ing => 
        !['Retinol', 'Benzoyl Peroxide'].includes(ing.name)
      );
      ingredients.push(
        { name: 'Centella Asiatica', benefit: 'Calms and soothes sensitive skin' },
        { name: 'Allantoin', benefit: 'Gentle healing and soothing properties' }
      );
    }

    return ingredients;
  };

  const recommendedIngredients = getRecommendedIngredients();
  const recommendedProducts = getRecommendedProducts(recommendedIngredients);

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
              <strong>{ingredient.name}</strong>: {ingredient.benefit}
            </Ingredient>
          ))}
        </IngredientList>
      </Section>
      
      <Section>
        <h2>Recommended Products</h2>
        <ProductSection>
          {recommendedProducts.map((product, index) => (
            <ProductCard key={index}>
              <ImageContainer>
                <ProductImage src={product.image} alt={product.name} />
              </ImageContainer>
              <h3>{product.name}</h3>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Retailer:</strong> {product.retailer}</p>
              <ProductLink href={product.link} target="_blank" rel="noopener noreferrer">
                Buy Now
              </ProductLink>
            </ProductCard>
          ))}
        </ProductSection>
      </Section>
    </ResultsContainer>
  );                                
}

export default Results;

