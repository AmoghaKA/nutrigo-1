import express from "express";
import { supabase } from "../lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Static alternatives database (fallback) - EXPANDED VERSION
const alternativesDB: Record<string, any[]> = {
  'snacks': [
    {
      name: 'Baked Potato Chips',
      brand: 'Lay\'s Oven Baked',
      health_score: 70,
      nutrition: { calories: 120, fat: 3, sugar: 2, protein: 2, fiber: 2, sodium: 140 },
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
      nutrition: { calories: 110, fat: 4, sugar: 1, protein: 3, fiber: 3, sodium: 120 },
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
      nutrition: { calories: 100, fat: 3.5, sugar: 1, protein: 2, fiber: 4, sodium: 100 },
      benefits: ['5 vegetables', 'High fiber', 'No artificial colors'],
      description: 'Crunchy veggie sticks made with real vegetables and whole grains',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=hippie+veggie+stix',
        zepto: 'https://zepto.com/search?q=hippie+chips',
        swiggy: 'https://swiggy.com/search?q=hippie+veggie',
        bigbasket: 'https://bigbasket.com/search?q=hippie+veggie'
      }
    },
    {
      name: 'Roasted Makhana',
      brand: 'Farmley',
      health_score: 82,
      nutrition: { calories: 95, fat: 1, sugar: 0, protein: 4, fiber: 2, sodium: 80 },
      benefits: ['Low calorie', 'Roasted not fried', 'High protein'],
      description: 'Crispy roasted foxnuts - a healthy traditional snack',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=farmley+makhana',
        zepto: 'https://zepto.com/search?q=roasted+makhana',
        swiggy: 'https://swiggy.com/search?q=makhana',
        bigbasket: 'https://bigbasket.com/search?q=farmley+makhana'
      }
    },
    {
      name: 'Quinoa Puffs',
      brand: 'Soulfull',
      health_score: 80,
      nutrition: { calories: 105, fat: 2, sugar: 1, protein: 5, fiber: 3, sodium: 90 },
      benefits: ['Complete protein', 'Gluten-free', 'Low calorie'],
      description: 'Crunchy quinoa puffs that are both healthy and delicious',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=soulfull+quinoa',
        zepto: 'https://zepto.com/search?q=soulfull',
        swiggy: 'https://swiggy.com/search?q=soulfull+quinoa',
        bigbasket: 'https://bigbasket.com/search?q=soulfull'
      }
    },
    {
      name: 'Baked Namkeen',
      brand: 'Haldiram\'s Baked',
      health_score: 73,
      nutrition: { calories: 115, fat: 3, sugar: 1, protein: 3, fiber: 2, sodium: 150 },
      benefits: ['Baked not fried', '50% less fat', 'Traditional taste'],
      description: 'Classic namkeen taste with healthier baking process',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=haldirams+baked',
        zepto: 'https://zepto.com/search?q=baked+namkeen',
        swiggy: 'https://swiggy.com/search?q=haldirams+baked',
        bigbasket: 'https://bigbasket.com/search?q=baked+namkeen'
      }
    },
    {
      name: 'Roasted Chana',
      brand: 'Cornitos',
      health_score: 76,
      nutrition: { calories: 130, fat: 3, sugar: 1, protein: 8, fiber: 5, sodium: 120 },
      benefits: ['High protein', 'Rich in fiber', 'Roasted'],
      description: 'Crunchy roasted chickpeas seasoned perfectly',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=roasted+chana',
        zepto: 'https://zepto.com/search?q=cornitos+chana',
        swiggy: 'https://swiggy.com/search?q=roasted+chana',
        bigbasket: 'https://bigbasket.com/search?q=roasted+chana'
      }
    },
    {
      name: 'Khakhra',
      brand: 'Falguni Gruh Udyog',
      health_score: 74,
      nutrition: { calories: 105, fat: 2, sugar: 1, protein: 4, fiber: 3, sodium: 110 },
      benefits: ['Roasted', 'Low fat', 'Traditional Gujarati'],
      description: 'Crispy roasted wheat crackers',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=khakhra',
        zepto: 'https://zepto.com/search?q=khakhra',
        swiggy: 'https://swiggy.com/search?q=falguni+khakhra',
        bigbasket: 'https://bigbasket.com/search?q=khakhra'
      }
    },
    {
      name: 'Roasted Peanuts',
      brand: 'Happilo',
      health_score: 77,
      nutrition: { calories: 140, fat: 12, sugar: 1, protein: 7, fiber: 3, sodium: 5 },
      benefits: ['High protein', 'Healthy fats', 'Low sodium'],
      description: 'Premium roasted peanuts with no added oil',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=happilo+peanuts',
        zepto: 'https://zepto.com/search?q=roasted+peanuts',
        swiggy: 'https://swiggy.com/search?q=happilo',
        bigbasket: 'https://bigbasket.com/search?q=roasted+peanuts'
      }
    },
    {
      name: 'Trail Mix',
      brand: 'Nutty Gritties',
      health_score: 79,
      nutrition: { calories: 145, fat: 10, sugar: 5, protein: 6, fiber: 3, sodium: 15 },
      benefits: ['Mixed nuts', 'Dried fruits', 'Energy boost'],
      description: 'Wholesome mix of nuts, seeds and dried fruits',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=trail+mix',
        zepto: 'https://zepto.com/search?q=nutty+gritties',
        swiggy: 'https://swiggy.com/search?q=trail+mix',
        bigbasket: 'https://bigbasket.com/search?q=trail+mix'
      }
    }
  ],
  'chips': [
    {
      name: 'Baked Potato Chips',
      brand: 'Lay\'s Oven Baked',
      health_score: 70,
      nutrition: { calories: 120, fat: 3, sugar: 2, protein: 2, fiber: 2, sodium: 140 },
      benefits: ['Baked not fried', 'Lower fat', 'Whole grain'],
      description: 'Crispy baked potato chips with 65% less fat',
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
      nutrition: { calories: 110, fat: 4, sugar: 1, protein: 3, fiber: 3, sodium: 120 },
      benefits: ['Made with ragi', 'High fiber', 'No MSG'],
      description: 'Healthy millet-based chips packed with nutrition',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=too+yumm',
        zepto: 'https://zepto.com/search?q=too+yumm',
        swiggy: 'https://swiggy.com/search?q=too+yumm',
        bigbasket: 'https://bigbasket.com/search?q=too+yumm'
      }
    },
    {
      name: 'Sweet Potato Chips',
      brand: 'Hippie',
      health_score: 73,
      nutrition: { calories: 125, fat: 4, sugar: 3, protein: 2, fiber: 3, sodium: 90 },
      benefits: ['Sweet potato goodness', 'Vitamin A', 'Natural sweetness'],
      description: 'Crispy sweet potato chips with natural flavor',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=sweet+potato+chips',
        zepto: 'https://zepto.com/search?q=sweet+potato+chips',
        swiggy: 'https://swiggy.com/search?q=hippie+sweet+potato',
        bigbasket: 'https://bigbasket.com/search?q=sweet+potato+chips'
      }
    },
    {
      name: 'Quinoa Chips',
      brand: 'Simply7',
      health_score: 76,
      nutrition: { calories: 115, fat: 3.5, sugar: 1, protein: 4, fiber: 3, sodium: 100 },
      benefits: ['Quinoa protein', 'Gluten-free', 'Superfood snack'],
      description: 'Crunchy chips made with nutrient-packed quinoa',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=quinoa+chips',
        zepto: 'https://zepto.com/search?q=quinoa+chips',
        swiggy: 'https://swiggy.com/search?q=quinoa+chips',
        bigbasket: 'https://bigbasket.com/search?q=quinoa+chips'
      }
    },
    {
      name: 'Kale Chips',
      brand: 'Healthy Treat',
      health_score: 80,
      nutrition: { calories: 95, fat: 2, sugar: 0, protein: 3, fiber: 4, sodium: 75 },
      benefits: ['Superfood kale', 'Low calorie', 'High nutrients'],
      description: 'Crispy baked kale chips loaded with vitamins',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kale+chips',
        zepto: 'https://zepto.com/search?q=kale+chips',
        swiggy: 'https://swiggy.com/search?q=kale+chips',
        bigbasket: 'https://bigbasket.com/search?q=kale+chips'
      }
    },
    {
      name: 'Beetroot Chips',
      brand: 'GreenSnack',
      health_score: 74,
      nutrition: { calories: 118, fat: 3, sugar: 4, protein: 2, fiber: 3, sodium: 85 },
      benefits: ['Natural color', 'No artificial flavors', 'Antioxidants'],
      description: 'Vibrant beetroot chips baked to perfection',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=beetroot+chips',
        zepto: 'https://zepto.com/search?q=beetroot+chips',
        swiggy: 'https://swiggy.com/search?q=vegetable+chips',
        bigbasket: 'https://bigbasket.com/search?q=beetroot+chips'
      }
    },
    {
      name: 'Jowar Chips',
      brand: 'Nourish You',
      health_score: 77,
      nutrition: { calories: 108, fat: 3, sugar: 1, protein: 3, fiber: 4, sodium: 95 },
      benefits: ['Ancient grain', 'Gluten-free', 'High fiber'],
      description: 'Nutritious sorghum chips with traditional taste',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=jowar+chips',
        zepto: 'https://zepto.com/search?q=jowar+chips',
        swiggy: 'https://swiggy.com/search?q=millet+chips',
        bigbasket: 'https://bigbasket.com/search?q=jowar+chips'
      }
    },
    {
      name: 'Brown Rice Chips',
      brand: 'GoodDot',
      health_score: 72,
      nutrition: { calories: 122, fat: 3.5, sugar: 2, protein: 2, fiber: 2, sodium: 110 },
      benefits: ['Whole grain', 'Baked', 'Gluten-free'],
      description: 'Crispy brown rice chips with sea salt',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=brown+rice+chips',
        zepto: 'https://zepto.com/search?q=rice+chips',
        swiggy: 'https://swiggy.com/search?q=brown+rice+chips',
        bigbasket: 'https://bigbasket.com/search?q=rice+chips'
      }
    },
    {
      name: 'Banana Chips (Baked)',
      brand: 'Kerala Banana',
      health_score: 71,
      nutrition: { calories: 130, fat: 4, sugar: 6, protein: 1, fiber: 3, sodium: 5 },
      benefits: ['Baked not fried', 'Potassium rich', 'Natural'],
      description: 'Kerala-style banana chips with healthier baking',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=baked+banana+chips',
        zepto: 'https://zepto.com/search?q=banana+chips',
        swiggy: 'https://swiggy.com/search?q=banana+chips',
        bigbasket: 'https://bigbasket.com/search?q=baked+banana+chips'
      }
    },
    {
      name: 'Palak Chips',
      brand: 'Healthy Master',
      health_score: 79,
      nutrition: { calories: 98, fat: 2, sugar: 1, protein: 4, fiber: 4, sodium: 80 },
      benefits: ['Iron rich', 'Spinach goodness', 'Low calorie'],
      description: 'Crispy spinach chips packed with nutrition',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=spinach+chips',
        zepto: 'https://zepto.com/search?q=palak+chips',
        swiggy: 'https://swiggy.com/search?q=spinach+chips',
        bigbasket: 'https://bigbasket.com/search?q=palak+chips'
      }
    }
  ],
  'biscuits': [
    {
      name: 'Oats Digestive Biscuits',
      brand: 'Britannia NutriChoice',
      health_score: 72,
      nutrition: { calories: 90, sugar: 6, protein: 2, fat: 3, fiber: 4, sodium: 100 },
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
      nutrition: { calories: 85, sugar: 5, protein: 2.5, fat: 2.5, fiber: 5, sodium: 95 },
      benefits: ['5 grains', 'High fiber', 'Low fat'],
      description: 'Nutritious multigrain biscuits with oats, wheat, corn, ragi, and rice',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=sunfeast+farmlite',
        zepto: 'https://zepto.com/search?q=farmlite',
        swiggy: 'https://swiggy.com/search?q=sunfeast+farmlite',
        bigbasket: 'https://bigbasket.com/search?q=farmlite'
      }
    },
    {
      name: 'Honey Oats Biscuits',
      brand: 'Parle Nutricrunch',
      health_score: 70,
      nutrition: { calories: 95, sugar: 7, protein: 2, fat: 3.5, fiber: 3, sodium: 110 },
      benefits: ['Real honey', 'Oats fiber', 'No maida'],
      description: 'Crispy biscuits with the goodness of oats and honey',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=parle+nutricrunch',
        zepto: 'https://zepto.com/search?q=nutricrunch',
        swiggy: 'https://swiggy.com/search?q=parle+nutricrunch',
        bigbasket: 'https://bigbasket.com/search?q=nutricrunch'
      }
    },
    {
      name: 'Ragi Digestive',
      brand: 'Sunfeast Diabetes Friendly',
      health_score: 76,
      nutrition: { calories: 80, sugar: 3, protein: 3, fat: 2, fiber: 6, sodium: 90 },
      benefits: ['Ragi goodness', 'Low sugar', 'High fiber'],
      description: 'Diabetic-friendly biscuits made with finger millet',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=sunfeast+diabetic',
        zepto: 'https://zepto.com/search?q=ragi+biscuits',
        swiggy: 'https://swiggy.com/search?q=ragi+digestive',
        bigbasket: 'https://bigbasket.com/search?q=ragi+biscuits'
      }
    },
    {
      name: 'Marie Light',
      brand: 'Britannia',
      health_score: 69,
      nutrition: { calories: 88, sugar: 4, protein: 2, fat: 2, fiber: 2, sodium: 100 },
      benefits: ['Classic taste', 'Light biscuit', 'Low fat'],
      description: 'Classic marie biscuit perfect for tea time',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=britannia+marie',
        zepto: 'https://zepto.com/search?q=marie+biscuit',
        swiggy: 'https://swiggy.com/search?q=marie+biscuit',
        bigbasket: 'https://bigbasket.com/search?q=marie+light'
      }
    },
    {
      name: 'Whole Wheat Biscuits',
      brand: 'McVitie\'s Digestive',
      health_score: 73,
      nutrition: { calories: 92, sugar: 6, protein: 2, fat: 3, fiber: 4, sodium: 95 },
      benefits: ['100% whole wheat', 'British recipe', 'High fiber'],
      description: 'Original whole wheat digestive biscuits',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mcvities+digestive',
        zepto: 'https://zepto.com/search?q=mcvities',
        swiggy: 'https://swiggy.com/search?q=mcvities+digestive',
        bigbasket: 'https://bigbasket.com/search?q=mcvities'
      }
    },
    {
      name: 'Sugar Free Digestive',
      brand: 'Diabexy',
      health_score: 78,
      nutrition: { calories: 75, sugar: 0, protein: 3, fat: 2, fiber: 5, sodium: 80 },
      benefits: ['Zero sugar', 'Stevia sweetened', 'Diabetic friendly'],
      description: 'Sugar-free biscuits perfect for diabetics',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=diabexy+biscuits',
        zepto: 'https://zepto.com/search?q=sugar+free+biscuit',
        swiggy: 'https://swiggy.com/search?q=diabexy',
        bigbasket: 'https://bigbasket.com/search?q=sugar+free+digestive'
      }
    },
    {
      name: 'Jeera Biscuits',
      brand: 'Patanjali',
      health_score: 71,
      nutrition: { calories: 93, sugar: 5, protein: 2, fat: 3, fiber: 3, sodium: 105 },
      benefits: ['Cumin seeds', 'Digestive', 'Natural ingredients'],
      description: 'Traditional jeera biscuits aid digestion',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=patanjali+jeera+biscuit',
        zepto: 'https://zepto.com/search?q=jeera+biscuit',
        swiggy: 'https://swiggy.com/search?q=jeera+biscuit',
        bigbasket: 'https://bigbasket.com/search?q=jeera+biscuit'
      }
    },
    {
      name: 'Atta Biscuits',
      brand: 'Parle-G Gold',
      health_score: 68,
      nutrition: { calories: 97, sugar: 8, protein: 2, fat: 3, fiber: 2, sodium: 110 },
      benefits: ['Made with atta', 'Energy boost', 'Classic taste'],
      description: 'Wholesome biscuits made with wheat flour',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=parle+g+gold',
        zepto: 'https://zepto.com/search?q=parle+g',
        swiggy: 'https://swiggy.com/search?q=parle+g+gold',
        bigbasket: 'https://bigbasket.com/search?q=parle+g'
      }
    },
    {
      name: 'Almond & Oats Biscuits',
      brand: 'Britannia Good Day',
      health_score: 70,
      nutrition: { calories: 94, sugar: 7, protein: 2, fat: 4, fiber: 3, sodium: 100 },
      benefits: ['Real almonds', 'Oats fiber', 'Crunchy'],
      description: 'Delicious biscuits with almonds and oats',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=good+day+almond+oats',
        zepto: 'https://zepto.com/search?q=good+day+biscuit',
        swiggy: 'https://swiggy.com/search?q=good+day+almond',
        bigbasket: 'https://bigbasket.com/search?q=good+day+oats'
      }
    }
  ],
  'cookies': [
    {
      name: 'Dark Chocolate Cookies',
      brand: 'Unibic',
      health_score: 68,
      nutrition: { calories: 110, sugar: 8, protein: 2, fat: 5, fiber: 2, sodium: 80 },
      benefits: ['Dark chocolate', 'No transfat', 'Crispy texture'],
      description: 'Delicious cookies with rich dark chocolate',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=unibic+cookies',
        zepto: 'https://zepto.com/search?q=unibic',
        swiggy: 'https://swiggy.com/search?q=unibic',
        bigbasket: 'https://bigbasket.com/search?q=unibic'
      }
    },
    {
      name: 'Oats & Raisin Cookies',
      brand: 'Sunfeast',
      health_score: 71,
      nutrition: { calories: 100, sugar: 7, protein: 2.5, fat: 4, fiber: 3, sodium: 75 },
      benefits: ['Whole grain oats', 'Real raisins', 'High fiber'],
      description: 'Wholesome cookies with oats and juicy raisins',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=sunfeast+oats+cookies',
        zepto: 'https://zepto.com/search?q=sunfeast+cookies',
        swiggy: 'https://swiggy.com/search?q=sunfeast+oats',
        bigbasket: 'https://bigbasket.com/search?q=sunfeast+cookies'
      }
    },
    {
      name: 'Almond Cookies',
      brand: 'Britannia Good Day',
      health_score: 69,
      nutrition: { calories: 105, sugar: 9, protein: 2, fat: 5, fiber: 2, sodium: 85 },
      benefits: ['Real almonds', 'Crunchy', 'Rich taste'],
      description: 'Buttery almond cookies for a delightful treat',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=good+day+almond',
        zepto: 'https://zepto.com/search?q=britannia+almond+cookies',
        swiggy: 'https://swiggy.com/search?q=good+day+cookies',
        bigbasket: 'https://bigbasket.com/search?q=almond+cookies'
      }
    },
    {
      name: 'Coconut Cookies',
      brand: 'Karachi Bakery',
      health_score: 67,
      nutrition: { calories: 115, sugar: 9, protein: 2, fat: 6, fiber: 2, sodium: 90 },
      benefits: ['Real coconut', 'Authentic recipe', 'Premium quality'],
      description: 'Traditional coconut cookies with rich flavor',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=karachi+bakery+coconut',
        zepto: 'https://zepto.com/search?q=coconut+cookies',
        swiggy: 'https://swiggy.com/search?q=karachi+bakery',
        bigbasket: 'https://bigbasket.com/search?q=coconut+cookies'
      }
    },
    {
      name: 'Sugar Free Cookies',
      brand: 'Diabexy',
      health_score: 75,
      nutrition: { calories: 90, sugar: 0, protein: 3, fat: 4, fiber: 4, sodium: 70 },
      benefits: ['Zero sugar', 'Diabetic friendly', 'Stevia sweetened'],
      description: 'Guilt-free cookies sweetened with stevia',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=diabexy+cookies',
        zepto: 'https://zepto.com/search?q=sugar+free+cookies',
        swiggy: 'https://swiggy.com/search?q=diabexy',
        bigbasket: 'https://bigbasket.com/search?q=sugar+free+cookies'
      }
    },
    {
      name: 'Choco Chip Cookies',
      brand: 'Unibic',
      health_score: 66,
      nutrition: { calories: 115, sugar: 10, protein: 2, fat: 6, fiber: 2, sodium: 95 },
      benefits: ['Chocolate chips', 'Crispy', 'Premium quality'],
      description: 'Classic chocolate chip cookies everyone loves',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=unibic+choco+chip',
        zepto: 'https://zepto.com/search?q=choco+chip+cookies',
        swiggy: 'https://swiggy.com/search?q=unibic+chocolate',
        bigbasket: 'https://bigbasket.com/search?q=choco+chip'
      }
    },
    {
      name: 'Cashew Cookies',
      brand: 'Britannia',
      health_score: 68,
      nutrition: { calories: 110, sugar: 8, protein: 2.5, fat: 5.5, fiber: 2, sodium: 85 },
      benefits: ['Real cashews', 'Buttery texture', 'Premium nuts'],
      description: 'Rich cookies loaded with cashew pieces',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=cashew+cookies',
        zepto: 'https://zepto.com/search?q=britannia+cashew',
        swiggy: 'https://swiggy.com/search?q=cashew+cookies',
        bigbasket: 'https://bigbasket.com/search?q=cashew+cookies'
      }
    },
    {
      name: 'Butter Cookies',
      brand: 'Patanjali',
      health_score: 65,
      nutrition: { calories: 120, sugar: 10, protein: 2, fat: 6, fiber: 1, sodium: 100 },
      benefits: ['Rich butter', 'Natural ingredients', 'Traditional taste'],
      description: 'Classic butter cookies made with pure ghee',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=patanjali+butter+cookies',
        zepto: 'https://zepto.com/search?q=butter+cookies',
        swiggy: 'https://swiggy.com/search?q=patanjali+cookies',
        bigbasket: 'https://bigbasket.com/search?q=butter+cookies'
      }
    },
    {
      name: 'Digestive Cookies',
      brand: 'McVities',
      health_score: 72,
      nutrition: { calories: 95, sugar: 6, protein: 2, fat: 4, fiber: 3, sodium: 80 },
      benefits: ['High fiber', 'Digestive health', 'Whole wheat'],
      description: 'Fiber-rich digestive cookies for better gut health',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mcvities+digestive',
        zepto: 'https://zepto.com/search?q=digestive+cookies',
        swiggy: 'https://swiggy.com/search?q=mcvities',
        bigbasket: 'https://bigbasket.com/search?q=digestive+cookies'
      }
    },
    {
      name: 'Jeera Cookies',
      brand: 'Sunfeast',
      health_score: 70,
      nutrition: { calories: 98, sugar: 5, protein: 2, fat: 4, fiber: 2, sodium: 90 },
      benefits: ['Cumin flavor', 'Digestive', 'Traditional'],
      description: 'Savory cookies with aromatic cumin seeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=jeera+cookies',
        zepto: 'https://zepto.com/search?q=sunfeast+jeera',
        swiggy: 'https://swiggy.com/search?q=jeera+cookies',
        bigbasket: 'https://bigbasket.com/search?q=jeera+cookies'
      }
    }
  ],
  'namkeen': [
    {
      name: 'Roasted Makhana',
      brand: 'Farmley',
      health_score: 80,
      nutrition: { calories: 95, fat: 1, sugar: 0, protein: 4, fiber: 2, sodium: 80 },
      benefits: ['Low calorie', 'Roasted not fried', 'High protein'],
      description: 'Crispy roasted foxnuts - a healthy traditional snack',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=farmley+makhana',
        zepto: 'https://zepto.com/search?q=roasted+makhana',
        swiggy: 'https://swiggy.com/search?q=makhana',
        bigbasket: 'https://bigbasket.com/search?q=farmley+makhana'
      }
    },
    {
      name: 'Roasted Chana',
      brand: 'Cornitos',
      health_score: 76,
      nutrition: { calories: 130, fat: 3, sugar: 1, protein: 8, fiber: 5, sodium: 120 },
      benefits: ['High protein', 'Rich in fiber', 'Roasted'],
      description: 'Crunchy roasted chickpeas seasoned perfectly',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=roasted+chana',
        zepto: 'https://zepto.com/search?q=cornitos+chana',
        swiggy: 'https://swiggy.com/search?q=roasted+chana',
        bigbasket: 'https://bigbasket.com/search?q=roasted+chana'
      }
    }
  ],
  'beverages': [
    {
      name: 'Green Tea',
      brand: 'Organic India',
      health_score: 85,
      nutrition: { calories: 0, sugar: 0, caffeine: 20, protein: 0, fat: 0 },
      benefits: ['Zero calories', 'Antioxidants', 'No added sugar'],
      description: 'Pure organic green tea rich in antioxidants',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=organic+india+green+tea',
        zepto: 'https://zepto.com/search?q=green+tea',
        swiggy: 'https://swiggy.com/search?q=organic+india',
        bigbasket: 'https://bigbasket.com/search?q=organic+india+tea'
      }
    },
    {
      name: 'Coconut Water',
      brand: 'Real',
      health_score: 88,
      nutrition: { calories: 45, sugar: 9, protein: 0.5, fat: 0, sodium: 30 },
      benefits: ['Natural electrolytes', 'No added sugar', 'Hydrating'],
      description: 'Fresh coconut water straight from nature',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=real+coconut+water',
        zepto: 'https://zepto.com/search?q=coconut+water',
        swiggy: 'https://swiggy.com/search?q=real+coconut',
        bigbasket: 'https://bigbasket.com/search?q=coconut+water'
      }
    },
    {
      name: 'Sparkling Water',
      brand: 'Bisleri Vedica',
      health_score: 90,
      nutrition: { calories: 0, sugar: 0, protein: 0, fat: 0, sodium: 5 },
      benefits: ['Zero calories', 'No sugar', 'Refreshing carbonation'],
      description: 'Sparkling mineral water - healthier alternative to soda',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=bisleri+vedica',
        zepto: 'https://zepto.com/search?q=sparkling+water',
        swiggy: 'https://swiggy.com/search?q=sparkling+water',
        bigbasket: 'https://bigbasket.com/search?q=sparkling+water'
      }
    },
    {
      name: 'Nimbooz',
      brand: '7Up Nimbooz',
      health_score: 68,
      nutrition: { calories: 40, sugar: 10, protein: 0, fat: 0, sodium: 20 },
      benefits: ['Real lemon', 'Lower sugar than cola', 'Vitamin C'],
      description: 'Refreshing lemon drink with real fruit',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nimbooz',
        zepto: 'https://zepto.com/search?q=nimbooz',
        swiggy: 'https://swiggy.com/search?q=nimbooz',
        bigbasket: 'https://bigbasket.com/search?q=nimbooz'
      }
    },
    {
      name: 'Aam Panna Drink',
      brand: 'Paper Boat',
      health_score: 70,
      nutrition: { calories: 55, sugar: 12, protein: 0, fat: 0, sodium: 15 },
      benefits: ['Natural ingredients', 'Traditional recipe', 'No preservatives'],
      description: 'Traditional raw mango drink - refreshing and authentic',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=paper+boat+aam+panna',
        zepto: 'https://zepto.com/search?q=paper+boat',
        swiggy: 'https://swiggy.com/search?q=paper+boat',
        bigbasket: 'https://bigbasket.com/search?q=paper+boat'
      }
    },
    {
      name: 'Jaljeera',
      brand: 'Paper Boat',
      health_score: 72,
      nutrition: { calories: 50, sugar: 11, protein: 0, fat: 0, sodium: 18 },
      benefits: ['Digestive spices', 'Traditional recipe', 'No preservatives'],
      description: 'Spiced cumin drink - traditional and refreshing',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=paper+boat+jaljeera',
        zepto: 'https://zepto.com/search?q=jaljeera',
        swiggy: 'https://swiggy.com/search?q=paper+boat+jaljeera',
        bigbasket: 'https://bigbasket.com/search?q=jaljeera'
      }
    },
    {
      name: 'Fresh Lime Soda',
      brand: 'Minute Maid Nimbu Fresh',
      health_score: 65,
      nutrition: { calories: 45, sugar: 11, protein: 0, fat: 0, sodium: 25 },
      benefits: ['Real lime juice', 'Vitamin C', 'Refreshing'],
      description: 'Fresh lime soda with real fruit juice',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=minute+maid+nimbu',
        zepto: 'https://zepto.com/search?q=lime+soda',
        swiggy: 'https://swiggy.com/search?q=minute+maid',
        bigbasket: 'https://bigbasket.com/search?q=nimbu+fresh'
      }
    },
    {
      name: 'Aloe Vera Juice',
      brand: 'Patanjali',
      health_score: 82,
      nutrition: { calories: 20, sugar: 3, protein: 0, fat: 0, fiber: 1 },
      benefits: ['Digestive health', 'Low calorie', 'Natural'],
      description: 'Pure aloe vera juice for wellness',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=patanjali+aloe',
        zepto: 'https://zepto.com/search?q=aloe+vera+juice',
        swiggy: 'https://swiggy.com/search?q=patanjali+aloe',
        bigbasket: 'https://bigbasket.com/search?q=aloe+vera+juice'
      }
    },
    {
      name: 'Cold Pressed Juice',
      brand: 'Raw Pressery',
      health_score: 80,
      nutrition: { calories: 60, sugar: 13, protein: 1, fat: 0, fiber: 2 },
      benefits: ['Cold pressed', 'No added sugar', 'Fresh ingredients'],
      description: 'Cold pressed fruit and vegetable juice',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=raw+pressery',
        zepto: 'https://zepto.com/search?q=raw+pressery',
        swiggy: 'https://swiggy.com/search?q=raw+pressery',
        bigbasket: 'https://bigbasket.com/search?q=raw+pressery'
      }
    },
    {
      name: 'Buttermilk',
      brand: 'Amul Masti',
      health_score: 76,
      nutrition: { calories: 40, sugar: 3, protein: 2, fat: 1, sodium: 120 },
      benefits: ['Probiotics', 'Protein rich', 'Digestive'],
      description: 'Traditional spiced buttermilk for digestion',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amul+masti',
        zepto: 'https://zepto.com/search?q=buttermilk',
        swiggy: 'https://swiggy.com/search?q=amul+buttermilk',
        bigbasket: 'https://bigbasket.com/search?q=buttermilk'
      }
    }
  ],
  'dairy': [
    {
      name: 'Greek Yogurt',
      brand: 'Epigamia',
      health_score: 78,
      nutrition: { calories: 110, sugar: 8, protein: 10, fat: 3, calcium: 150 },
      benefits: ['High protein', 'Probiotics', 'Low fat'],
      description: 'Rich and creamy Greek yogurt with live cultures',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=epigamia',
        zepto: 'https://zepto.com/search?q=greek+yogurt',
        swiggy: 'https://swiggy.com/search?q=epigamia',
        bigbasket: 'https://bigbasket.com/search?q=epigamia'
      }
    },
    {
      name: 'Paneer',
      brand: 'Amul Fresh',
      health_score: 75,
      nutrition: { calories: 265, sugar: 1, protein: 18, fat: 20, calcium: 200 },
      benefits: ['High protein', 'Rich in calcium', 'Fresh daily'],
      description: 'Fresh cottage cheese made from quality milk',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amul+paneer',
        zepto: 'https://zepto.com/search?q=paneer',
        swiggy: 'https://swiggy.com/search?q=amul+paneer',
        bigbasket: 'https://bigbasket.com/search?q=paneer'
      }
    },
    {
      name: 'Low Fat Milk',
      brand: 'Amul Taaza',
      health_score: 76,
      nutrition: { calories: 90, sugar: 12, protein: 8, fat: 1.5, calcium: 280 },
      benefits: ['Low fat', 'Rich in calcium', 'Fortified'],
      description: 'Fresh low-fat toned milk for daily nutrition',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amul+taaza',
        zepto: 'https://zepto.com/search?q=amul+milk',
        swiggy: 'https://swiggy.com/search?q=amul+taaza',
        bigbasket: 'https://bigbasket.com/search?q=low+fat+milk'
      }
    },
    {
      name: 'Curd (Dahi)',
      brand: 'Mother Dairy',
      health_score: 77,
      nutrition: { calories: 98, sugar: 7, protein: 11, fat: 4, calcium: 230 },
      benefits: ['Probiotics', 'Digestive health', 'High protein'],
      description: 'Fresh curd with live probiotic cultures',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mother+dairy+curd',
        zepto: 'https://zepto.com/search?q=fresh+curd',
        swiggy: 'https://swiggy.com/search?q=mother+dairy',
        bigbasket: 'https://bigbasket.com/search?q=curd+dahi'
      }
    },
    {
      name: 'Buttermilk',
      brand: 'Amul Masti',
      health_score: 74,
      nutrition: { calories: 40, sugar: 3, protein: 3, fat: 1, calcium: 116 },
      benefits: ['Low calorie', 'Probiotics', 'Refreshing'],
      description: 'Traditional spiced buttermilk for digestion',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amul+masti',
        zepto: 'https://zepto.com/search?q=buttermilk',
        swiggy: 'https://swiggy.com/search?q=amul+buttermilk',
        bigbasket: 'https://bigbasket.com/search?q=buttermilk'
      }
    },
    {
      name: 'Cheese Slices (Low Fat)',
      brand: 'Britannia Lite',
      health_score: 70,
      nutrition: { calories: 50, sugar: 1, protein: 6, fat: 2, calcium: 150 },
      benefits: ['Low fat', 'High protein', 'Rich in calcium'],
      description: 'Light cheese slices with less fat',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=britannia+lite+cheese',
        zepto: 'https://zepto.com/search?q=low+fat+cheese',
        swiggy: 'https://swiggy.com/search?q=britannia+cheese',
        bigbasket: 'https://bigbasket.com/search?q=low+fat+cheese'
      }
    },
    {
      name: 'Skimmed Milk Powder',
      brand: 'Nestle Everyday',
      health_score: 73,
      nutrition: { calories: 355, sugar: 52, protein: 35, fat: 1, calcium: 1200 },
      benefits: ['99% fat-free', 'High protein', 'Fortified'],
      description: 'Skimmed milk powder for low-fat nutrition',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nestle+skimmed',
        zepto: 'https://zepto.com/search?q=skimmed+milk+powder',
        swiggy: 'https://swiggy.com/search?q=nestle+everyday',
        bigbasket: 'https://bigbasket.com/search?q=skimmed+milk+powder'
      }
    },
    {
      name: 'Lassi (Plain)',
      brand: 'Amul Kool',
      health_score: 72,
      nutrition: { calories: 85, sugar: 9, protein: 5, fat: 3, calcium: 180 },
      benefits: ['Probiotics', 'Refreshing', 'Traditional'],
      description: 'Creamy plain lassi made from fresh curd',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amul+lassi',
        zepto: 'https://zepto.com/search?q=lassi',
        swiggy: 'https://swiggy.com/search?q=amul+kool',
        bigbasket: 'https://bigbasket.com/search?q=lassi'
      }
    },
    {
      name: 'Tofu',
      brand: 'Soyfit',
      health_score: 80,
      nutrition: { calories: 76, sugar: 1, protein: 8, fat: 4.8, calcium: 350 },
      benefits: ['Plant protein', 'Low fat', 'High calcium'],
      description: 'Fresh soya paneer - excellent plant protein',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=tofu',
        zepto: 'https://zepto.com/search?q=soya+paneer',
        swiggy: 'https://swiggy.com/search?q=tofu',
        bigbasket: 'https://bigbasket.com/search?q=tofu'
      }
    },
    {
      name: 'Probiotic Drink',
      brand: 'Yakult',
      health_score: 68,
      nutrition: { calories: 50, sugar: 10, protein: 1, fat: 0, calcium: 20 },
      benefits: ['Probiotics', 'Gut health', 'Immunity boost'],
      description: 'Probiotic drink with beneficial bacteria',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=yakult',
        zepto: 'https://zepto.com/search?q=yakult',
        swiggy: 'https://swiggy.com/search?q=yakult',
        bigbasket: 'https://bigbasket.com/search?q=yakult'
      }
    }
  ],
  'breakfast': [
    {
      name: 'Oats',
      brand: 'Quaker',
      health_score: 85,
      nutrition: { calories: 150, sugar: 1, protein: 5, fat: 3, fiber: 4 },
      benefits: ['High fiber', 'Whole grain', 'Heart healthy'],
      description: 'Wholesome oats perfect for a healthy breakfast',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=quaker+oats',
        zepto: 'https://zepto.com/search?q=oats',
        swiggy: 'https://swiggy.com/search?q=quaker',
        bigbasket: 'https://bigbasket.com/search?q=quaker+oats'
      }
    },
    {
      name: 'Muesli',
      brand: 'Kellogg\'s',
      health_score: 78,
      nutrition: { calories: 160, sugar: 8, protein: 4, fat: 3, fiber: 5 },
      benefits: ['Whole grains', 'Nuts & fruits', 'High fiber'],
      description: 'Crunchy muesli with nuts, seeds and dried fruits',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kelloggs+muesli',
        zepto: 'https://zepto.com/search?q=muesli',
        swiggy: 'https://swiggy.com/search?q=kelloggs+muesli',
        bigbasket: 'https://bigbasket.com/search?q=muesli'
      }
    },
    {
      name: 'Cornflakes',
      brand: 'Kellogg\'s Corn Flakes',
      health_score: 72,
      nutrition: { calories: 120, sugar: 3, protein: 2, fat: 0.5, fiber: 1 },
      benefits: ['Low fat', 'Fortified with iron', 'Quick breakfast'],
      description: 'Classic crispy cornflakes for a light breakfast',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kelloggs+cornflakes',
        zepto: 'https://zepto.com/search?q=cornflakes',
        swiggy: 'https://swiggy.com/search?q=cornflakes',
        bigbasket: 'https://bigbasket.com/search?q=cornflakes'
      }
    },
    {
      name: 'Poha Mix',
      brand: 'MTR',
      health_score: 76,
      nutrition: { calories: 142, sugar: 2, protein: 3, fat: 2, fiber: 3 },
      benefits: ['Iron rich', 'Easy to digest', 'Traditional'],
      description: 'Quick poha breakfast mix ready in minutes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mtr+poha',
        zepto: 'https://zepto.com/search?q=poha+mix',
        swiggy: 'https://swiggy.com/search?q=mtr+breakfast',
        bigbasket: 'https://bigbasket.com/search?q=poha+mix'
      }
    },
    {
      name: 'Upma Mix',
      brand: 'Saffola',
      health_score: 74,
      nutrition: { calories: 155, sugar: 1, protein: 4, fat: 3, fiber: 4 },
      benefits: ['Multigrain', 'High fiber', 'Quick breakfast'],
      description: 'Nutritious upma mix with vegetables',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=saffola+upma',
        zepto: 'https://zepto.com/search?q=upma+mix',
        swiggy: 'https://swiggy.com/search?q=saffola+breakfast',
        bigbasket: 'https://bigbasket.com/search?q=upma+mix'
      }
    },
    {
      name: 'Granola',
      brand: 'Yogabar',
      health_score: 80,
      nutrition: { calories: 158, sugar: 5, protein: 5, fat: 5, fiber: 6 },
      benefits: ['Natural ingredients', 'Crunchy', 'High fiber'],
      description: 'Wholesome granola with nuts and seeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=yogabar+granola',
        zepto: 'https://zepto.com/search?q=granola',
        swiggy: 'https://swiggy.com/search?q=yogabar',
        bigbasket: 'https://bigbasket.com/search?q=granola'
      }
    },
    {
      name: 'Porridge Mix (Ragi)',
      brand: 'Slurrp Farm',
      health_score: 82,
      nutrition: { calories: 145, sugar: 1, protein: 5, fat: 2, fiber: 5 },
      benefits: ['Finger millet', 'High calcium', 'Instant'],
      description: 'Healthy ragi porridge for nutritious breakfast',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ragi+porridge',
        zepto: 'https://zepto.com/search?q=ragi+porridge',
        swiggy: 'https://swiggy.com/search?q=slurrp+farm',
        bigbasket: 'https://bigbasket.com/search?q=ragi+porridge'
      }
    },
    {
      name: 'Wheat Flakes',
      brand: 'Kellogg\'s',
      health_score: 75,
      nutrition: { calories: 135, sugar: 4, protein: 3, fat: 1, fiber: 3 },
      benefits: ['Whole wheat', 'Fortified', 'Low fat'],
      description: 'Crispy wheat flakes for healthy breakfast',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=wheat+flakes',
        zepto: 'https://zepto.com/search?q=kelloggs+wheat',
        swiggy: 'https://swiggy.com/search?q=wheat+flakes',
        bigbasket: 'https://bigbasket.com/search?q=wheat+flakes'
      }
    },
    {
      name: 'Choco Fills',
      brand: 'Kellogg\'s Chocos',
      health_score: 68,
      nutrition: { calories: 125, sugar: 10, protein: 2, fat: 1, fiber: 2 },
      benefits: ['Kids favorite', 'Fortified', 'Quick energy'],
      description: 'Chocolate-filled breakfast cereal for kids',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kelloggs+chocos',
        zepto: 'https://zepto.com/search?q=choco+fills',
        swiggy: 'https://swiggy.com/search?q=kelloggs+chocos',
        bigbasket: 'https://bigbasket.com/search?q=choco+fills'
      }
    },
    {
      name: 'Masala Oats',
      brand: 'Saffola',
      health_score: 77,
      nutrition: { calories: 148, sugar: 2, protein: 5, fat: 3, fiber: 5 },
      benefits: ['Savory breakfast', 'High fiber', 'Vegetable mix'],
      description: 'Delicious masala oats with real vegetables',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=saffola+masala+oats',
        zepto: 'https://zepto.com/search?q=masala+oats',
        swiggy: 'https://swiggy.com/search?q=saffola+oats',
        bigbasket: 'https://bigbasket.com/search?q=masala+oats'
      }
    }
  ],
  'sweets': [
    {
      name: 'Dark Chocolate 70%',
      brand: 'Lindt Excellence',
      health_score: 72,
      nutrition: { calories: 170, sugar: 10, protein: 3, fat: 12, fiber: 3 },
      benefits: ['70% cocoa', 'Rich antioxidants', 'Less sugar'],
      description: 'Premium dark chocolate with intense cocoa flavor',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=lindt+dark+chocolate',
        zepto: 'https://zepto.com/search?q=dark+chocolate',
        swiggy: 'https://swiggy.com/search?q=lindt+chocolate',
        bigbasket: 'https://bigbasket.com/search?q=lindt+excellence'
      }
    },
    {
      name: 'Dark Chocolate',
      brand: 'Amul',
      health_score: 68,
      nutrition: { calories: 150, sugar: 12, protein: 2, fat: 9, fiber: 2 },
      benefits: ['Antioxidants', 'Less sugar', '55% cocoa'],
      description: 'Premium dark chocolate with 55% cocoa',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amul+dark+chocolate',
        zepto: 'https://zepto.com/search?q=dark+chocolate',
        swiggy: 'https://swiggy.com/search?q=amul+chocolate',
        bigbasket: 'https://bigbasket.com/search?q=dark+chocolate'
      }
    },
    {
      name: 'Protein Bar - Chocolate',
      brand: 'Yoga Bar',
      health_score: 75,
      nutrition: { calories: 140, sugar: 8, protein: 10, fat: 6, fiber: 4 },
      benefits: ['High protein', 'Natural ingredients', 'No preservatives'],
      description: 'Nutritious chocolate protein bar for healthy snacking',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=yoga+bar',
        zepto: 'https://zepto.com/search?q=protein+bar',
        swiggy: 'https://swiggy.com/search?q=yoga+bar',
        bigbasket: 'https://bigbasket.com/search?q=yoga+bar'
      }
    },
    {
      name: 'Protein Bar - Nuts & Seeds',
      brand: 'RiteBite Max',
      health_score: 74,
      nutrition: { calories: 150, sugar: 9, protein: 9, fat: 7, fiber: 3 },
      benefits: ['Protein rich', 'Real nuts', 'Energy boost'],
      description: 'Crunchy protein bar loaded with nuts and seeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ritebite+max',
        zepto: 'https://zepto.com/search?q=ritebite',
        swiggy: 'https://swiggy.com/search?q=ritebite+bar',
        bigbasket: 'https://bigbasket.com/search?q=ritebite'
      }
    },
    {
      name: 'Fruit & Nut Bar',
      brand: 'Yoga Bar',
      health_score: 76,
      nutrition: { calories: 130, sugar: 10, protein: 5, fat: 5, fiber: 4 },
      benefits: ['Real fruits', 'Nuts & seeds', 'No added sugar'],
      description: 'Wholesome bar made with dried fruits and nuts',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=yoga+bar+fruit',
        zepto: 'https://zepto.com/search?q=fruit+nut+bar',
        swiggy: 'https://swiggy.com/search?q=yoga+bar',
        bigbasket: 'https://bigbasket.com/search?q=fruit+nut+bar'
      }
    },
    {
      name: 'Energy Bar - Oats & Honey',
      brand: 'Britannia NutriChoice',
      health_score: 70,
      nutrition: { calories: 145, sugar: 11, protein: 4, fat: 5, fiber: 3 },
      benefits: ['Whole grain oats', 'Natural honey', 'Sustained energy'],
      description: 'Delicious energy bar with oats and honey',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nutrichoice+energy+bar',
        zepto: 'https://zepto.com/search?q=britannia+bar',
        swiggy: 'https://swiggy.com/search?q=nutrichoice+bar',
        bigbasket: 'https://bigbasket.com/search?q=nutrichoice+bar'
      }
    },
    {
      name: 'Granola Bar',
      brand: 'Kellogg\'s',
      health_score: 69,
      nutrition: { calories: 140, sugar: 12, protein: 3, fat: 4, fiber: 2 },
      benefits: ['Whole grains', 'Crunchy granola', 'Portable snack'],
      description: 'Crunchy granola bar perfect for on-the-go',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kelloggs+granola+bar',
        zepto: 'https://zepto.com/search?q=granola+bar',
        swiggy: 'https://swiggy.com/search?q=kelloggs+bar',
        bigbasket: 'https://bigbasket.com/search?q=granola+bar'
      }
    },
    {
      name: 'Oats & Raisins Cookie',
      brand: 'Unibic',
      health_score: 67,
      nutrition: { calories: 135, sugar: 13, protein: 3, fat: 5, fiber: 2 },
      benefits: ['Whole grain oats', 'Real raisins', 'Crispy texture'],
      description: 'Wholesome cookies with oats and raisins',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=unibic+oats+raisins',
        zepto: 'https://zepto.com/search?q=unibic+cookies',
        swiggy: 'https://swiggy.com/search?q=unibic',
        bigbasket: 'https://bigbasket.com/search?q=unibic+oats'
      }
    },
    {
      name: 'Sugar-Free Dark Chocolate',
      brand: 'Zevic',
      health_score: 78,
      nutrition: { calories: 120, sugar: 0, protein: 2, fat: 10, fiber: 3 },
      benefits: ['Zero sugar', 'Stevia sweetened', 'High cocoa'],
      description: 'Sugar-free dark chocolate sweetened with stevia',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=zevic+chocolate',
        zepto: 'https://zepto.com/search?q=sugar+free+chocolate',
        swiggy: 'https://swiggy.com/search?q=zevic',
        bigbasket: 'https://bigbasket.com/search?q=zevic+chocolate'
      }
    },
    {
      name: 'Dates & Nuts Ladoo',
      brand: 'Vedaka',
      health_score: 73,
      nutrition: { calories: 155, sugar: 14, protein: 4, fat: 6, fiber: 3 },
      benefits: ['Natural sweetness', 'No refined sugar', 'Traditional'],
      description: 'Traditional sweet made with dates and nuts - no added sugar',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=dates+ladoo',
        zepto: 'https://zepto.com/search?q=dates+nuts+ladoo',
        swiggy: 'https://swiggy.com/search?q=vedaka+ladoo',
        bigbasket: 'https://bigbasket.com/search?q=dates+ladoo'
      }
    },
    {
      name: 'Dry Fruit Chikki',
      brand: 'Loacker',
      health_score: 71,
      nutrition: { calories: 160, sugar: 15, protein: 5, fat: 7, fiber: 2 },
      benefits: ['Nuts rich', 'Natural ingredients', 'Energy dense'],
      description: 'Crunchy chikki made with assorted dry fruits',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=dry+fruit+chikki',
        zepto: 'https://zepto.com/search?q=chikki',
        swiggy: 'https://swiggy.com/search?q=dry+fruit+chikki',
        bigbasket: 'https://bigbasket.com/search?q=chikki'
      }
    }
  ],
  'noodles': [
    {
      name: 'Atta Noodles',
      brand: 'Maggi',
      health_score: 68,
      nutrition: { calories: 205, sugar: 2, protein: 7, fat: 2, fiber: 3, sodium: 800 },
      benefits: ['Made with atta', 'Source of fiber', 'Less oil'],
      description: 'Instant noodles made with whole wheat atta',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=maggi+atta+noodles',
        zepto: 'https://zepto.com/search?q=atta+noodles',
        swiggy: 'https://swiggy.com/search?q=maggi+atta',
        bigbasket: 'https://bigbasket.com/search?q=atta+noodles'
      }
    },
    {
      name: 'Oats Noodles',
      brand: 'Sunfeast Yippee',
      health_score: 70,
      nutrition: { calories: 190, sugar: 1, protein: 6, fat: 2, fiber: 4, sodium: 750 },
      benefits: ['Oats goodness', 'High fiber', 'Multigrain'],
      description: 'Healthier instant noodles with oats',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=yippee+oats',
        zepto: 'https://zepto.com/search?q=oats+noodles',
        swiggy: 'https://swiggy.com/search?q=yippee+oats',
        bigbasket: 'https://bigbasket.com/search?q=oats+noodles'
      }
    },
    {
      name: 'Hakka Noodles',
      brand: 'Ching\'s Secret',
      health_score: 66,
      nutrition: { calories: 210, sugar: 2, protein: 6, fat: 3, fiber: 2, sodium: 820 },
      benefits: ['Indo-Chinese', 'Quick cooking', 'Authentic taste'],
      description: 'Classic Hakka noodles for Indo-Chinese dishes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=chings+hakka+noodles',
        zepto: 'https://zepto.com/search?q=hakka+noodles',
        swiggy: 'https://swiggy.com/search?q=chings+noodles',
        bigbasket: 'https://bigbasket.com/search?q=hakka+noodles'
      }
    },
    {
      name: 'Multigrain Noodles',
      brand: 'Slurp Farm',
      health_score: 74,
      nutrition: { calories: 180, sugar: 1, protein: 7, fat: 1.5, fiber: 5, sodium: 700 },
      benefits: ['5 grains', 'No maida', 'Kid-friendly'],
      description: 'Nutritious multigrain noodles for kids',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=slurp+farm+noodles',
        zepto: 'https://zepto.com/search?q=multigrain+noodles',
        swiggy: 'https://swiggy.com/search?q=slurp+farm',
        bigbasket: 'https://bigbasket.com/search?q=multigrain+noodles'
      }
    },
    {
      name: 'Ragi Noodles',
      brand: 'Early Foods',
      health_score: 76,
      nutrition: { calories: 175, sugar: 1, protein: 6, fat: 1, fiber: 6, sodium: 680 },
      benefits: ['Finger millet', 'High calcium', 'Iron rich'],
      description: 'Healthy ragi noodles packed with nutrients',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ragi+noodles',
        zepto: 'https://zepto.com/search?q=ragi+noodles',
        swiggy: 'https://swiggy.com/search?q=early+foods',
        bigbasket: 'https://bigbasket.com/search?q=ragi+noodles'
      }
    },
    {
      name: 'Brown Rice Noodles',
      brand: 'True Elements',
      health_score: 72,
      nutrition: { calories: 185, sugar: 0, protein: 5, fat: 1, fiber: 4, sodium: 650 },
      benefits: ['Gluten-free', 'Whole grain', 'Low GI'],
      description: 'Wholesome brown rice noodles - gluten-free option',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=brown+rice+noodles',
        zepto: 'https://zepto.com/search?q=rice+noodles',
        swiggy: 'https://swiggy.com/search?q=true+elements',
        bigbasket: 'https://bigbasket.com/search?q=brown+rice+noodles'
      }
    },
    {
      name: 'Soba Noodles',
      brand: 'Hakubaku',
      health_score: 75,
      nutrition: { calories: 195, sugar: 2, protein: 8, fat: 1.5, fiber: 5, sodium: 720 },
      benefits: ['Buckwheat', 'High protein', 'Traditional Japanese'],
      description: 'Authentic Japanese soba made with buckwheat',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=soba+noodles',
        zepto: 'https://zepto.com/search?q=soba+noodles',
        swiggy: 'https://swiggy.com/search?q=japanese+noodles',
        bigbasket: 'https://bigbasket.com/search?q=soba+noodles'
      }
    },
    {
      name: 'Spinach Noodles',
      brand: 'Maggi Nutri-licious',
      health_score: 71,
      nutrition: { calories: 200, sugar: 2, protein: 7, fat: 2, fiber: 4, sodium: 790 },
      benefits: ['Real spinach', 'Iron fortified', 'Vegetable goodness'],
      description: 'Nutritious noodles with real spinach',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=maggi+spinach',
        zepto: 'https://zepto.com/search?q=spinach+noodles',
        swiggy: 'https://swiggy.com/search?q=nutrilicious',
        bigbasket: 'https://bigbasket.com/search?q=spinach+noodles'
      }
    },
    {
      name: 'Jowar Noodles',
      brand: 'Timios',
      health_score: 73,
      nutrition: { calories: 182, sugar: 1, protein: 6, fat: 1, fiber: 5, sodium: 690 },
      benefits: ['Sorghum', 'Gluten-free', 'High fiber'],
      description: 'Healthy jowar noodles for gluten-free diet',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=jowar+noodles',
        zepto: 'https://zepto.com/search?q=sorghum+noodles',
        swiggy: 'https://swiggy.com/search?q=timios',
        bigbasket: 'https://bigbasket.com/search?q=jowar+noodles'
      }
    },
    {
      name: 'Quinoa Noodles',
      brand: 'Soulfull',
      health_score: 77,
      nutrition: { calories: 178, sugar: 1, protein: 8, fat: 2, fiber: 5, sodium: 670 },
      benefits: ['Complete protein', 'Superfood', 'Gluten-free'],
      description: 'Premium quinoa noodles with complete proteins',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=quinoa+noodles',
        zepto: 'https://zepto.com/search?q=quinoa+noodles',
        swiggy: 'https://swiggy.com/search?q=soulfull+noodles',
        bigbasket: 'https://bigbasket.com/search?q=quinoa+noodles'
      }
    }
  ],
  'pasta': [
    {
      name: 'Whole Wheat Pasta',
      brand: 'Del Monte',
      health_score: 74,
      nutrition: { calories: 180, sugar: 2, protein: 7, fat: 1.5, fiber: 6 },
      benefits: ['Whole grain', 'High fiber', 'Low fat'],
      description: 'Nutritious pasta made from 100% whole wheat',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=del+monte+whole+wheat',
        zepto: 'https://zepto.com/search?q=whole+wheat+pasta',
        swiggy: 'https://swiggy.com/search?q=del+monte+pasta',
        bigbasket: 'https://bigbasket.com/search?q=whole+wheat+pasta'
      }
    },
    {
      name: 'Multigrain Pasta',
      brand: 'Borges',
      health_score: 76,
      nutrition: { calories: 175, sugar: 1, protein: 8, fat: 1, fiber: 7 },
      benefits: ['7 grains', 'High protein', 'Rich in fiber'],
      description: 'Premium multigrain pasta with nutritional goodness',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=borges+multigrain',
        zepto: 'https://zepto.com/search?q=multigrain+pasta',
        swiggy: 'https://swiggy.com/search?q=borges+pasta',
        bigbasket: 'https://bigbasket.com/search?q=multigrain+pasta'
      }
    },
    {
      name: 'Quinoa Pasta',
      brand: 'Soulfull',
      health_score: 78,
      nutrition: { calories: 172, sugar: 1, protein: 9, fat: 2, fiber: 5 },
      benefits: ['Complete protein', 'Gluten-free', 'Superfood'],
      description: 'Nutritious quinoa pasta for health-conscious eaters',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=quinoa+pasta',
        zepto: 'https://zepto.com/search?q=quinoa+pasta',
        swiggy: 'https://swiggy.com/search?q=soulfull+pasta',
        bigbasket: 'https://bigbasket.com/search?q=quinoa+pasta'
      }
    },
    {
      name: 'Brown Rice Pasta',
      brand: 'Barilla',
      health_score: 75,
      nutrition: { calories: 178, sugar: 1, protein: 6, fat: 1.5, fiber: 5 },
      benefits: ['Gluten-free', 'Whole grain', 'Easy to digest'],
      description: 'Gluten-free pasta made from brown rice',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=brown+rice+pasta',
        zepto: 'https://zepto.com/search?q=gluten+free+pasta',
        swiggy: 'https://swiggy.com/search?q=barilla+pasta',
        bigbasket: 'https://bigbasket.com/search?q=brown+rice+pasta'
      }
    },
    {
      name: 'Lentil Pasta',
      brand: 'Barilla Red Lentil',
      health_score: 80,
      nutrition: { calories: 165, sugar: 2, protein: 13, fat: 1, fiber: 6 },
      benefits: ['Plant protein', 'Gluten-free', 'High in iron'],
      description: 'High-protein pasta made from red lentils',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=lentil+pasta',
        zepto: 'https://zepto.com/search?q=red+lentil+pasta',
        swiggy: 'https://swiggy.com/search?q=lentil+pasta',
        bigbasket: 'https://bigbasket.com/search?q=lentil+pasta'
      }
    },
    {
      name: 'Chickpea Pasta',
      brand: 'Banza',
      health_score: 79,
      nutrition: { calories: 170, sugar: 2, protein: 14, fat: 2, fiber: 8 },
      benefits: ['High protein', 'High fiber', 'Gluten-free'],
      description: 'Protein-rich pasta made from chickpeas',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=chickpea+pasta',
        zepto: 'https://zepto.com/search?q=chickpea+pasta',
        swiggy: 'https://swiggy.com/search?q=banza+pasta',
        bigbasket: 'https://bigbasket.com/search?q=chickpea+pasta'
      }
    },
    {
      name: 'Spinach Pasta',
      brand: 'Del Monte Veggie Twist',
      health_score: 73,
      nutrition: { calories: 182, sugar: 2, protein: 7, fat: 1.5, fiber: 5 },
      benefits: ['Real spinach', 'Iron fortified', 'Vegetable goodness'],
      description: 'Colorful pasta with real spinach',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=spinach+pasta',
        zepto: 'https://zepto.com/search?q=veggie+pasta',
        swiggy: 'https://swiggy.com/search?q=del+monte+veggie',
        bigbasket: 'https://bigbasket.com/search?q=spinach+pasta'
      }
    },
    {
      name: 'Ragi Pasta',
      brand: 'Timios',
      health_score: 77,
      nutrition: { calories: 168, sugar: 1, protein: 7, fat: 1, fiber: 6 },
      benefits: ['Finger millet', 'High calcium', 'Gluten-free'],
      description: 'Healthy ragi pasta for kids and adults',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ragi+pasta',
        zepto: 'https://zepto.com/search?q=ragi+pasta',
        swiggy: 'https://swiggy.com/search?q=timios+pasta',
        bigbasket: 'https://bigbasket.com/search?q=ragi+pasta'
      }
    },
    {
      name: 'Penne Rigate (Durum Wheat)',
      brand: 'Barilla',
      health_score: 70,
      nutrition: { calories: 192, sugar: 3, protein: 7, fat: 1, fiber: 3 },
      benefits: ['Al dente texture', 'Durum wheat', 'Classic Italian'],
      description: 'Authentic Italian penne made from durum wheat',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=barilla+penne',
        zepto: 'https://zepto.com/search?q=penne+pasta',
        swiggy: 'https://swiggy.com/search?q=barilla',
        bigbasket: 'https://bigbasket.com/search?q=penne+pasta'
      }
    },
    {
      name: 'Oats Pasta',
      brand: 'Disano',
      health_score: 75,
      nutrition: { calories: 176, sugar: 2, protein: 7, fat: 2, fiber: 6 },
      benefits: ['Oats goodness', 'Heart healthy', 'Beta-glucan'],
      description: 'Wholesome pasta enriched with oats',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=oats+pasta',
        zepto: 'https://zepto.com/search?q=disano+pasta',
        swiggy: 'https://swiggy.com/search?q=oats+pasta',
        bigbasket: 'https://bigbasket.com/search?q=oats+pasta'
      }
    }
  ],
  'condiments': [
    {
      name: 'Organic Tomato Ketchup',
      brand: 'Kissan',
      health_score: 65,
      nutrition: { calories: 25, sugar: 5, protein: 0, fat: 0, sodium: 180 },
      benefits: ['No artificial colors', 'Real tomatoes', 'Lower sodium'],
      description: 'Organic tomato ketchup with no preservatives',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kissan+organic+ketchup',
        zepto: 'https://zepto.com/search?q=organic+ketchup',
        swiggy: 'https://swiggy.com/search?q=kissan+ketchup',
        bigbasket: 'https://bigbasket.com/search?q=organic+ketchup'
      }
    },
    {
      name: 'Green Chutney',
      brand: 'Mother\'s Recipe',
      health_score: 72,
      nutrition: { calories: 15, sugar: 2, protein: 1, fat: 0.5, fiber: 1 },
      benefits: ['Fresh herbs', 'Low calorie', 'Traditional'],
      description: 'Fresh green chutney made with coriander and mint',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mothers+recipe+chutney',
        zepto: 'https://zepto.com/search?q=green+chutney',
        swiggy: 'https://swiggy.com/search?q=mothers+recipe',
        bigbasket: 'https://bigbasket.com/search?q=green+chutney'
      }
    },
    {
      name: 'Himalayan Pink Salt',
      brand: 'Tata',
      health_score: 80,
      nutrition: { calories: 0, sugar: 0, protein: 0, fat: 0, sodium: 590 },
      benefits: ['84 trace minerals', 'Unrefined', 'Natural'],
      description: 'Pure Himalayan pink salt with natural minerals',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=pink+salt',
        zepto: 'https://zepto.com/search?q=himalayan+salt',
        swiggy: 'https://swiggy.com/search?q=pink+salt',
        bigbasket: 'https://bigbasket.com/search?q=himalayan+salt'
      }
    },
    {
      name: 'Tamarind Chutney',
      brand: 'Patanjali',
      health_score: 68,
      nutrition: { calories: 30, sugar: 6, protein: 0.5, fat: 0, fiber: 1 },
      benefits: ['Tangy flavor', 'Digestive', 'Natural ingredients'],
      description: 'Sweet and tangy tamarind chutney',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=tamarind+chutney',
        zepto: 'https://zepto.com/search?q=tamarind+chutney',
        swiggy: 'https://swiggy.com/search?q=patanjali+chutney',
        bigbasket: 'https://bigbasket.com/search?q=tamarind+chutney'
      }
    },
    {
      name: 'Mustard Sauce',
      brand: 'Veeba',
      health_score: 70,
      nutrition: { calories: 20, sugar: 2, protein: 1, fat: 1, sodium: 150 },
      benefits: ['Tangy taste', 'Low calorie', 'Versatile'],
      description: 'Classic mustard sauce for sandwiches',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=veeba+mustard',
        zepto: 'https://zepto.com/search?q=mustard+sauce',
        swiggy: 'https://swiggy.com/search?q=veeba+sauce',
        bigbasket: 'https://bigbasket.com/search?q=mustard+sauce'
      }
    },
    {
      name: 'Mayonnaise (Eggless)',
      brand: 'Veeba',
      health_score: 62,
      nutrition: { calories: 110, sugar: 2, protein: 0, fat: 12, sodium: 190 },
      benefits: ['Eggless', 'Creamy texture', 'Vegetarian'],
      description: 'Creamy eggless mayonnaise perfect for spreads',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=veeba+mayo',
        zepto: 'https://zepto.com/search?q=eggless+mayonnaise',
        swiggy: 'https://swiggy.com/search?q=veeba+mayo',
        bigbasket: 'https://bigbasket.com/search?q=eggless+mayo'
      }
    },
    {
      name: 'Schezwan Sauce',
      brand: 'Ching\'s Secret',
      health_score: 64,
      nutrition: { calories: 35, sugar: 4, protein: 1, fat: 1, sodium: 220 },
      benefits: ['Spicy flavor', 'Indo-Chinese', 'Authentic'],
      description: 'Spicy schezwan sauce for Chinese dishes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=chings+schezwan',
        zepto: 'https://zepto.com/search?q=schezwan+sauce',
        swiggy: 'https://swiggy.com/search?q=chings+sauce',
        bigbasket: 'https://bigbasket.com/search?q=schezwan+sauce'
      }
    },
    {
      name: 'Soy Sauce (Low Sodium)',
      brand: 'Kikkoman',
      health_score: 74,
      nutrition: { calories: 10, sugar: 1, protein: 1, fat: 0, sodium: 390 },
      benefits: ['37% less sodium', 'Authentic', 'Naturally brewed'],
      description: 'Classic soy sauce with reduced sodium',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kikkoman+soy',
        zepto: 'https://zepto.com/search?q=low+sodium+soy',
        swiggy: 'https://swiggy.com/search?q=kikkoman',
        bigbasket: 'https://bigbasket.com/search?q=low+sodium+soy+sauce'
      }
    },
    {
      name: 'Red Chilli Sauce',
      brand: 'Maggi',
      health_score: 66,
      nutrition: { calories: 18, sugar: 3, protein: 0, fat: 0, sodium: 200 },
      benefits: ['Hot & spicy', 'No MSG', 'Versatile'],
      description: 'Spicy red chilli sauce for extra heat',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=maggi+chilli+sauce',
        zepto: 'https://zepto.com/search?q=red+chilli+sauce',
        swiggy: 'https://swiggy.com/search?q=maggi+sauce',
        bigbasket: 'https://bigbasket.com/search?q=red+chilli+sauce'
      }
    },
    {
      name: 'Vinegar (Apple Cider)',
      brand: 'Bragg',
      health_score: 78,
      nutrition: { calories: 3, sugar: 0, protein: 0, fat: 0, sodium: 0 },
      benefits: ['Raw & unfiltered', 'Probiotics', 'Organic'],
      description: 'Organic apple cider vinegar with mother',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=bragg+vinegar',
        zepto: 'https://zepto.com/search?q=apple+cider+vinegar',
        swiggy: 'https://swiggy.com/search?q=bragg',
        bigbasket: 'https://bigbasket.com/search?q=apple+cider+vinegar'
      }
    }
  ],
  'grains': [
    {
      name: 'Brown Rice',
      brand: 'India Gate',
      health_score: 82,
      nutrition: { calories: 350, sugar: 1, protein: 7, fat: 3, fiber: 4 },
      benefits: ['Whole grain', 'High fiber', 'Low GI'],
      description: 'Premium brown rice with intact bran layer',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=brown+rice',
        zepto: 'https://zepto.com/search?q=brown+rice',
        swiggy: 'https://swiggy.com/search?q=india+gate+brown',
        bigbasket: 'https://bigbasket.com/search?q=brown+rice'
      }
    },
    {
      name: 'Quinoa',
      brand: 'Organic Tattva',
      health_score: 88,
      nutrition: { calories: 368, sugar: 0, protein: 14, fat: 6, fiber: 7 },
      benefits: ['Complete protein', 'Gluten-free', 'High fiber'],
      description: 'Nutritious quinoa - a complete protein source',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=quinoa',
        zepto: 'https://zepto.com/search?q=quinoa',
        swiggy: 'https://swiggy.com/search?q=organic+quinoa',
        bigbasket: 'https://bigbasket.com/search?q=quinoa'
      }
    },
    {
      name: 'Whole Wheat Atta',
      brand: 'Aashirvaad',
      health_score: 80,
      nutrition: { calories: 340, sugar: 2, protein: 12, fat: 2, fiber: 12 },
      benefits: ['100% whole wheat', 'High fiber', 'Rich in protein'],
      description: 'Premium whole wheat flour for healthy rotis',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=aashirvaad+atta',
        zepto: 'https://zepto.com/search?q=wheat+atta',
        swiggy: 'https://swiggy.com/search?q=aashirvaad',
        bigbasket: 'https://bigbasket.com/search?q=aashirvaad+atta'
      }
    },
    {
      name: 'Oats (Rolled)',
      brand: 'Quaker',
      health_score: 86,
      nutrition: { calories: 370, sugar: 1, protein: 13, fat: 7, fiber: 10 },
      benefits: ['Beta-glucan', 'Heart healthy', 'High fiber'],
      description: 'Whole grain rolled oats for porridge',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=quaker+oats',
        zepto: 'https://zepto.com/search?q=rolled+oats',
        swiggy: 'https://swiggy.com/search?q=quaker',
        bigbasket: 'https://bigbasket.com/search?q=rolled+oats'
      }
    },
    {
      name: 'Millets Mix',
      brand: 'Tata Sampann',
      health_score: 84,
      nutrition: { calories: 360, sugar: 1, protein: 11, fat: 4, fiber: 11 },
      benefits: ['5 millets', 'Gluten-free', 'High minerals'],
      description: 'Multi-millet flour for healthy rotis',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=millets+mix',
        zepto: 'https://zepto.com/search?q=multi+millet',
        swiggy: 'https://swiggy.com/search?q=tata+sampann+millets',
        bigbasket: 'https://bigbasket.com/search?q=millets+mix'
      }
    },
    {
      name: 'Ragi Flour',
      brand: 'Conscious Food',
      health_score: 85,
      nutrition: { calories: 336, sugar: 0, protein: 7, fat: 1, fiber: 11 },
      benefits: ['High calcium', 'Iron rich', 'Finger millet'],
      description: 'Nutritious ragi flour for healthy recipes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ragi+flour',
        zepto: 'https://zepto.com/search?q=finger+millet+flour',
        swiggy: 'https://swiggy.com/search?q=ragi+flour',
        bigbasket: 'https://bigbasket.com/search?q=ragi+flour'
      }
    },
    {
      name: 'Jowar Flour',
      brand: 'Organic India',
      health_score: 83,
      nutrition: { calories: 349, sugar: 2, protein: 11, fat: 3, fiber: 10 },
      benefits: ['Gluten-free', 'Low GI', 'Sorghum'],
      description: 'Wholesome jowar flour for rotis and bhakri',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=jowar+flour',
        zepto: 'https://zepto.com/search?q=sorghum+flour',
        swiggy: 'https://swiggy.com/search?q=jowar+flour',
        bigbasket: 'https://bigbasket.com/search?q=jowar+flour'
      }
    },
    {
      name: 'Bajra Flour',
      brand: 'Patanjali',
      health_score: 82,
      nutrition: { calories: 361, sugar: 2, protein: 12, fat: 5, fiber: 11 },
      benefits: ['Pearl millet', 'Iron rich', 'Warming'],
      description: 'Traditional bajra flour for winter nutrition',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=bajra+flour',
        zepto: 'https://zepto.com/search?q=pearl+millet',
        swiggy: 'https://swiggy.com/search?q=bajra+flour',
        bigbasket: 'https://bigbasket.com/search?q=bajra+flour'
      }
    },
    {
      name: 'Basmati Rice (Brown)',
      brand: 'Daawat',
      health_score: 81,
      nutrition: { calories: 345, sugar: 1, protein: 8, fat: 2, fiber: 4 },
      benefits: ['Aromatic', 'Whole grain', 'Low GI'],
      description: 'Premium brown basmati with natural aroma',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=brown+basmati',
        zepto: 'https://zepto.com/search?q=brown+basmati',
        swiggy: 'https://swiggy.com/search?q=daawat+brown',
        bigbasket: 'https://bigbasket.com/search?q=brown+basmati'
      }
    },
    {
      name: 'Amaranth (Rajgira)',
      brand: 'True Elements',
      health_score: 87,
      nutrition: { calories: 371, sugar: 1, protein: 14, fat: 7, fiber: 7 },
      benefits: ['Complete protein', 'Gluten-free', 'High lysine'],
      description: 'Ancient super grain rajgira for fasting',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amaranth+flour',
        zepto: 'https://zepto.com/search?q=rajgira',
        swiggy: 'https://swiggy.com/search?q=amaranth',
        bigbasket: 'https://bigbasket.com/search?q=rajgira+flour'
      }
    }
  ],
  'proteins': [
    {
      name: 'Whey Protein',
      brand: 'MuscleBlaze',
      health_score: 85,
      nutrition: { calories: 120, sugar: 2, protein: 25, fat: 2, fiber: 1 },
      benefits: ['High protein', 'Muscle building', 'Low fat'],
      description: 'Premium whey protein for fitness enthusiasts',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=muscleblaze+whey',
        zepto: 'https://zepto.com/search?q=whey+protein',
        swiggy: 'https://swiggy.com/search?q=protein+powder',
        bigbasket: 'https://bigbasket.com/search?q=whey+protein'
      }
    },
    {
      name: 'Moong Dal',
      brand: 'Tata Sampann',
      health_score: 83,
      nutrition: { calories: 347, sugar: 2, protein: 24, fat: 1, fiber: 16 },
      benefits: ['High protein', 'Rich in fiber', 'Easy to digest'],
      description: 'Premium quality moong dal - protein rich',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=moong+dal',
        zepto: 'https://zepto.com/search?q=moong+dal',
        swiggy: 'https://swiggy.com/search?q=tata+sampann+dal',
        bigbasket: 'https://bigbasket.com/search?q=moong+dal'
      }
    },
    {
      name: 'Soya Chunks',
      brand: 'Nutrela',
      health_score: 84,
      nutrition: { calories: 345, sugar: 0, protein: 52, fat: 1, fiber: 13 },
      benefits: ['52% protein', 'Low fat', 'Vegetarian'],
      description: 'High protein soya chunks - excellent meat alternative',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nutrela+soya',
        zepto: 'https://zepto.com/search?q=soya+chunks',
        swiggy: 'https://swiggy.com/search?q=nutrela',
        bigbasket: 'https://bigbasket.com/search?q=soya+chunks'
      }
    },
    {
      name: 'Chana Dal',
      brand: 'Tata Sampann',
      health_score: 82,
      nutrition: { calories: 364, sugar: 2, protein: 22, fat: 6, fiber: 15 },
      benefits: ['High protein', 'Folate rich', 'B vitamins'],
      description: 'Premium chana dal for protein-rich meals',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=chana+dal',
        zepto: 'https://zepto.com/search?q=chana+dal',
        swiggy: 'https://swiggy.com/search?q=tata+sampann+chana',
        bigbasket: 'https://bigbasket.com/search?q=chana+dal'
      }
    },
    {
      name: 'Peanut Butter',
      brand: 'MyFitness',
      health_score: 78,
      nutrition: { calories: 190, sugar: 2, protein: 8, fat: 16, fiber: 2 },
      benefits: ['Natural protein', 'Healthy fats', 'Vitamin E'],
      description: 'All-natural peanut butter high in protein',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=myfitness+peanut',
        zepto: 'https://zepto.com/search?q=peanut+butter',
        swiggy: 'https://swiggy.com/search?q=myfitness',
        bigbasket: 'https://bigbasket.com/search?q=peanut+butter'
      }
    },
    {
      name: 'Egg White Powder',
      brand: 'Nakpro',
      health_score: 86,
      nutrition: { calories: 110, sugar: 0, protein: 24, fat: 0, fiber: 0 },
      benefits: ['Pure protein', 'Zero fat', 'Quick absorption'],
      description: 'Pure egg white protein powder',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=egg+white+powder',
        zepto: 'https://zepto.com/search?q=egg+protein',
        swiggy: 'https://swiggy.com/search?q=nakpro',
        bigbasket: 'https://bigbasket.com/search?q=egg+white+powder'
      }
    },
    {
      name: 'Rajma (Kidney Beans)',
      brand: 'Tata Sampann',
      health_score: 81,
      nutrition: { calories: 333, sugar: 2, protein: 22, fat: 1, fiber: 15 },
      benefits: ['Plant protein', 'Iron rich', 'Heart healthy'],
      description: 'Premium rajma beans for protein-rich curry',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=rajma',
        zepto: 'https://zepto.com/search?q=kidney+beans',
        swiggy: 'https://swiggy.com/search?q=rajma',
        bigbasket: 'https://bigbasket.com/search?q=rajma'
      }
    },
    {
      name: 'Chickpeas (Kabuli Chana)',
      brand: 'Tata Sampann',
      health_score: 82,
      nutrition: { calories: 364, sugar: 11, protein: 19, fat: 6, fiber: 17 },
      benefits: ['High fiber', 'Protein rich', 'Low GI'],
      description: 'Premium chickpeas for healthy meals',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kabuli+chana',
        zepto: 'https://zepto.com/search?q=chickpeas',
        swiggy: 'https://swiggy.com/search?q=kabuli+chana',
        bigbasket: 'https://bigbasket.com/search?q=chickpeas'
      }
    },
    {
      name: 'Toor Dal',
      brand: 'Tata Sampann',
      health_score: 81,
      nutrition: { calories: 343, sugar: 2, protein: 22, fat: 1, fiber: 15 },
      benefits: ['High protein', 'Folic acid', 'Traditional'],
      description: 'Premium toor dal for daily nutrition',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=toor+dal',
        zepto: 'https://zepto.com/search?q=toor+dal',
        swiggy: 'https://swiggy.com/search?q=tata+sampann+toor',
        bigbasket: 'https://bigbasket.com/search?q=toor+dal'
      }
    },
    {
      name: 'Pea Protein',
      brand: 'OZiva',
      health_score: 84,
      nutrition: { calories: 115, sugar: 1, protein: 24, fat: 1, fiber: 2 },
      benefits: ['Plant-based', 'Vegan', 'Hypoallergenic'],
      description: 'Plant-based pea protein for vegans',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=pea+protein',
        zepto: 'https://zepto.com/search?q=oziva+protein',
        swiggy: 'https://swiggy.com/search?q=pea+protein',
        bigbasket: 'https://bigbasket.com/search?q=pea+protein'
      }
    }
  ],
  'bread': [
    {
      name: 'Brown Bread',
      brand: 'Britannia',
      health_score: 70,
      nutrition: { calories: 240, sugar: 3, protein: 8, fat: 3, fiber: 6 },
      benefits: ['Whole wheat', 'High fiber', 'No maida'],
      description: 'Wholesome brown bread made with whole wheat',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=britannia+brown+bread',
        zepto: 'https://zepto.com/search?q=brown+bread',
        swiggy: 'https://swiggy.com/search?q=brown+bread',
        bigbasket: 'https://bigbasket.com/search?q=brown+bread'
      }
    },
    {
      name: 'Multigrain Bread',
      brand: 'Modern',
      health_score: 75,
      nutrition: { calories: 230, sugar: 2, protein: 9, fat: 4, fiber: 8 },
      benefits: ['7 grains', 'High fiber', 'Omega-3'],
      description: 'Nutritious multigrain bread with seeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=multigrain+bread',
        zepto: 'https://zepto.com/search?q=multigrain+bread',
        swiggy: 'https://swiggy.com/search?q=modern+bread',
        bigbasket: 'https://bigbasket.com/search?q=multigrain+bread'
      }
    },
    {
      name: 'Whole Wheat Bread',
      brand: 'Harvest Gold',
      health_score: 72,
      nutrition: { calories: 235, sugar: 3, protein: 8, fat: 3, fiber: 7 },
      benefits: ['100% whole wheat', 'No preservatives', 'Fiber rich'],
      description: 'Soft whole wheat bread for daily use',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=harvest+gold+wheat',
        zepto: 'https://zepto.com/search?q=whole+wheat+bread',
        swiggy: 'https://swiggy.com/search?q=harvest+gold',
        bigbasket: 'https://bigbasket.com/search?q=whole+wheat+bread'
      }
    },
    {
      name: 'Oats Bread',
      brand: 'Britannia Nutrichoice',
      health_score: 74,
      nutrition: { calories: 228, sugar: 2, protein: 9, fat: 3, fiber: 8 },
      benefits: ['Oats goodness', 'High fiber', 'Heart healthy'],
      description: 'Wholesome bread enriched with oats',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nutrichoice+oats+bread',
        zepto: 'https://zepto.com/search?q=oats+bread',
        swiggy: 'https://swiggy.com/search?q=britannia+oats',
        bigbasket: 'https://bigbasket.com/search?q=oats+bread'
      }
    },
    {
      name: 'Rye Bread',
      brand: 'English Oven',
      health_score: 76,
      nutrition: { calories: 220, sugar: 2, protein: 7, fat: 2, fiber: 9 },
      benefits: ['High fiber', 'Low GI', 'Dense texture'],
      description: 'Traditional rye bread for health-conscious',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=rye+bread',
        zepto: 'https://zepto.com/search?q=rye+bread',
        swiggy: 'https://swiggy.com/search?q=english+oven',
        bigbasket: 'https://bigbasket.com/search?q=rye+bread'
      }
    },
    {
      name: 'Sourdough Bread',
      brand: 'The Baker\'s Dozen',
      health_score: 73,
      nutrition: { calories: 245, sugar: 2, protein: 9, fat: 3, fiber: 6 },
      benefits: ['Natural fermentation', 'Probiotic', 'Easy to digest'],
      description: 'Artisan sourdough with natural starter',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=sourdough+bread',
        zepto: 'https://zepto.com/search?q=sourdough',
        swiggy: 'https://swiggy.com/search?q=sourdough+bread',
        bigbasket: 'https://bigbasket.com/search?q=sourdough'
      }
    },
    {
      name: 'Millet Bread',
      brand: 'Modern',
      health_score: 77,
      nutrition: { calories: 225, sugar: 1, protein: 8, fat: 3, fiber: 9 },
      benefits: ['Millet goodness', 'Gluten-friendly', 'High fiber'],
      description: 'Nutritious bread made with millets',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=millet+bread',
        zepto: 'https://zepto.com/search?q=millet+bread',
        swiggy: 'https://swiggy.com/search?q=modern+millet',
        bigbasket: 'https://bigbasket.com/search?q=millet+bread'
      }
    },
    {
      name: 'Flaxseed Bread',
      brand: 'Harvest Gold',
      health_score: 76,
      nutrition: { calories: 232, sugar: 2, protein: 9, fat: 5, fiber: 8 },
      benefits: ['Omega-3 rich', 'Flaxseeds', 'High fiber'],
      description: 'Healthy bread enriched with flaxseeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=flaxseed+bread',
        zepto: 'https://zepto.com/search?q=flax+bread',
        swiggy: 'https://swiggy.com/search?q=flaxseed+bread',
        bigbasket: 'https://bigbasket.com/search?q=flaxseed+bread'
      }
    },
    {
      name: 'Gluten-Free Bread',
      brand: 'The Bread Story',
      health_score: 71,
      nutrition: { calories: 250, sugar: 3, protein: 6, fat: 4, fiber: 5 },
      benefits: ['100% gluten-free', 'Celiac safe', 'Rice & corn'],
      description: 'Soft gluten-free bread for special diets',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=gluten+free+bread',
        zepto: 'https://zepto.com/search?q=gluten+free+bread',
        swiggy: 'https://swiggy.com/search?q=gluten+free',
        bigbasket: 'https://bigbasket.com/search?q=gluten+free+bread'
      }
    },
    {
      name: 'Chia Seed Bread',
      brand: 'Modern',
      health_score: 75,
      nutrition: { calories: 238, sugar: 2, protein: 9, fat: 5, fiber: 10 },
      benefits: ['Chia seeds', 'Omega-3', 'Super fiber'],
      description: 'High-fiber bread with chia seeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=chia+seed+bread',
        zepto: 'https://zepto.com/search?q=chia+bread',
        swiggy: 'https://swiggy.com/search?q=chia+seed+bread',
        bigbasket: 'https://bigbasket.com/search?q=chia+seed+bread'
      }
    }
  ],
  'pickles': [
    {
      name: 'Mango Pickle (Low Oil)',
      brand: 'Priya',
      health_score: 62,
      nutrition: { calories: 35, sugar: 3, protein: 1, fat: 2, sodium: 450 },
      benefits: ['Traditional recipe', 'Lower oil', 'Probiotic'],
      description: 'Authentic mango pickle with reduced oil',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=priya+pickle',
        zepto: 'https://zepto.com/search?q=mango+pickle',
        swiggy: 'https://swiggy.com/search?q=priya+pickle',
        bigbasket: 'https://bigbasket.com/search?q=mango+pickle'
      }
    },
    {
      name: 'Mixed Vegetable Pickle',
      brand: 'Mother\'s Recipe',
      health_score: 64,
      nutrition: { calories: 38, sugar: 2, protein: 1, fat: 2.5, sodium: 470 },
      benefits: ['5 vegetables', 'Traditional', 'Appetizer'],
      description: 'Tangy mixed vegetable pickle',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mothers+recipe+pickle',
        zepto: 'https://zepto.com/search?q=mixed+vegetable+pickle',
        swiggy: 'https://swiggy.com/search?q=mothers+pickle',
        bigbasket: 'https://bigbasket.com/search?q=mixed+pickle'
      }
    },
    {
      name: 'Lime Pickle',
      brand: 'Patanjali',
      health_score: 66,
      nutrition: { calories: 32, sugar: 3, protein: 1, fat: 2, sodium: 420 },
      benefits: ['Vitamin C', 'Digestive', 'Natural ingredients'],
      description: 'Tangy lime pickle with traditional spices',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=patanjali+lime+pickle',
        zepto: 'https://zepto.com/search?q=lime+pickle',
        swiggy: 'https://swiggy.com/search?q=lime+pickle',
        bigbasket: 'https://bigbasket.com/search?q=lime+pickle'
      }
    },
    {
      name: 'Garlic Pickle',
      brand: 'Aachi',
      health_score: 68,
      nutrition: { calories: 40, sugar: 2, protein: 1.5, fat: 3, sodium: 460 },
      benefits: ['Immunity boost', 'Antibacterial', 'Aromatic'],
      description: 'Spicy garlic pickle with health benefits',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=garlic+pickle',
        zepto: 'https://zepto.com/search?q=garlic+pickle',
        swiggy: 'https://swiggy.com/search?q=aachi+pickle',
        bigbasket: 'https://bigbasket.com/search?q=garlic+pickle'
      }
    },
    {
      name: 'Carrot Pickle',
      brand: 'Tops',
      health_score: 65,
      nutrition: { calories: 36, sugar: 4, protein: 1, fat: 2, sodium: 440 },
      benefits: ['Vitamin A', 'Crunchy', 'Colorful'],
      description: 'Sweet and spicy carrot pickle',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=carrot+pickle',
        zepto: 'https://zepto.com/search?q=carrot+pickle',
        swiggy: 'https://swiggy.com/search?q=carrot+pickle',
        bigbasket: 'https://bigbasket.com/search?q=carrot+pickle'
      }
    },
    {
      name: 'Ginger Pickle',
      brand: 'Nilon\'s',
      health_score: 67,
      nutrition: { calories: 34, sugar: 3, protein: 1, fat: 2, sodium: 430 },
      benefits: ['Anti-inflammatory', 'Digestive aid', 'Warming'],
      description: 'Zesty ginger pickle for digestion',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ginger+pickle',
        zepto: 'https://zepto.com/search?q=ginger+pickle',
        swiggy: 'https://swiggy.com/search?q=nilons+pickle',
        bigbasket: 'https://bigbasket.com/search?q=ginger+pickle'
      }
    },
    {
      name: 'Amla Pickle',
      brand: 'Patanjali',
      health_score: 70,
      nutrition: { calories: 30, sugar: 2, protein: 1, fat: 1.5, sodium: 400 },
      benefits: ['Vitamin C rich', 'Immunity', 'Antioxidants'],
      description: 'Healthy amla pickle rich in vitamin C',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=amla+pickle',
        zepto: 'https://zepto.com/search?q=amla+pickle',
        swiggy: 'https://swiggy.com/search?q=patanjali+amla',
        bigbasket: 'https://bigbasket.com/search?q=amla+pickle'
      }
    },
    {
      name: 'Red Chilli Pickle',
      brand: 'Aachi',
      health_score: 63,
      nutrition: { calories: 42, sugar: 2, protein: 1, fat: 3, sodium: 480 },
      benefits: ['Spicy', 'Metabolism boost', 'Traditional'],
      description: 'Fiery red chilli pickle for spice lovers',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=red+chilli+pickle',
        zepto: 'https://zepto.com/search?q=chilli+pickle',
        swiggy: 'https://swiggy.com/search?q=aachi+chilli',
        bigbasket: 'https://bigbasket.com/search?q=chilli+pickle'
      }
    },
    {
      name: 'Kerala Mango Pickle',
      brand: 'Nirapara',
      health_score: 64,
      nutrition: { calories: 37, sugar: 4, protein: 1, fat: 2, sodium: 455 },
      benefits: ['Authentic Kerala', 'Sweet & sour', 'Traditional'],
      description: 'Authentic Kerala-style mango pickle',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kerala+mango+pickle',
        zepto: 'https://zepto.com/search?q=kerala+pickle',
        swiggy: 'https://swiggy.com/search?q=nirapara',
        bigbasket: 'https://bigbasket.com/search?q=kerala+pickle'
      }
    },
    {
      name: 'Lemon Pickle (Nimbu)',
      brand: 'Mother\'s Recipe',
      health_score: 66,
      nutrition: { calories: 33, sugar: 3, protein: 1, fat: 2, sodium: 425 },
      benefits: ['Vitamin C', 'Tangy', 'Digestive'],
      description: 'Tangy lemon pickle for zesty flavor',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=lemon+pickle',
        zepto: 'https://zepto.com/search?q=nimbu+pickle',
        swiggy: 'https://swiggy.com/search?q=mothers+lemon',
        bigbasket: 'https://bigbasket.com/search?q=lemon+pickle'
      }
    }
  ],
  'spreads': [
    {
      name: 'Peanut Butter (Natural)',
      brand: 'MyFitness',
      health_score: 76,
      nutrition: { calories: 190, sugar: 2, protein: 8, fat: 16, fiber: 2 },
      benefits: ['No added sugar', 'High protein', 'Natural'],
      description: 'All-natural peanut butter with no additives',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=myfitness+peanut+butter',
        zepto: 'https://zepto.com/search?q=peanut+butter',
        swiggy: 'https://swiggy.com/search?q=myfitness',
        bigbasket: 'https://bigbasket.com/search?q=natural+peanut+butter'
      }
    },
    {
      name: 'Almond Butter',
      brand: 'Alpino',
      health_score: 80,
      nutrition: { calories: 200, sugar: 1, protein: 7, fat: 18, fiber: 3 },
      benefits: ['Rich in vitamin E', 'Healthy fats', 'No palm oil'],
      description: 'Premium almond butter - nutrient dense spread',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=alpino+almond+butter',
        zepto: 'https://zepto.com/search?q=almond+butter',
        swiggy: 'https://swiggy.com/search?q=almond+butter',
        bigbasket: 'https://bigbasket.com/search?q=alpino+butter'
      }
    },
    {
      name: 'Sugar-Free Jam',
      brand: 'Diabexy',
      health_score: 72,
      nutrition: { calories: 20, sugar: 0, protein: 0, fat: 0, fiber: 2 },
      benefits: ['Zero sugar', 'Real fruit', 'Diabetic friendly'],
      description: 'Delicious jam sweetened with stevia',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=sugar+free+jam',
        zepto: 'https://zepto.com/search?q=diabetic+jam',
        swiggy: 'https://swiggy.com/search?q=diabexy',
        bigbasket: 'https://bigbasket.com/search?q=sugar+free+jam'
      }
    },
    {
      name: 'Cashew Butter',
      brand: 'Alpino',
      health_score: 78,
      nutrition: { calories: 195, sugar: 2, protein: 6, fat: 17, fiber: 2 },
      benefits: ['Creamy texture', 'Healthy fats', 'Magnesium'],
      description: 'Smooth cashew butter rich in minerals',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=cashew+butter',
        zepto: 'https://zepto.com/search?q=cashew+butter',
        swiggy: 'https://swiggy.com/search?q=alpino+cashew',
        bigbasket: 'https://bigbasket.com/search?q=cashew+butter'
      }
    },
    {
      name: 'Chocolate Spread (Hazelnut)',
      brand: 'Nutella',
      health_score: 60,
      nutrition: { calories: 210, sugar: 21, protein: 3, fat: 12, fiber: 1 },
      benefits: ['Classic taste', 'Hazelnut & cocoa', 'Indulgent'],
      description: 'Classic hazelnut chocolate spread',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nutella',
        zepto: 'https://zepto.com/search?q=nutella',
        swiggy: 'https://swiggy.com/search?q=nutella',
        bigbasket: 'https://bigbasket.com/search?q=nutella'
      }
    },
    {
      name: 'Honey (Raw)',
      brand: 'Dabur',
      health_score: 70,
      nutrition: { calories: 64, sugar: 17, protein: 0, fat: 0, fiber: 0 },
      benefits: ['Natural sweetener', 'Antioxidants', 'Antibacterial'],
      description: 'Pure raw honey for natural sweetness',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=dabur+honey',
        zepto: 'https://zepto.com/search?q=raw+honey',
        swiggy: 'https://swiggy.com/search?q=dabur+honey',
        bigbasket: 'https://bigbasket.com/search?q=raw+honey'
      }
    },
    {
      name: 'Mixed Fruit Jam',
      brand: 'Kissan',
      health_score: 64,
      nutrition: { calories: 50, sugar: 12, protein: 0, fat: 0, fiber: 1 },
      benefits: ['Mixed fruits', 'Classic taste', 'Breakfast staple'],
      description: 'Traditional mixed fruit jam',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kissan+jam',
        zepto: 'https://zepto.com/search?q=mixed+fruit+jam',
        swiggy: 'https://swiggy.com/search?q=kissan',
        bigbasket: 'https://bigbasket.com/search?q=mixed+fruit+jam'
      }
    },
    {
      name: 'Coconut Butter',
      brand: 'Nutty Gritties',
      health_score: 74,
      nutrition: { calories: 185, sugar: 3, protein: 4, fat: 18, fiber: 4 },
      benefits: ['MCT oil', 'Fiber rich', 'Tropical flavor'],
      description: 'Creamy coconut butter with natural MCTs',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=coconut+butter',
        zepto: 'https://zepto.com/search?q=coconut+butter',
        swiggy: 'https://swiggy.com/search?q=nutty+gritties',
        bigbasket: 'https://bigbasket.com/search?q=coconut+butter'
      }
    },
    {
      name: 'Date Spread',
      brand: 'True Elements',
      health_score: 73,
      nutrition: { calories: 75, sugar: 16, protein: 1, fat: 0, fiber: 2 },
      benefits: ['Natural sweetener', 'No added sugar', 'Iron rich'],
      description: 'Natural date spread for healthy sweetness',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=date+spread',
        zepto: 'https://zepto.com/search?q=date+spread',
        swiggy: 'https://swiggy.com/search?q=true+elements+date',
        bigbasket: 'https://bigbasket.com/search?q=date+spread'
      }
    },
    {
      name: 'Tahini (Sesame Paste)',
      brand: 'Wingreens Farms',
      health_score: 77,
      nutrition: { calories: 178, sugar: 0, protein: 5, fat: 16, fiber: 3 },
      benefits: ['Calcium rich', 'Healthy fats', 'Middle Eastern'],
      description: 'Authentic tahini paste from sesame seeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=tahini',
        zepto: 'https://zepto.com/search?q=tahini+paste',
        swiggy: 'https://swiggy.com/search?q=wingreens+tahini',
        bigbasket: 'https://bigbasket.com/search?q=tahini'
      }
    }
  ],
  'instant_mixes': [
    {
      name: 'Ragi Dosa Mix',
      brand: 'iD',
      health_score: 78,
      nutrition: { calories: 180, sugar: 1, protein: 6, fat: 2, fiber: 5 },
      benefits: ['Finger millet', 'High calcium', 'Instant'],
      description: 'Healthy ragi dosa mix ready in minutes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ragi+dosa+mix',
        zepto: 'https://zepto.com/search?q=id+dosa+mix',
        swiggy: 'https://swiggy.com/search?q=ragi+dosa',
        bigbasket: 'https://bigbasket.com/search?q=ragi+dosa+mix'
      }
    },
    {
      name: 'Oats Idli Mix',
      brand: 'Saffola',
      health_score: 76,
      nutrition: { calories: 170, sugar: 2, protein: 5, fat: 3, fiber: 4 },
      benefits: ['Oats goodness', 'Easy to make', 'High fiber'],
      description: 'Nutritious oats idli mix for healthy breakfast',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=oats+idli+mix',
        zepto: 'https://zepto.com/search?q=saffola+idli',
        swiggy: 'https://swiggy.com/search?q=oats+idli',
        bigbasket: 'https://bigbasket.com/search?q=oats+idli+mix'
      }
    },
    {
      name: 'Multigrain Uttapam Mix',
      brand: 'MTR',
      health_score: 75,
      nutrition: { calories: 175, sugar: 1, protein: 6, fat: 2, fiber: 5 },
      benefits: ['5 grains', 'Instant', 'Nutritious'],
      description: 'Quick uttapam mix with multigrain goodness',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mtr+uttapam',
        zepto: 'https://zepto.com/search?q=uttapam+mix',
        swiggy: 'https://swiggy.com/search?q=mtr+uttapam',
        bigbasket: 'https://bigbasket.com/search?q=uttapam+mix'
      }
    },
    {
      name: 'Dhokla Mix',
      brand: 'Gits',
      health_score: 74,
      nutrition: { calories: 165, sugar: 3, protein: 5, fat: 1, fiber: 3 },
      benefits: ['Steamed snack', 'Low fat', 'Gujarati'],
      description: 'Instant dhokla mix for healthy snacking',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=gits+dhokla',
        zepto: 'https://zepto.com/search?q=dhokla+mix',
        swiggy: 'https://swiggy.com/search?q=gits+dhokla',
        bigbasket: 'https://bigbasket.com/search?q=dhokla+mix'
      }
    },
    {
      name: 'Rava Idli Mix',
      brand: 'MTR',
      health_score: 72,
      nutrition: { calories: 185, sugar: 2, protein: 4, fat: 2, fiber: 2 },
      benefits: ['Quick breakfast', 'South Indian', 'Instant'],
      description: 'Classic rava idli mix ready in minutes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mtr+rava+idli',
        zepto: 'https://zepto.com/search?q=rava+idli+mix',
        swiggy: 'https://swiggy.com/search?q=mtr+rava',
        bigbasket: 'https://bigbasket.com/search?q=rava+idli+mix'
      }
    },
    {
      name: 'Multigrain Dosa Mix',
      brand: 'Slurrp Farm',
      health_score: 77,
      nutrition: { calories: 172, sugar: 1, protein: 6, fat: 2, fiber: 6 },
      benefits: ['7 grains', 'Kid-friendly', 'Nutritious'],
      description: 'Wholesome multigrain dosa for kids',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=slurrp+farm+dosa',
        zepto: 'https://zepto.com/search?q=multigrain+dosa',
        swiggy: 'https://swiggy.com/search?q=slurrp+farm',
        bigbasket: 'https://bigbasket.com/search?q=multigrain+dosa+mix'
      }
    },
    {
      name: 'Pancake Mix (Whole Wheat)',
      brand: 'Soulfull',
      health_score: 73,
      nutrition: { calories: 178, sugar: 4, protein: 5, fat: 2, fiber: 4 },
      benefits: ['Whole grain', 'Fluffy', 'Quick breakfast'],
      description: 'Wholesome pancake mix for fluffy pancakes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=pancake+mix',
        zepto: 'https://zepto.com/search?q=soulfull+pancake',
        swiggy: 'https://swiggy.com/search?q=pancake+mix',
        bigbasket: 'https://bigbasket.com/search?q=whole+wheat+pancake'
      }
    },
    {
      name: 'Khaman Mix',
      brand: 'Gits',
      health_score: 73,
      nutrition: { calories: 168, sugar: 3, protein: 4, fat: 1, fiber: 3 },
      benefits: ['Steamed', 'Low oil', 'Traditional'],
      description: 'Instant khaman mix for soft dhokla',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=khaman+mix',
        zepto: 'https://zepto.com/search?q=gits+khaman',
        swiggy: 'https://swiggy.com/search?q=khaman+mix',
        bigbasket: 'https://bigbasket.com/search?q=khaman+mix'
      }
    },
    {
      name: 'Adai Mix',
      brand: 'iD',
      health_score: 76,
      nutrition: { calories: 174, sugar: 1, protein: 7, fat: 2, fiber: 5 },
      benefits: ['High protein', 'Lentil mix', 'Traditional'],
      description: 'Protein-rich South Indian adai mix',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=adai+mix',
        zepto: 'https://zepto.com/search?q=adai+mix',
        swiggy: 'https://swiggy.com/search?q=id+adai',
        bigbasket: 'https://bigbasket.com/search?q=adai+mix'
      }
    },
    {
      name: 'Millet Chilla Mix',
      brand: 'Soulfull',
      health_score: 78,
      nutrition: { calories: 168, sugar: 1, protein: 6, fat: 2, fiber: 6 },
      benefits: ['Millet power', 'High fiber', 'Savory'],
      description: 'Nutritious millet chilla for healthy meals',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=millet+chilla',
        zepto: 'https://zepto.com/search?q=chilla+mix',
        swiggy: 'https://swiggy.com/search?q=soulfull+chilla',
        bigbasket: 'https://bigbasket.com/search?q=millet+chilla'
      }
    }
  ],
  'frozen': [
    {
      name: 'Whole Wheat Paratha',
      brand: 'ITC Farmland',
      health_score: 68,
      nutrition: { calories: 220, sugar: 2, protein: 6, fat: 6, fiber: 4 },
      benefits: ['Whole wheat', 'No preservatives', 'Ready to cook'],
      description: 'Frozen whole wheat parathas - convenient and healthy',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=itc+paratha',
        zepto: 'https://zepto.com/search?q=frozen+paratha',
        swiggy: 'https://swiggy.com/search?q=itc+farmland',
        bigbasket: 'https://bigbasket.com/search?q=frozen+paratha'
      }
    },
    {
      name: 'Multigrain Paratha',
      brand: 'Haldiram\'s',
      health_score: 70,
      nutrition: { calories: 215, sugar: 2, protein: 7, fat: 5, fiber: 5 },
      benefits: ['7 grains', 'Ready to cook', 'Nutritious'],
      description: 'Frozen multigrain parathas for quick meals',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=haldirams+paratha',
        zepto: 'https://zepto.com/search?q=multigrain+paratha',
        swiggy: 'https://swiggy.com/search?q=haldirams+frozen',
        bigbasket: 'https://bigbasket.com/search?q=multigrain+paratha'
      }
    },
    {
      name: 'Frozen Momos (Veg)',
      brand: 'Nelfood',
      health_score: 66,
      nutrition: { calories: 180, sugar: 2, protein: 5, fat: 4, fiber: 3 },
      benefits: ['Steamed', 'Vegetable filling', 'Quick snack'],
      description: 'Frozen vegetable momos ready to steam',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=frozen+momos',
        zepto: 'https://zepto.com/search?q=veg+momos',
        swiggy: 'https://swiggy.com/search?q=frozen+momos',
        bigbasket: 'https://bigbasket.com/search?q=veg+momos'
      }
    },
    {
      name: 'Frozen Sweet Corn',
      brand: 'McCain',
      health_score: 74,
      nutrition: { calories: 86, sugar: 3, protein: 3, fat: 1, fiber: 2 },
      benefits: ['No preservatives', 'Flash frozen', 'Vitamin C'],
      description: 'Flash-frozen sweet corn kernels',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=frozen+sweet+corn',
        zepto: 'https://zepto.com/search?q=mccain+corn',
        swiggy: 'https://swiggy.com/search?q=frozen+corn',
        bigbasket: 'https://bigbasket.com/search?q=frozen+sweet+corn'
      }
    },
    {
      name: 'Frozen Green Peas',
      brand: 'McCain',
      health_score: 76,
      nutrition: { calories: 81, sugar: 6, protein: 5, fat: 0.4, fiber: 5 },
      benefits: ['Flash frozen', 'Vitamin K', 'High protein'],
      description: 'Premium frozen green peas',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=frozen+green+peas',
        zepto: 'https://zepto.com/search?q=mccain+peas',
        swiggy: 'https://swiggy.com/search?q=frozen+peas',
        bigbasket: 'https://bigbasket.com/search?q=frozen+peas'
      }
    },
    {
      name: 'Frozen Spinach (Palak)',
      brand: 'Sumeru',
      health_score: 78,
      nutrition: { calories: 23, sugar: 0.4, protein: 2.9, fat: 0.4, fiber: 2.2 },
      benefits: ['Iron rich', 'Vitamin A', 'Ready to cook'],
      description: 'Flash-frozen chopped spinach',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=frozen+spinach',
        zepto: 'https://zepto.com/search?q=frozen+palak',
        swiggy: 'https://swiggy.com/search?q=sumeru+spinach',
        bigbasket: 'https://bigbasket.com/search?q=frozen+spinach'
      }
    },
    {
      name: 'Frozen Mixed Vegetables',
      brand: 'Sumeru',
      health_score: 75,
      nutrition: { calories: 65, sugar: 4, protein: 3, fat: 0.5, fiber: 4 },
      benefits: ['5 vegetables', 'Flash frozen', 'Convenient'],
      description: 'Ready-to-cook frozen mixed vegetables',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=frozen+mixed+vegetables',
        zepto: 'https://zepto.com/search?q=mixed+vegetables',
        swiggy: 'https://swiggy.com/search?q=sumeru+vegetables',
        bigbasket: 'https://bigbasket.com/search?q=frozen+mixed+veg'
      }
    },
    {
      name: 'Frozen French Fries',
      brand: 'McCain',
      health_score: 62,
      nutrition: { calories: 150, sugar: 1, protein: 2, fat: 5, fiber: 3 },
      benefits: ['Crispy', 'Quick snack', 'Air-fry ready'],
      description: 'Classic frozen French fries',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=mccain+fries',
        zepto: 'https://zepto.com/search?q=french+fries',
        swiggy: 'https://swiggy.com/search?q=mccain',
        bigbasket: 'https://bigbasket.com/search?q=frozen+fries'
      }
    },
    {
      name: 'Frozen Paneer Cubes',
      brand: 'Mother Dairy',
      health_score: 70,
      nutrition: { calories: 265, sugar: 1, protein: 18, fat: 20, fiber: 0 },
      benefits: ['High protein', 'Ready to use', 'Fresh quality'],
      description: 'Frozen paneer cubes for quick cooking',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=frozen+paneer',
        zepto: 'https://zepto.com/search?q=paneer+cubes',
        swiggy: 'https://swiggy.com/search?q=mother+dairy+paneer',
        bigbasket: 'https://bigbasket.com/search?q=frozen+paneer'
      }
    },
    {
      name: 'Frozen Roti',
      brand: 'iD Fresh',
      health_score: 69,
      nutrition: { calories: 200, sugar: 2, protein: 6, fat: 4, fiber: 4 },
      benefits: ['Whole wheat', 'Ready to heat', 'Soft texture'],
      description: 'Frozen whole wheat rotis ready in minutes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=id+fresh+roti',
        zepto: 'https://zepto.com/search?q=frozen+roti',
        swiggy: 'https://swiggy.com/search?q=id+fresh',
        bigbasket: 'https://bigbasket.com/search?q=frozen+roti'
      }
    }
  ],
  'health_drinks': [
    {
      name: 'Horlicks Protein+',
      brand: 'Horlicks',
      health_score: 72,
      nutrition: { calories: 110, sugar: 8, protein: 9, fat: 2, fiber: 1 },
      benefits: ['High protein', 'Added vitamins', 'Bone health'],
      description: 'Health drink with added protein for strength',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=horlicks+protein',
        zepto: 'https://zepto.com/search?q=horlicks',
        swiggy: 'https://swiggy.com/search?q=horlicks+protein',
        bigbasket: 'https://bigbasket.com/search?q=horlicks+protein'
      }
    },
    {
      name: 'Bournvita',
      brand: 'Cadbury',
      health_score: 68,
      nutrition: { calories: 90, sugar: 10, protein: 2, fat: 1, fiber: 0 },
      benefits: ['Energy drink', 'Added vitamins', 'Taste kids love'],
      description: 'Classic health drink fortified with nutrients',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=bournvita',
        zepto: 'https://zepto.com/search?q=bournvita',
        swiggy: 'https://swiggy.com/search?q=bournvita',
        bigbasket: 'https://bigbasket.com/search?q=bournvita'
      }
    },
    {
      name: 'Complan',
      brand: 'Heinz',
      health_score: 70,
      nutrition: { calories: 100, sugar: 9, protein: 4, fat: 2, fiber: 1 },
      benefits: ['23 nutrients', 'Growth support', 'Immunity'],
      description: 'Complete nutrition drink for all ages',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=complan',
        zepto: 'https://zepto.com/search?q=complan',
        swiggy: 'https://swiggy.com/search?q=complan',
        bigbasket: 'https://bigbasket.com/search?q=complan'
      }
    },
    {
      name: 'Protinex',
      brand: 'Danone',
      health_score: 76,
      nutrition: { calories: 95, sugar: 7, protein: 8, fat: 2, fiber: 1 },
      benefits: ['High protein',  'Muscle health', 'Immunity boost'],
      description: 'High-protein health drink for adults',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=protinex',
        zepto: 'https://zepto.com/search?q=protinex',
        swiggy: 'https://swiggy.com/search?q=protinex',
        bigbasket: 'https://bigbasket.com/search?q=protinex'
      }
    },
    {
      name: 'Milo',
      brand: 'Nestle',
      health_score: 69,
      nutrition: { calories: 95, sugar: 10, protein: 2, fat: 2, fiber: 1 },
      benefits: ['Energy boost', 'Vitamins', 'Malt flavor'],
      description: 'Chocolate malt health drink for energy',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=milo',
        zepto: 'https://zepto.com/search?q=nestle+milo',
        swiggy: 'https://swiggy.com/search?q=milo',
        bigbasket: 'https://bigbasket.com/search?q=milo'
      }
    },
    {
      name: 'Boost',
      brand: 'Nestle',
      health_score: 70,
      nutrition: { calories: 98, sugar: 9, protein: 3, fat: 2, fiber: 1 },
      benefits: ['Energy drink', 'Stamina', 'Vitamins'],
      description: 'Energy drink for active lifestyle',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=boost',
        zepto: 'https://zepto.com/search?q=boost+drink',
        swiggy: 'https://swiggy.com/search?q=boost',
        bigbasket: 'https://bigbasket.com/search?q=boost'
      }
    },
    {
      name: 'Pediasure',
      brand: 'Abbott',
      health_score: 74,
      nutrition: { calories: 110, sugar: 10, protein: 4, fat: 3, fiber: 1 },
      benefits: ['Complete nutrition', 'Growth support', 'For kids'],
      description: 'Specialized nutrition for growing kids',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=pediasure',
        zepto: 'https://zepto.com/search?q=pediasure',
        swiggy: 'https://swiggy.com/search?q=pediasure',
        bigbasket: 'https://bigbasket.com/search?q=pediasure'
      }
    },
    {
      name: 'Ensure',
      brand: 'Abbott',
      health_score: 75,
      nutrition: { calories: 105, sugar: 8, protein: 5, fat: 2.5, fiber: 1 },
      benefits: ['Balanced nutrition', 'Adults', 'Vitamin & minerals'],
      description: 'Complete balanced nutrition for adults',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ensure',
        zepto: 'https://zepto.com/search?q=ensure+drink',
        swiggy: 'https://swiggy.com/search?q=ensure',
        bigbasket: 'https://bigbasket.com/search?q=ensure'
      }
    },
    {
      name: 'Junior Horlicks',
      brand: 'Horlicks',
      health_score: 71,
      nutrition: { calories: 102, sugar: 9, protein: 3, fat: 2, fiber: 1 },
      benefits: ['For kids 2-6 years', 'Brain development', 'Immunity'],
      description: 'Specialized nutrition for young children',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=junior+horlicks',
        zepto: 'https://zepto.com/search?q=junior+horlicks',
        swiggy: 'https://swiggy.com/search?q=junior+horlicks',
        bigbasket: 'https://bigbasket.com/search?q=junior+horlicks'
      }
    },
    {
      name: 'Nutramul',
      brand: 'Nestle',
      health_score: 73,
      nutrition: { calories: 100, sugar: 8, protein: 6, fat: 2, fiber: 1 },
      benefits: ['High protein', 'For recovery', 'Nutritious'],
      description: 'Protein-rich health drink for recovery',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=nutramul',
        zepto: 'https://zepto.com/search?q=nutramul',
        swiggy: 'https://swiggy.com/search?q=nutramul',
        bigbasket: 'https://bigbasket.com/search?q=nutramul'
      }
    }
  ],
  'cereal': [
    {
      name: 'Oats',
      brand: 'Quaker',
      health_score: 85,
      nutrition: { calories: 150, sugar: 1, protein: 5, fat: 3, fiber: 4 },
      benefits: ['High fiber', 'Whole grain', 'Heart healthy'],
      description: 'Wholesome oats perfect for a healthy breakfast',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=quaker+oats',
        zepto: 'https://zepto.com/search?q=oats',
        swiggy: 'https://swiggy.com/search?q=quaker',
        bigbasket: 'https://bigbasket.com/search?q=quaker+oats'
      }
    },
    {
      name: 'Muesli (No Added Sugar)',
      brand: 'Soulfull',
      health_score: 82,
      nutrition: { calories: 150, sugar: 4, protein: 5, fat: 4, fiber: 6 },
      benefits: ['Whole grains', 'Nuts & fruits', 'No added sugar'],
      description: 'Nutritious muesli with natural ingredients',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=soulfull+muesli',
        zepto: 'https://zepto.com/search?q=sugar+free+muesli',
        swiggy: 'https://swiggy.com/search?q=soulfull',
        bigbasket: 'https://bigbasket.com/search?q=no+sugar+muesli'
      }
    },
    {
      name: 'Cornflakes (Whole Grain)',
      brand: 'Kellogg\'s',
      health_score: 72,
      nutrition: { calories: 120, sugar: 3, protein: 2, fat: 0.5, fiber: 1 },
      benefits: ['Fortified with iron', 'Low fat', 'Quick breakfast'],
      description: 'Classic whole grain cornflakes',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kelloggs+cornflakes',
        zepto: 'https://zepto.com/search?q=cornflakes',
        swiggy: 'https://swiggy.com/search?q=kelloggs',
        bigbasket: 'https://bigbasket.com/search?q=cornflakes'
      }
    },
    {
      name: 'All Bran',
      brand: 'Kellogg\'s',
      health_score: 84,
      nutrition: { calories: 130, sugar: 4, protein: 4, fat: 1, fiber: 10 },
      benefits: ['Super high fiber', 'Digestive health', 'Whole wheat'],
      description: 'High-fiber bran cereal for gut health',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=all+bran',
        zepto: 'https://zepto.com/search?q=kelloggs+all+bran',
        swiggy: 'https://swiggy.com/search?q=all+bran',
        bigbasket: 'https://bigbasket.com/search?q=all+bran'
      }
    },
    {
      name: 'Granola Crunch',
      brand: 'Yogabar',
      health_score: 78,
      nutrition: { calories: 155, sugar: 6, protein: 4, fat: 5, fiber: 5 },
      benefits: ['Crunchy', 'Natural ingredients', 'Energy boost'],
      description: 'Crunchy granola with nuts and seeds',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=yogabar+granola',
        zepto: 'https://zepto.com/search?q=granola',
        swiggy: 'https://swiggy.com/search?q=yogabar',
        bigbasket: 'https://bigbasket.com/search?q=yogabar+granola'
      }
    },
    {
      name: 'Wheat Flakes',
      brand: 'Kellogg\'s Special K',
      health_score: 76,
      nutrition: { calories: 125, sugar: 4, protein: 3, fat: 0.5, fiber: 3 },
      benefits: ['Whole wheat', 'Low fat', 'Fortified'],
      description: 'Crispy wheat flakes for light breakfast',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=special+k',
        zepto: 'https://zepto.com/search?q=wheat+flakes',
        swiggy: 'https://swiggy.com/search?q=kelloggs+special+k',
        bigbasket: 'https://bigbasket.com/search?q=special+k'
      }
    },
    {
      name: 'Ragi Flakes',
      brand: 'Slurrp Farm',
      health_score: 83,
      nutrition: { calories: 140, sugar: 2, protein: 5, fat: 2, fiber: 6 },
      benefits: ['Finger millet', 'High calcium', 'Kid-friendly'],
      description: 'Nutritious ragi cereal for kids',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=ragi+flakes',
        zepto: 'https://zepto.com/search?q=ragi+flakes',
        swiggy: 'https://swiggy.com/search?q=slurrp+farm+flakes',
        bigbasket: 'https://bigbasket.com/search?q=ragi+flakes'
      }
    },
    {
      name: 'Fruit & Nut Muesli',
      brand: 'Kellogg\'s',
      health_score: 79,
      nutrition: { calories: 160, sugar: 8, protein: 4, fat: 4, fiber: 5 },
      benefits: ['Fruits & nuts', 'Energy', 'Crunchy'],
      description: 'Delicious muesli loaded with fruits and nuts',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kelloggs+muesli',
        zepto: 'https://zepto.com/search?q=fruit+nut+muesli',
        swiggy: 'https://swiggy.com/search?q=kelloggs+muesli',
        bigbasket: 'https://bigbasket.com/search?q=fruit+nut+muesli'
      }
    },
    {
      name: 'Chocos (Whole Grain)',
      brand: 'Kellogg\'s',
      health_score: 68,
      nutrition: { calories: 130, sugar: 11, protein: 2, fat: 1, fiber: 2 },
      benefits: ['Kids favorite', 'Fortified', 'Chocolate flavor'],
      description: 'Chocolate cereal kids love',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=kelloggs+chocos',
        zepto: 'https://zepto.com/search?q=chocos',
        swiggy: 'https://swiggy.com/search?q=chocos',
        bigbasket: 'https://bigbasket.com/search?q=kelloggs+chocos'
      }
    },
    {
      name: 'Porridge Mix (Oats & Fruits)',
      brand: 'Bagrry\'s',
      health_score: 80,
      nutrition: { calories: 145, sugar: 5, protein: 4, fat: 3, fiber: 5 },
      benefits: ['Instant porridge', 'Fruity flavor', 'High fiber'],
      description: 'Quick oats porridge with real fruits',
      purchaseLinks: {
        blinkit: 'https://blinkit.com/search?q=bagrrys+porridge',
        zepto: 'https://zepto.com/search?q=oats+porridge',
        swiggy: 'https://swiggy.com/search?q=bagrrys',
        bigbasket: 'https://bigbasket.com/search?q=oats+porridge'
      }
    }
  ]
};

// Debug route to test this router
router.get("/test", (req, res) => {
  res.json({ message: "Alternatives route is working" });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    endpoint: "/api/alternatives",
    methods: ["GET", "POST"],
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    databases: Object.keys(alternativesDB)
  });
});

// POST endpoint for smart alternatives
router.post("/", async (req, res) => {
  try {
    const { category, subCategory, currentHealthScore, currentProduct, currentBrand } = req.body;

    console.log('📥 Smart alternatives request:', { category, subCategory, currentProduct, currentHealthScore });

    // Validate request
    if (!category) {
      return res.status(400).json({ error: 'Category is required', receivedBody: req.body });
    }

    // Try to get AI-generated alternatives first
    const aiAlternatives = await generateAIAlternatives(
      category, 
      subCategory, 
      currentProduct, 
      currentHealthScore
    );

    if (aiAlternatives && aiAlternatives.length > 0) {
      console.log(`✅ Returning ${aiAlternatives.length} AI alternatives`);
      return res.json(aiAlternatives);
    }

    // Fallback to static database
    // Try exact subcategory match first, then category, then all alternatives
    let staticAlternatives = alternativesDB[subCategory] || alternativesDB[category] || [];
    
    // If no match found, try to use all alternatives as last resort
    if (staticAlternatives.length === 0) {
      console.log(`⚠️ No alternatives found for ${category}/${subCategory}, using all available alternatives`);
      staticAlternatives = Object.values(alternativesDB).flat();
    }
    
    // Filter to show alternatives that are at least as good or slightly better
    // Changed from strict > to >= with a tolerance
    const scoreThreshold = Math.max(0, currentHealthScore - 10); // Show alternatives within 10 points
    const filteredAlternatives = staticAlternatives
      .filter((alt: any) => alt.health_score >= scoreThreshold)
      .sort((a: any, b: any) => b.health_score - a.health_score) // Sort by health score descending
      .slice(0, 12); // Limit to top 12
    
    console.log(`✅ Returning ${filteredAlternatives.length} static alternatives for category: ${category}/${subCategory} (score threshold: ${scoreThreshold})`);
    res.json(filteredAlternatives);

  } catch (error) {
    console.error('❌ Error in alternatives API:', error);
    res.status(500).json({ 
      error: 'Failed to fetch alternatives',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get healthier alternatives (legacy GET endpoint)
router.get("/", async (req, res) => {
  try {
    console.log("📥 Received alternatives request");
    const minScore = Number(req.query.minScore || 50);
    console.log("🎯 Min score:", minScore);

    // Query Supabase for alternatives
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .gt("healthScore", minScore)
      .order("healthScore", { ascending: false })
      .limit(10);

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No alternatives found");
      return res.status(200).json({ alternatives: [] });
    }

    // Format the response
    const alternatives = data.map(item => ({
      name: item.detected_name || "Unknown Product",
      brand: item.brand || "",
      health_score: item.healthScore || 0,
      nutrition: item.nutrition || {}
    }));

    console.log(`✅ Returning ${alternatives.length} alternatives`);
    return res.status(200).json({ alternatives });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({
      error: "Failed to fetch alternatives",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
});

async function generateAIAlternatives(category: string, subCategory: string, currentProduct: string, currentScore: number) {
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
      return alternatives.map((alt: any) => ({
        ...alt,
        purchaseLinks: generatePurchaseLinks(alt.name, alt.brand)
      }));
    }

    return null;
  } catch (error) {
    console.error('❌ AI alternatives generation failed:', error);
    return null;
  }
}

function generatePurchaseLinks(productName: string, brand: string) {
  const searchQuery = encodeURIComponent(`${brand} ${productName}`);
  return {
    blinkit: `https://blinkit.com/search?q=${searchQuery}`,
    zepto: `https://zepto.com/search?q=${searchQuery}`,
    swiggy: `https://www.swiggy.com/instamart/search?query=${searchQuery}`,
    bigbasket: `https://www.bigbasket.com/ps/?q=${searchQuery}`
  };
}

export default router;