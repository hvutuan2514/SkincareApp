// SkinAnalysis.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import supabase from '../config/supabaseClient';
import Pica from 'pica'; // Image resizing
import { fetchIngredients, fetchRecommendedProducts } from '../utils/ConcernToProduct';

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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #3498db;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 18px;
  padding: 20px;
`;

function SkinAnalysis() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchSkinData();
  }, []);

  const fetchSkinData = async () => {
    const { data: types } = await supabase.from('skin_type').select('*');
    const { data: concerns } = await supabase.from('skin_concerns').select('*');
    setSkinTypes(types);
    setSkinConcerns(concerns);
  };

  const compressImage = async (file) => {
    const pica = new Pica();

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    const canvas = document.createElement('canvas');
    const maxDimension = 4096;

    const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const resultCanvas = await pica.resize(img, canvas);
    return new Promise((resolve) => {
      resultCanvas.toBlob(resolve, file.type, 0.9); // Adjust quality as needed
    });
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
    setError(null);  //Clear previous error msgs
    
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

      // Print the entire API response to the console 
      console.log('API Response:', data);
      
      if (data.error_message) {
        if (data.error_message === "NO_FACE_FOUND") {
          setError("No face found in the image. Please upload an image with a visible face.");
        } else {
          throw new Error(data.error_message);
        }
        return; 
      }

      const detectedSkinType = skinTypes.find(
        type => type.api_value === data.result.skin_type.skin_type
      );

      const detectedConcerns = formatConcerns(data.result);
      console.log("data result", data.result);
      console.log("Detected Concerns (Formatted): \n", detectedConcerns);
      console.log("Skin Concerns (Unformatted): \n", skinConcerns);

      const concernNames = detectedConcerns.map(concern => concern.name);
      
      const ingredients = await fetchIngredients(
        detectedSkinType.name,
        false, // Default to non-sensitive skin
        concernNames,
        {} // Default to general subtypes
      );

      const recommendedProducts = await fetchRecommendedProducts(ingredients);
      console.log("Recommended Products - Print: \n", recommendedProducts);

      const analysisResults = {
        skinType: detectedSkinType?.name || 'Unknown',
        concerns: detectedConcerns,
        ingredients: ingredients,
        products: recommendedProducts
      };

      navigate('/analysis-results', { state: { analysisResults } });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(error.message || "An error occurred during the analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    // Reset all fields from last analysis
    setImage(null);
    setLoading(true);
    setError(null);

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      //Case: Image is too small
      img.onload = async () => {
        if (img.naturalWidth < 200 || img.naturalHeight < 200) {
          setError('The image is too small. Please upload an image bigger than 200x200 pixels.');
          return;
        }
  
        //Case: image is too big --> Pica compresses it
        const compressedFile = await compressImage(file);
        setImage(URL.createObjectURL(compressedFile));
        analyzeSkin(compressedFile);
      };
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
      
      {loading && !error && (
        <LoadingSpinner>
          Analyzing your skin...
        </LoadingSpinner>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

export default SkinAnalysis;
