// SkinAnalysis.js
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import styled from 'styled-components';
import supabase from '../config/supabaseClient';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const ImageUpload = styled.div`
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  margin-top: 20px;
  border-radius: 8px;
`;

const AnalysisContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  line-height: 1.6;
`;

const AnalysisText = styled.div`
  white-space: pre-line;
  color: #2c3e50;
  font-size: 16px;
`;

function SkinAnalysis() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSkin = async (imageFile) => {
    setLoading(true);
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    
    try {
      const { data: skinConcerns } = await supabase
        .from('skin_concerns')
        .select('name');
      
      const concernsList = skinConcerns.map(concern => concern.name).join(', ');
      
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Analyze this facial image and identify skin concerns from the following list: ${concernsList}. 
                       Provide a structured analysis in the following format:
                        Primary Concerns:
                        - [List main visible skin concerns]

                        Secondary Concerns:
                        - [List potential or less visible concerns]
                        
                        Do not change the font.`;
        
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]);
        
        const response = await result.response;
        setAnalysis(response.text());
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      analyzeSkin(file);
    }
  };

  return (
    <Container>
      <h2>Skin Analysis</h2>
      <ImageUpload>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          capture="user"
        />
        {image && <PreviewImage src={image} alt="Skin preview" />}
      </ImageUpload>
      
      {loading && <p>Analyzing your skin...</p>}
      {analysis && (
        <AnalysisContainer>
          <h3>Analysis Results</h3>
          <AnalysisText>
            {analysis}
          </AnalysisText>
        </AnalysisContainer>
      )}
    </Container>
  );
}

export default SkinAnalysis;
