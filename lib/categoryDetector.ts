export function detectProductCategory(productName: string, ingredients: string[]): string {
  const productLower = productName.toLowerCase();
  const ingredientsLower = ingredients.join(' ').toLowerCase();

  // Sweets/Desserts Detection - CHECK FIRST (before beverages that might have "drink")
  if (/chocolate|choco|cocoa|candy|sweet|dessert|mithai|ladoo|barfi|gulab jamun|rasgulla|kulfi|dairy milk|kitkat|snickers|mars|bounty|munch|perk|5 star|cadbury|nestle|milkybar/i.test(productLower)) {
    return 'sweets';
  }

  // Health Drinks Detection
  if (/horlicks|bournvita|boost|complan|protinex|milo|health drink|nutrition drink/i.test(productLower)) {
    return 'health_drinks';
  }

  // Spreads Detection (jam, peanut butter, etc.)
  if (/peanut butter|almond butter|jam|jelly|honey|nutella|chocolate spread|hazelnut/i.test(productLower)) {
    return 'spreads';
  }

  // Bread Detection
  if (/bread|pav|bun|burger bun|hot dog|sandwich|sliced/i.test(productLower)) {
    return 'bread';
  }

  // Instant Mixes Detection
  if (/dosa mix|idli mix|upma mix|poha mix|dhokla mix|instant mix|ready mix/i.test(productLower)) {
    return 'instant_mixes';
  }

  // Frozen Foods Detection
  if (/frozen|paratha|samosa|spring roll|puff|nugget|patty/i.test(productLower)) {
    return 'frozen';
  }

  // Pickles Detection
  if (/pickle|achar|achaar/i.test(productLower)) {
    return 'pickles';
  }

  // Noodles/Pasta Detection
  if (/noodle|maggi|yippee|pasta|macaroni|spaghetti|penne|vermicelli|sevai/i.test(productLower)) {
    return 'noodles';
  }

  // Biscuits/Cookies Detection
  if (/biscuit|cookie|cracker|digestive|marie|bourbon|oreo|parle-g|britannia|sunfeast/i.test(productLower)) {
    return 'biscuits';
  }

  // Cereal Detection (separate from breakfast for better matching)
  if (/\b(oats|muesli|granola|cornflakes|chocos|cereal)\b/i.test(productLower)) {
    return 'cereal';
  }

  // Snacks Detection
  if (/chip|crisp|namkeen|bhujia|mixture|sev|wafer|cheetos|lays|kurkure|bingo|makhana|popcorn/i.test(productLower)) {
    return 'snacks';
  }

  // Beverages Detection - CHECK AFTER sweets to avoid "chocolate drink" conflicts
  if (/\b(cola|coke|coca|pepsi|sprite|fanta|limca|thumbs up|mirinda|maaza|frooti|slice|appy|tropicana|minute maid|paper boat|nimbooz|jaljeera)\b|juice|soda|beverage|smoothie|shake|lassi|tea|coffee|water|buttermilk|chaas/i.test(productLower)) {
    return 'beverages';
  }

  // Dairy Detection
  if (/milk|yogurt|curd|dahi|paneer|cheese|butter|ghee|cream/i.test(productLower)) {
    return 'dairy';
  }

  // Grains/Cereals Detection
  if (/rice|wheat|quinoa|flour|atta|maida|poha|upma|daliya|ragi|jowar|bajra/i.test(productLower)) {
    return 'grains';
  }

  // Proteins Detection
  if (/protein powder|whey|dal|lentil|beans|chickpea|chana|rajma|soya chunks|tofu/i.test(productLower)) {
    return 'proteins';
  }

  // Breakfast Detection
  if (/breakfast|instant|ready to eat/i.test(productLower)) {
    return 'breakfast';
  }

  // Condiments Detection
  if (/sauce|ketchup|chutney|mayonnaise|mustard|vinegar|salt|pepper|spice|masala/i.test(productLower)) {
    return 'condiments';
  }

  // Default fallback
  return 'snacks';
}

export function getSubCategory(productName: string, category: string): string {
  const productLower = productName.toLowerCase();

  if (category === 'noodles') {
    if (/pasta/i.test(productLower)) return 'pasta';
    return 'noodles';
  }

  if (category === 'snacks') {
    if (/chip|wafer/i.test(productLower)) return 'chips';
    if (/namkeen|bhujia|mixture|sev/i.test(productLower)) return 'namkeen';
    if (/popcorn/i.test(productLower)) return 'popcorn';
    if (/makhana/i.test(productLower)) return 'namkeen';
    return 'snacks';
  }

  if (category === 'biscuits') {
    if (/cream|bourbon/i.test(productLower)) return 'cream_biscuits';
    if (/digestive|marie/i.test(productLower)) return 'biscuits';
    if (/cookie/i.test(productLower)) return 'cookies';
    return 'biscuits';
  }

  if (category === 'cereal') {
    if (/oats/i.test(productLower)) return 'cereal';
    if (/muesli/i.test(productLower)) return 'cereal';
    return 'cereal';
  }

  if (category === 'condiments') {
    if (/ketchup|sauce/i.test(productLower)) return 'condiments';
    if (/pickle|chutney/i.test(productLower)) return 'pickles';
    if (/salt|pepper/i.test(productLower)) return 'condiments';
    return 'condiments';
  }

  if (category === 'sweets') {
    if (/chocolate/i.test(productLower)) return 'sweets';
    if (/bar/i.test(productLower)) return 'sweets';
    return 'sweets';
  }

  if (category === 'beverages') {
    if (/tea|coffee/i.test(productLower)) return 'beverages';
    if (/juice|water/i.test(productLower)) return 'beverages';
    return 'beverages';
  }

  return category;
}
