// SkinQuiz.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  text-align: left;
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

function SkinQuiz() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skinType: '',
    skinColor: '',
    isSensitive: false,
    skinConcerns: [],
    routine: []
  });

  const skinConcerns = [
    'Acne',
    'Dark spots',
    'Fine lines',
    'Large pores',
    'Dryness',
    'Oiliness',
    'Redness',
    'Uneven texture'
  ];

  const routineSteps = [
    'Cleanser',
    'Toner',
    'Serum',
    'Moisturizer',
    'Sunscreen',
    'Eye cream',
    'Face masks',
    'Exfoliator'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/results', { state: { formData } });
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
          <option value="oily">Oily</option>
          <option value="dry">Dry</option>
          <option value="combination">Combination</option>
          <option value="normal">Normal</option>
        </Select>
      </QuestionSection>

      <QuestionSection>
        <h2>What's your skin color?</h2>
        <Select
          value={formData.skinColor}
          onChange={(e) => setFormData({...formData, skinColor: e.target.value})}
          required
        >
          <option value="">Select your skin color</option>
          <option value="fair">Fair</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="olive">Olive</option>
          <option value="tan">Tan</option>
          <option value="deep">Deep</option>
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
        <CheckboxGroup>
          {skinConcerns.map(concern => (
            <label key={concern}>
              <input
                type="checkbox"
                checked={formData.skinConcerns.includes(concern)}
                onChange={(e) => {
                  const updatedConcerns = e.target.checked
                    ? [...formData.skinConcerns, concern]
                    : formData.skinConcerns.filter(c => c !== concern);
                  setFormData({...formData, skinConcerns: updatedConcerns});
                }}
              /> {concern}
            </label>
          ))}
        </CheckboxGroup>
      </QuestionSection>

      <QuestionSection>
        <h2>What steps do you use in your skincare routine?</h2>
        <p>Select all that apply:</p>
        <CheckboxGroup>
          {routineSteps.map(step => (
            <label key={step}>
              <input
                type="checkbox"
                checked={formData.routine.includes(step)}
                onChange={(e) => {
                  const updatedRoutine = e.target.checked
                    ? [...formData.routine, step]
                    : formData.routine.filter(s => s !== step);
                  setFormData({...formData, routine: updatedRoutine});
                }}
              /> {step}
            </label>
          ))}
        </CheckboxGroup>
      </QuestionSection>

      <Button type="submit">Get My Personalized Recommendations</Button>
    </Form>
  );
}

export default SkinQuiz;

