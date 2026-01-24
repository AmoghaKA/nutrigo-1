const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Static alternatives database (fallback)
const alternativesDB = {
  'chips': [
    {
      name: 'Baked Potato Chips',
      brand: 'Lay\'s Oven Baked',
      health_score: 70,
      nutrition: { calories: 120, fat: '3g', sodium: '140mg', fiber: '2g' },
      benefits: ['Baked not fried', 'Lower fat', 'Whole grain'],
      description: 'Crispy baked potato chips with 65% less fat than regular chips',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=lays+baked',
        zepto: 'https://zepto.com/search?q=lays+baked',
        swiggy: 'https://swiggy.com/search?q=lays+baked',
        bigbasket: 'https://bigbasket.com/search?q=lays+baked'
      }
    },
    {
      name: 'Ragi Chips',
      brand: 'Too Yumm!',
      health_score: 75,
      nutrition: { calories: 110, fat: '4g', sodium: '120mg', fiber: '3g' },
      benefits: ['Made with ragi', 'High fiber', 'No MSG'],
      description: 'Healthy millet-based chips packed with nutrition',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=too+yumm+ragi',
        zepto: 'https://zepto.com/search?q=too+yumm',
        swiggy: 'https://swiggy.com/search?q=too+yumm',
        bigbasket: 'https://bigbasket.com/search?q=too+yumm'
      }
    },
    {
      name: 'Multi-grain Veggie Stix',
      brand: 'Hippie',
      health_score: 78,
      nutrition: { calories: 100, fat: '3.5g', sodium: '100mg', fiber: '4g' },
      benefits: ['5 vegetables', 'High fiber', 'No artificial colors'],
      description: 'Crunchy veggie sticks made with real vegetables and whole grains',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=hippie+veggie+stix',
        zepto: 'https://zepto.com/search?q=hippie+chips',
        swiggy: 'https://swiggy.com/search?q=hippie+veggie',
        bigbasket: 'https://bigbasket.com/search?q=hippie+veggie'
      }
    }
  ],
  'biscuits': [
    {
      name: 'Oats Digestive Biscuits',
      brand: 'Britannia NutriChoice',
      health_score: 72,
      nutrition: { calories: 90, sugar: '6g', fiber: '4g', protein: '2g' },
      benefits: ['High fiber', 'Whole grain oats', 'Low sugar'],
      description: 'Wholesome digestive biscuits made with real oats',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nutrichoice+oats',
        zepto: 'https://zepto.com/search?q=britannia+nutrichoice',
        swiggy: 'https://swiggy.com/search?q=nutrichoice',
        bigbasket: 'https://bigbasket.com/search?q=nutrichoice'
      }
    },
    {
      name: 'Multigrain Digestive',
      brand: 'Sunfeast Farmlite',
      health_score: 74,
      nutrition: { calories: 85, sugar: '5g', fiber: '5g', protein: '2.5g' },
      benefits: ['5 grains', 'High fiber', 'Low fat'],
      description: 'Nutritious multigrain biscuits with oats, wheat, corn, ragi, and rice',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=sunfeast+farmlite',
        zepto: 'https://zepto.com/search?q=farmlite',
        swiggy: 'https://swiggy.com/search?q=sunfeast+farmlite',
        bigbasket: 'https://bigbasket.com/search?q=farmlite'
      }
    }
  ],
  'namkeen': [
    {
      name: 'Roasted Makhana',
      brand: 'Farmley',
      health_score: 80,
      nutrition: { calories: 95, fat: '1g', sodium: '80mg', fiber: '2g' },
      benefits: ['Low calorie', 'Roasted not fried', 'High protein'],
      description: 'Crispy roasted foxnuts - a healthy traditional snack',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=farmley+makhana',
        zepto: 'https://zepto.com/search?q=roasted+makhana',
        swiggy: 'https://swiggy.com/search?q=makhana',
        bigbasket: 'https://bigbasket.com/search?q=farmley+makhana'
      }
    }
  ],
  'beverages': [
    {
      name: 'Green Tea',
      brand: 'Organic India',
      health_score: 85,
      nutrition: { calories: 0, sugar: '0g', caffeine: '20mg' },
      benefits: ['Zero calories', 'Antioxidants', 'No added sugar'],
      description: 'Pure organic green tea rich in antioxidants',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=organic+india+green+tea',
        zepto: 'https://zepto.com/search?q=green+tea',
        swiggy: 'https://swiggy.com/search?q=organic+india',
        bigbasket: 'https://bigbasket.com/search?q=organic+india+tea'
      }
    }
  ]
};

router.post('/', async (req, res) => {
  try {
    const { category, subCategory, currentHealthScore, currentProduct, currentBrand } = req.body;

    console.log('Alternatives request:', { category, subCategory, currentProduct, currentHealthScore });

    // Try to get AI-generated alternatives first
    const aiAlternatives = await generateAIAlternatives(
      category, 
      subCategory, 
      currentProduct, 
      currentHealthScore
    );

    if (aiAlternatives && aiAlternatives.length > 0) {
      console.log(`Returning ${aiAlternatives.length} AI alternatives`);
      return res.json(aiAlternatives);
    }

    // Fallback to static database
    const staticAlternatives = alternativesDB[subCategory] || alternativesDB[category] || [];
    const filteredAlternatives = staticAlternatives.filter(alt => alt.health_score > currentHealthScore);
    
    console.log(`Returning ${filteredAlternatives.length} static alternatives`);
    res.json(filteredAlternatives);

  } catch (error) {
    console.error('Error in alternatives API:', error);
    res.status(500).json({ error: 'Failed to fetch alternatives' });
  }
});

async function generateAIAlternatives(category, subCategory, currentProduct, currentScore) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a nutrition expert. The user scanned "${currentProduct}" which has a health score of ${currentScore}/100 in the ${category} category (${subCategory}).

Suggest 5-7 REAL Indian packaged food alternatives that are:
1. In the SAME category (${subCategory} ${category})
2. Healthier (higher health score)
3. Actually available in Indian stores (Blinkit, Zepto, BigBasket, Swiggy)

Return ONLY a JSON array with this exact structure:
[
  {
    "name": "Product name",
    "brand": "Brand name",
    "health_score": 75,
    "nutrition": {
      "calories": 120,
      "sugar": "5g",
      "protein": "3g",
      "fiber": "2g"
    },
    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "description": "One sentence description"
  }
]

IMPORTANT: 
- Only suggest REAL products available in India
- Health scores must be 60-95 range
- All products must be better than ${currentScore}
- Focus on ${subCategory} alternatives`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const alternatives = JSON.parse(jsonMatch[0]);
      
      // Add purchase links
      return alternatives.map(alt => ({
        ...alt,
        purchaseLinks: generatePurchaseLinks(alt.name, alt.brand)
      }));
    }

    return null;
  } catch (error) {
    console.error('AI alternatives generation failed:', error);
    return null;
  }
}

function generatePurchaseLinks(productName, brand) {
  const searchQuery = encodeURIComponent(`${brand} ${productName}`);
  return {
    blinkit: `https://blinkit.com/search?q=${searchQuery}`,
    zepto: `https://zepto.com/search?q=${searchQuery}`,
    swiggy: `https://www.swiggy.com/instamart/search?query=${searchQuery}`,
    bigbasket: `https://www.bigbasket.com/ps/?q=${searchQuery}`
  };
}

module.exports = router;
