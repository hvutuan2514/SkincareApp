// SkinQuiz.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import supabase from '../config/supabaseClient';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const QuestionSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 15px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #45a049;
  }
`;

//General method to load data from Supabase
const useFetchSupabaseData = (table, fields) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedData, error } = await supabase
        .from(table)
        .select(fields);

      if (error) {
        console.error(`Error fetching ${table}:`, error);
        setError(error);
      } else {
        setData(fetchedData);
      }
    };

    fetchData();
  }, [table, fields]);

  return { data, error };
};

function SkinQuiz() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skinType: '',
    skinColor: '',
    isSensitive: false,
    skinConcerns: [],
    acneType: '',
    routine: []
  });
      
  //Load data from Supabase (calls general method)
  const { data: skinConcerns, error: skinConcernsError } = useFetchSupabaseData('skin_concerns', 'id, name');
  const { data: routineSteps, error: routineStepsError } = useFetchSupabaseData('routine_steps', 'id, name');
  const { data: skinTypes, error: skinTypesError } = useFetchSupabaseData('skin_type', 'id, name'); 
  const { data: skinColors, error: skinColorsError } = useFetchSupabaseData('skin_color', 'id, name'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results', { state: { formData } });
  };

  // Generalized CheckboxGroup method (displays skinConcerns, routineSteps, etc)
  const renderCheckboxGroup = (options, selectedOptions, fieldName) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', textAlign: 'left' }}>
        {options.map((option, index) => (
          <label key={index}> {}
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)} // Check if the option is in the selected options
              onChange={(e) => {
                const updatedOptions = e.target.checked
                  ? [...selectedOptions, option] // Add the option to selected options if checked
                  : selectedOptions.filter(o => o !== option); // Remove the option if unchecked
                setFormData(prevData => ({ ...prevData, [fieldName]: updatedOptions })); // Update the formData field
              }}
            /> {option} {/* Render the option */}
          </label>
        ))}
      </div>
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <QuestionSection>
        <h2>What's your skin type?</h2>
        <Select 
          value={formData.skinType}
          onChange={(e) => setFormData({...formData, skinType: e.target.value})}
          required
        >
          <option value="">Select your skin type</option>
          {skinTypes && skinTypes.map(skinType => (
            <option key={skinType.id} value={skinType.name}>
              {skinType.name}
            </option>
          ))}
        </Select>
        {skinTypesError && <p style={{ color: 'red' }}>Failed to load skin types: {skinTypesError.message}</p>}
      </QuestionSection>

      <QuestionSection>
        <h2>What's your skin color?</h2>
        <Select
          value={formData.skinColor}
          onChange={(e) => setFormData({...formData, skinColor: e.target.value})}
          required
        >
          {skinColors && skinColors.map(skinColor => (
            <option key={skinColor.id} value={skinColor.name}>
              {skinColor.name}
            </option>
          ))}
        </Select>
      </QuestionSection>

      <QuestionSection>
        <h2>Do you have sensitive skin?</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label>
            <input
              type="radio"
              name="sensitive"
              value="yes"
              checked={formData.isSensitive === true}
              onChange={() => setFormData({...formData, isSensitive: true})}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              name="sensitive"
              value="no"
              checked={formData.isSensitive === false}
              onChange={() => setFormData({...formData, isSensitive: false})}
            /> No
          </label>
        </div>
      </QuestionSection>

      <QuestionSection>
        <h2>What are your skin concerns?</h2>
        <p>Select all that apply:</p>
        {renderCheckboxGroup(
          skinConcerns.map(concern => concern.name), 
          formData.skinConcerns,
          'skinConcerns'
        )}
      </QuestionSection>

      {formData.skinConcerns.includes('Acne') && (
        <QuestionSection>
          <h2>What type of acne do you have?</h2>
          <Select
            value={formData.acneType}
            onChange={(e) => setFormData({...formData, acneType: e.target.value})}
            required
          >
            <option value="">Select your acne type</option>
            <option value="red-inflamed">Red, inflamed bumps</option>
            <option value="pus-filled">Pus-filled pimples</option>
          </Select>
        </QuestionSection>
      )}

      <QuestionSection>
        <h2>What steps do you use in your skincare routine?</h2>
        <p>Select all that apply:</p>
        {renderCheckboxGroup(
          routineSteps.map(step => step.name), // Map to get only the name from each object
          formData.routine, // selectedOptions
          'routine' // fieldName to update in formData
        )}
      </QuestionSection>
      <Button type="submit">Get My Personalized Recommendations</Button>
    </Form>
  );
}

export default SkinQuiz;

