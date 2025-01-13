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
      .eq('skin_type_id', skinTypeData?.id)
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


export const fetchRecommendedProducts = async (ingredients) => {
  if (!ingredients?.length) return [];

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

  // Create a map of ingredients to products
  const productsByIngredient = {};

  ingredients.forEach(ingredient => {
    productsByIngredient[ingredient] = products
      .map(product => {
        const productIngredients = parseIngredients(product.clean_ingreds);
        const nameMatch = product.product_name.toLowerCase().includes(ingredient.toLowerCase());

        // Count how many of the required ingredients are in this product
        const ingredientMatchCount = productIngredients.filter(prodIngred =>
          prodIngred.toLowerCase().includes(ingredient.toLowerCase())
        ).length;

        return {
          product,
          ingredientMatchCount,
          nameMatch
        };
      })
      .filter(item => item.ingredientMatchCount > 0 || item.nameMatch) // Filter out products with no matches
      .sort((a, b) => b.ingredientMatchCount - a.ingredientMatchCount); // Sort by ingredient match count in descending order
  });

  // After collecting all products, filter out the ones with no ingredient matches
  const filteredProducts = Object.entries(productsByIngredient).reduce((acc, [ingredient, productItems]) => {
    const productsWithMatches = productItems.filter(item => item.ingredientMatchCount > 0);
    if (productsWithMatches.length > 0) {
      acc[ingredient] = productsWithMatches;
    }
    return acc;
  }, {});

  console.log("Filtered and Sorted Products with matching ingredients:", filteredProducts);

  return filteredProducts;
};



