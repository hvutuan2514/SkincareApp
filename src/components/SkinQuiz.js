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

const concernSubQuestions = {
  'Acne': {
    question: 'What type of acne do you have?',
    options: [
      { value: 'red-inflamed', label: 'Red, inflamed bumps' },
      { value: 'pus-filled', label: 'Pus-filled pimples' }
    ]
  },
  'Dark Circles': {
    question: 'What is the main cause of your dark circles?',
    options: [
      { value: 'lack-of-sleep', label: 'Lack of sleep' },
      { value: 'genetics', label: 'Genetics' },
      { value: 'sun-damage', label: 'Sun damage' },
      { value: 'aging', label: 'Aging' }
    ]
  },
  'Dark Spots': {
    question: 'What caused your dark spots?',
    options: [
      { value: 'acne', label: 'Acne' },
      { value: 'sun-damage', label: 'Sun damage' },
      { value: 'pregnancy', label: 'Pregnancy' },
      { value: 'aging', label: 'Aging' }
    ]
  },
  'Forehead Pores': {
    question: 'How enlarged are your forehead pores?',
    options: [
      { value: 'very-enlarged', label: 'Very enlarged' },
      { value: 'enlarged', label: 'Enlarged' },
      { value: 'slightly-enlarged', label: 'Slightly enlarged' }
    ]
  },
  'Forehead Wrinkles': {
    question: 'When did your forehead wrinkles start appearing?',
    options: [
      { value: 'prevent', label: 'Want to prevent early' },
      { value: 'recent', label: 'Recently appeared' },
      { value: 'long-term', label: 'Had them for years' }
    ]
  },
  'Eye Fine Lines': {
    question: 'When did your eye fine lines start appearing?',
    options: [
      { value: 'prevent', label: 'Want to prevent early' },
      { value: 'recent', label: 'Recently appeared' },
      { value: 'long-term', label: 'Had them for years' }
    ]
  },
  'Left Cheek Pores': {
    question: 'How enlarged are your left cheek pores?',
    options: [
      { value: 'very-enlarged', label: 'Very enlarged' },
      { value: 'enlarged', label: 'Enlarged' },
      { value: 'slightly-enlarged', label: 'Slightly enlarged' }
    ]
  },
  'Right Cheek Pores': {
    question: 'How enlarged are your right cheek pores?',
    options: [
      { value: 'very-enlarged', label: 'Very enlarged' },
      { value: 'enlarged', label: 'Enlarged' },
      { value: 'slightly-enlarged', label: 'Slightly enlarged' }
    ]
  },
  'Jaw Pores': {
    question: 'How enlarged are your jaw pores?',
    options: [
      { value: 'very-enlarged', label: 'Very enlarged' },
      { value: 'enlarged', label: 'Enlarged' },
      { value: 'slightly-enlarged', label: 'Slightly enlarged' }
    ]
  }
};

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
    isSensitive: false,
    skinConcerns: [],
    concernTypes: {},
    routine: []
  });

  const { data: skinConcerns, error: skinConcernsError } = useFetchSupabaseData('skin_concerns', 'id, name');
  const { data: routineSteps, error: routineStepsError } = useFetchSupabaseData('routine_steps', 'id, name');
  const { data: skinTypes, error: skinTypesError } = useFetchSupabaseData('skin_type', 'id, name');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results', { state: { formData } });
  };

  const renderCheckboxGroup = (options, selectedOptions, fieldName) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', textAlign: 'left' }}>
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(e) => {
                const updatedOptions = e.target.checked
                  ? [...selectedOptions, option]
                  : selectedOptions.filter(o => o !== option);
                setFormData(prevData => ({ ...prevData, [fieldName]: updatedOptions }));
              }}
            /> {option}
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
        {skinConcernsError ? (
          <p style={{ color: 'red' }}>Failed to load skin concerns: {skinConcernsError.message}</p>
        ) : (
          renderCheckboxGroup(
            skinConcerns.map(concern => concern.name),
            formData.skinConcerns,
            'skinConcerns'
          )
        )}
      </QuestionSection>

      {formData.skinConcerns.map(concern => 
        concernSubQuestions[concern] && (
          <QuestionSection key={concern}>
            <h2>{concernSubQuestions[concern].question}</h2>
            <Select
              value={formData.concernTypes[concern] || ''}
              onChange={(e) => setFormData({
                ...formData,
                concernTypes: {
                  ...formData.concernTypes,
                  [concern]: e.target.value
                }
              })}
              required
            >
              <option value="">Select an option</option>
              {concernSubQuestions[concern].options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </QuestionSection>
        )
      )}

      <QuestionSection>
        <h2>What steps do you use in your skincare routine?</h2>
        <p>Select all that apply:</p>
        {routineStepsError ? (
          <p style={{ color: 'red' }}>Failed to load routine steps: {routineStepsError.message}</p>
        ) : (
          renderCheckboxGroup(
            routineSteps.map(step => step.name),
            formData.routine,
            'routine'
          )
        )}
      </QuestionSection>

      <Button type="submit">Get My Personalized Recommendations</Button>
    </Form>
  );
}

export default SkinQuiz;
