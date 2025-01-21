// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 40px;
`;

const OptionContainer = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  padding: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Option = styled(Link)`
  padding: 30px;
  background: #ffffff;
  border-radius: 15px;
  text-decoration: none;
  color: #2c3e50;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 280px;
  
  &:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
    background: #f8f9fa;
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }

  h2 {
    color: #3498db;
    margin-bottom: 15px;
  }

  p {
    color: #7f8c8d;
    line-height: 1.5;
  }
`;

function Home() {
  return (
    <PageContainer>
      <Title>Discover Your Perfect Skincare Routine</Title>
      <OptionContainer>
        <Option to="/skin-quiz">
          <h2>Skin Quiz</h2>
          <p>Answer specific questions about your skin</p>
        </Option>
        <Option to="/skin-analysis">
          <h2>AI Skin Analysis</h2>
          <p>Upload a photo for instant analysis</p>
        </Option>
      </OptionContainer>
    </PageContainer>
  );
}

export default Home;

