// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SkinQuiz from './components/SkinQuiz';
import SkinAnalysis from './components/SkinAnalysis';
import Results from './components/Results';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<SkinQuiz />} />
      <Route path="/analysis" element={<SkinAnalysis />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
