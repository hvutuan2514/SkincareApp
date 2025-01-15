// ConcernToProduct.js
import supabase from '../config/supabaseClient';

export const fetchIngredients = async (skinType, isSensitive, concerns, concernTypes) => {
    // Fetch skin type ID
    const { data: skinTypeData } = await supabase
      .from('skin_type')
      .select('id')
      .eq('name', skinType)
      .single();  

    // Fetch skin type ingredients
    const { data: typeIngredients } = await supabase
      .from('type_to_ingredients')
      .select(`
        ingredients:ingredient_id (name)
      `)
      .eq('skin_type_id', skinType?.id)
      .eq('is_sensitive', isSensitive);
  
    // Fetch concern IDS
    const concernPromises = concerns.map(async (concern) => {
      const { data: concernData } = await supabase
          .from('skin_concerns')
          .select('id')
          .eq('name', concern)
          .single();

      // Fetch concern ingredients by using actual names to look up IDs in the database
      if (concernData) {
          const subtype = concernTypes[concern] || 'general';
          const { data: concernIngredients } = await supabase
              .from('concern_to_ingredients')
              .select(`
                  ingredients:ingredient_id (name)
              `)
              .eq('skin_concern_id', concernData.id)
              .eq('concern_subtype', subtype);

          return concernIngredients || [];
      }
      return [];
    });
  
    const concernIngredientsArrays = await Promise.all(concernPromises);
    
    // Combine all ingredients
    const allIngredients = [
        ...(typeIngredients || []),
        ...(concernIngredientsArrays.flat() || [])
    ];
  
    // Remove duplicates
    const uniqueIngredients = [...new Set(allIngredients
        .filter(i => i?.ingredients?.name)
        .map(i => i.ingredients.name))];

    return uniqueIngredients;
};

export const fetchRecommendedProducts = async (requiredIngredients) => {
  if (!requiredIngredients?.length) return [];

  const { data: products } = await supabase
    .from('products')
    .select('*');

  // Convert string with single quotes to proper array
  const parseIngredients = (ingredientsStr) => {
    return ingredientsStr
      .replace(/[\[\]']/g, '')
      .split(', ')
      .map(i => i.trim());
  };

  // Calculate the match score for each product
  const scoredProducts = products.map(product => {
    const productIngredients = parseIngredients(product.clean_ingreds);

    // Count how many required ingredients are in this product
    const ingredientMatchCount = requiredIngredients.filter(required =>
      productIngredients.some(prodIngred =>
        prodIngred.toLowerCase().includes(required.toLowerCase())
      )
    ).length;

    return {
      ...product,
      ingredientMatchCount
    };
  });

  // Filter out products with no matches
  const filteredProducts = scoredProducts.filter(p => p.ingredientMatchCount > 0);

  // Sort products by match count (highest first)
  filteredProducts.sort((a, b) => b.ingredientMatchCount - a.ingredientMatchCount);

  return filteredProducts;
};
