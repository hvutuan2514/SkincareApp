import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

function Results() {
  const location = useLocation();
  const { formData } = location.state || { formData: {} };

  return (
    <ResultsContainer>
      <h2>Your Skincare Recommendations</h2>
      <p>Based on your {formData.skinType} skin type</p>
    </ResultsContainer>
  );
}

export default Results;
