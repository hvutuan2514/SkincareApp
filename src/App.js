// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import styled from 'styled-components';

// Import components
import SkinQuiz from './components/SkinQuiz';
import Results from './components/Results';

const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.header`
  padding: 2rem;
  color: #2c3e50;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: 'Helvetica Neue', sans-serif;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #34495e;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header>
          <Title>Skincare Advisor</Title>
          <Subtitle>Discover your perfect skincare routine!</Subtitle>
        </Header>
        <Routes>
          <Route path="/" element={<SkinQuiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
