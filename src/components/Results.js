import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

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

function Results() {
  const location = useLocation();
  const { formData } = location.state || { formData: {} };

  const getRecommendedIngredients = () => {
    let ingredients = [];

    const skinTypeIngredients = {
      oily: [
        { name: 'Salicylic Acid', benefit: 'Unclogs pores and reduces oil production' },
        { name: 'Niacinamide', benefit: 'Controls oil production and reduces inflammation' },
        { name: 'Tea Tree Oil', benefit: 'Natural antibacterial properties' }
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

    if (formData.skinType) {
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

  return (
    <ResultsContainer>
      <Section>
        <h2>Your Skin Profile</h2>
        <UserProfile>
          <p><strong>Skin Type:</strong> {formData.skinType}</p>
          <p><strong>Skin Color:</strong> {formData.skinColor}</p>
          <p><strong>Sensitive Skin:</strong> {formData.isSensitive ? 'Yes' : 'No'}</p>
          <p><strong>Your Skin Concerns:</strong></p>
          <ConcernsList>
            {formData.skinConcerns.map((concern, index) => (
              <ConcernItem key={index}>{concern}</ConcernItem>
            ))}
          </ConcernsList>
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
    </ResultsContainer>
  );
}

export default Results;

