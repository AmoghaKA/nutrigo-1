export function detectProductCategory(productName: string, ingredients: string[]): string {
  const productLower = productName.toLowerCase();
  const ingredientsLower = ingredients.join(' ').toLowerCase();

  // Snacks Detection
  if (/chip|crisp|namkeen|bhujia|mixture|sev|wafer|cheetos|lays|kurkure|bingo/i.test(productLower)) {
    return 'snacks';
  }

  // Biscuits/Cookies Detection
  if (/biscuit|cookie|cracker|digestive|marie|bourbon|cream|parle-g|britannia|sunfeast/i.test(productLower)) {
    return 'biscuits';
  }

  // Beverages Detection
  if (/drink|juice|cola|pepsi|sprite|fanta|soda|beverage|smoothie|shake|lassi/i.test(productLower)) {
    return 'beverages';
  }

  // Sweets/Desserts Detection
  if (/chocolate|candy|sweet|dessert|mithai|ladoo|barfi|gulab jamun|rasgulla|kulfi/i.test(productLower)) {
    return 'sweets';
  }

  // Dairy Detection
  if (/milk|yogurt|curd|dahi|paneer|cheese|butter|ghee|cream|lassi/i.test(productLower)) {
    return 'dairy';
  }

  // Grains/Cereals Detection
  if (/rice|wheat|oats|cereal|muesli|granola|flour|atta|maida|poha|upma|daliya/i.test(productLower)) {
    return 'grains';
  }

  // Proteins Detection
  if (/protein|tofu|soya|paneer|dal|lentil|beans|chickpea|chana|rajma/i.test(productLower)) {
    return 'proteins';
  }

  // Breakfast Detection
  if (/breakfast|cornflakes|chocos|muesli|granola|instant|mix|ready to eat/i.test(productLower)) {
    return 'breakfast';
  }

  // Condiments Detection
  if (/sauce|ketchup|chutney|pickle|jam|spread|mayonnaise|mustard|vinegar/i.test(productLower)) {
    return 'condiments';
  }

  // Default fallback
  return 'snacks';
}

export function getSubCategory(productName: string, category: string): string {
  const productLower = productName.toLowerCase();

  if (category === 'snacks') {
    if (/chip|wafer/i.test(productLower)) return 'chips';
    if (/namkeen|bhujia|mixture|sev/i.test(productLower)) return 'namkeen';
    if (/popcorn/i.test(productLower)) return 'popcorn';
    return 'general';
  }

  if (category === 'biscuits') {
    if (/cream|bourbon/i.test(productLower)) return 'cream_biscuits';
    if (/digestive|marie/i.test(productLower)) return 'digestive';
    if (/cookie/i.test(productLower)) return 'cookies';
    return 'general';
  }

  return 'general';
}
