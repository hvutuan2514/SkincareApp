// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SkinQuiz from './components/SkinQuiz';
import SkinAnalysis from './components/SkinAnalysis';
import QuizResults from './components/QuizResults';
import AnalysisResults from './components/AnalysisResults';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<SkinQuiz />} />
      <Route path="/analysis" element={<SkinAnalysis />} />
      <Route path="/quiz-results" element={<QuizResults />} />
      <Route path="/analysis-results" element={<AnalysisResults />} />
    </Routes>
  );
}

export default App;
