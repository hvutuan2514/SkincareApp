1/10/25 - Ananya
- Added Pica for image compression: npm install pica
- Skin Analysis
    - Image uploaded is too big (Edge case) - Done
    - Image uploaded is too small (Edge case) - Done
    - Image uploaded has no face (Edge case) - Done
    - Error & Analyzing skin messages never appear at the same time - Done
    - If no concerns found, print "No concerns found" instead of nothing - Done
- Results
    - If user picks no skin concerns, display "None" instead of nothing - Done
- SkinQuiz
    - Used skinConcernsError and routineStepsError

1/10/25 - Hannah
- SkinQuiz.js: Added more questions for the skin quiz
- Supabase: Completed the database with concern_to_ingredients and type_to_ingredients

1/11/25 - Hannah
- SkinAnalysis.js: Added the recommended ingredients based on skin type and skin concerns

1/12/25 - Hannah
- SkinAnalysis.js: Added products based on the recommended ingredients (provides user with price and purchase link)
- Deleted any stuff related to google gemini (not using this AI model anymore)

1/13/25 - Ananya
- utils/ConcernToProduct.js : moved fetchIngredients() & fetchRecommendedProducts() to here from SkinAnalysis.js
- Recommend product with most matching ingredients
    - Ingredients are shown properly per card
    - Does not recommend a product with no matching ingredients
    - TODO: Put most matching ingredient products at TOP of list