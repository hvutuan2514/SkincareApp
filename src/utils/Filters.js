// filterUtils.js

export const validatePrice = (minPrice, maxPrice, setErrorMessage) => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
  
    if (min <= 0 || max <= 0) {
      setErrorMessage("Price cannot be zero or negative.");
      return false;
    }
  
    if (min > max) {
      setErrorMessage("Minimum price cannot be higher than maximum price.");
      return false;
    }
  
    return true;
  };
  
  export const handleFilter = (recommendedProducts, minPrice, maxPrice, setFilteredProducts, setIsFilterModalOpen, setErrorMessage) => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
  
    if (!validatePrice(minPrice, maxPrice, setErrorMessage)) {
      return;
    }
  
    const filtered = recommendedProducts.filter(product => {
      const price = parseFloat(product.price.replace(/[^\d.]/g, ""));
      return (!min || price >= min) && (!max || price <= max);
    });
  
    setFilteredProducts(filtered);
    setIsFilterModalOpen(false); // Close modal after filtering
    setErrorMessage(''); // Clear any previous errors
  };
  
  export const resetFilters = (setMinPrice, setMaxPrice, setFilteredProducts, recommendedProducts, setIsFilterModalOpen, setErrorMessage) => {
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(recommendedProducts);
    setIsFilterModalOpen(false);
    setErrorMessage('');
  };
  