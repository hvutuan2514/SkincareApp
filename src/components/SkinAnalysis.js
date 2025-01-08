// SkinAnalysis.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import supabase from '../config/supabaseClient';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
`;

const GuideContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const GuideList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 8px 0;
    display: flex;
    align-items: center;
    
    &:before {
      content: "✓";
      color: #3498db;
      font-weight: bold;
      margin-right: 10px;
    }
  }
`;

const ImageUpload = styled.div`
  border: 3px dashed #3498db;
  padding: 30px;
  text-align: center;
  border-radius: 15px;
  margin-bottom: 30px;
  background: white;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2980b9;
    transform: translateY(-2px);
  }
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2980b9;
  }

  input {
    display: none;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const AnalysisContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const AnalysisSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 8px;
    margin-bottom: 15px;
  }
`;

const ConcernsList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 8px 0;
    display: flex;
    align-items: center;
    
    &:before {
      content: "•";
      color: #3498db;
      font-weight: bold;
      margin-right: 10px;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #3498db;
  font-size: 18px;
`;

function SkinAnalysis() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);

  useEffect(() => {
    fetchSkinData();
  }, []);

  const fetchSkinData = async () => {
    const { data: types } = await supabase.from('skin_type').select('*');
    const { data: concerns } = await supabase.from('skin_concerns').select('*');
    setSkinTypes(types);
    setSkinConcerns(concerns);
  };

  const formatConcerns = (result) => {
    const concerns = [];
    skinConcerns.forEach(concern => {
      if (result[concern.api_key]?.value === 1) {
        concerns.push({ name: concern.name });
      }
    });
    return concerns;
  };

  const analyzeSkin = async (imageFile) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('api_key', process.env.REACT_APP_FACEPP_API_KEY);
      formData.append('api_secret', process.env.REACT_APP_FACEPP_API_SECRET);
      formData.append('image_file', imageFile);

      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        formData.append('image_base64', base64Image);
      };

      const response = await fetch('https://api-us.faceplusplus.com/facepp/v1/skinanalyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.error_message) {
        throw new Error(data.error_message);
      }

      const detectedSkinType = skinTypes.find(
        type => type.api_value === data.result.skin_type.skin_type
      );

      setAnalysis({
        skinType: detectedSkinType?.name || 'Unknown',
        concerns: formatConcerns(data.result)
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysis(null);
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
      <h2>AI Skin Analysis</h2>
      <GuideContainer>
        <h3>Tips for Best Results</h3>
        <GuideList>
          <li>Find good lighting - natural daylight works best</li>
          <li>Face the camera directly, keeping your face centered</li>
          <li>Remove glasses and pull hair away from your face</li>
          <li>Ensure your face is clean and makeup-free</li>
          <li>Keep your expression neutral</li>
          <li>Take photo at arm's length (about 12-18 inches away)</li>
          <li>Avoid shadows on your face</li>
        </GuideList>
      </GuideContainer>
      
      <ImageUpload>
        <UploadButton>
          Upload Your Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            capture="user"
          />
        </UploadButton>
        {image && <PreviewImage src={image} alt="Skin preview" />}
      </ImageUpload>
      
      {loading && (
        <LoadingSpinner>
          Analyzing your skin...
        </LoadingSpinner>
      )}
      
      {!loading && analysis && (
        <AnalysisContainer>
          <AnalysisSection>
            <h3>Your Skin Type</h3>
            <p>{analysis.skinType}</p>
          </AnalysisSection>
          
          <AnalysisSection>
            <h3>Detected Concerns</h3>
            <ConcernsList>
              {analysis.concerns.map((concern, index) => (
                <li key={index}>{concern.name}</li>
              ))}
            </ConcernsList>
          </AnalysisSection>
        </AnalysisContainer>
      )}
    </Container>
  );
}

export default SkinAnalysis;
