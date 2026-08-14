import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

// --- NEW ROBUST DATABASE MAPPING ---
// Add the rest of your 95 items here following this exact structure.
const foodDatabase = {
  'Apple': {
    fndds_code: '63101000',
    nutrients: { protein: 0.26, carbs: 13.81, fat: 0.17, sugars: 10.39 },
    ghge: 0.9 // Fruit and fruit products
  },
  'Banana': {
    fndds_code: '63107010',
    nutrients: { protein: 1.09, carbs: 22.84, fat: 0.33, sugars: 12.23 },
    ghge: 0.9 // Fruit and fruit products
  },
  'Orange': {
    fndds_code: '63133010',
    nutrients: { protein: 0.94, carbs: 11.75, fat: 0.12, sugars: 9.35 },
    ghge: 0.9 // Fruit and fruit products
  },
  'Mango': {
    fndds_code: '63127010',
    nutrients: { protein: 0.82, carbs: 14.98, fat: 0.38, sugars: 13.66 },
    ghge: 0.9 // Fruit and fruit products
  },
  'Grapes': {
    fndds_code: '63123000',
    nutrients: { protein: 0.9, carbs: 19.4, fat: 0.2, sugars: 16.74 },
    ghge: 0.9 // Fruit and fruit products
  },
  'Spinach': {
    fndds_code: '72125100',
    nutrients: { protein: 2.85, carbs: 2.41, fat: 0.62, sugars: 0.42 },
    ghge: 1.8 // Vegetable and vegetable products
  },
  'Broccoli': {
    fndds_code: '72201100',
    nutrients: { protein: 2.57, carbs: 6.27, fat: 0.34, sugars: 1.54 },
    ghge: 1.8 // Vegetable and vegetable products
  },
  'Carrot': {
    fndds_code: '73101010',
    nutrients: { protein: 0.93, carbs: 9.58, fat: 0.24, sugars: 4.74 },
    ghge: 1.8 // Vegetable and vegetable products
  },
  'Tomato': {
    fndds_code: '74201010',
    nutrients: { protein: 0.88, carbs: 3.89, fat: 0.2, sugars: 2.63 },
    ghge: 1.8 // Vegetable and vegetable products
  },
  'Bell pepper': {
    fndds_code: '75113000',
    nutrients: { protein: 0.86, carbs: 4.64, fat: 0.17, sugars: 2.4 },
    ghge: 1.8 // Vegetable and vegetable products
  },
  'Brown rice': {
    fndds_code: '56205010',
    nutrients: { protein: 2.74, carbs: 25.58, fat: 0.97, sugars: 0.24 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Oats': {
    fndds_code: '57303000',
    nutrients: { protein: 2.54, carbs: 11.5, fat: 1.4, sugars: 0.39 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Quinoa': {
    fndds_code: '56208000',
    nutrients: { protein: 4.4, carbs: 21.3, fat: 1.92, sugars: 0.87 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Barley': {
    fndds_code: '56200200',
    nutrients: { protein: 2.26, carbs: 28.22, fat: 0.44, sugars: 0.28 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Whole wheat berries': {
    fndds_code: '50020120',
    nutrients: { protein: 12.01, carbs: 74.31, fat: 1.99, sugars: 1.98 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Black beans': {
    fndds_code: '41103000',
    nutrients: { protein: 8.86, carbs: 23.71, fat: 0.54, sugars: 0.32 },
    ghge: 2.1 // Legumes, nuts and oilseeds
  },
  'Lentils': {
    fndds_code: '41108000',
    nutrients: { protein: 9.02, carbs: 20.13, fat: 0.38, sugars: 1.8 },
    ghge: 2.1 // Legumes, nuts and oilseeds
  },
  'Chickpeas': {
    fndds_code: '41106000',
    nutrients: { protein: 8.86, carbs: 27.42, fat: 2.59, sugars: 4.8 },
    ghge: 2.1 // Legumes, nuts and oilseeds
  },
  'Kidney beans': {
    fndds_code: '41104000',
    nutrients: { protein: 8.67, carbs: 22.8, fat: 0.5, sugars: 0.32 },
    ghge: 2.1 // Legumes, nuts and oilseeds
  },
  'Split peas': {
    fndds_code: '41205020',
    nutrients: { protein: 8.34, carbs: 21.1, fat: 0.39, sugars: 2.9 },
    ghge: 2.1 // Legumes, nuts and oilseeds
  },
  'Beef steak': {
    fndds_code: '21101000',
    nutrients: { protein: 27.3, carbs: 0.0, fat: 11.8, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Pork loin': {
    fndds_code: '22101300',
    nutrients: { protein: 27.05, carbs: 0.0, fat: 7.91, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Lamb chop': {
    fndds_code: '23101100',
    nutrients: { protein: 24.3, carbs: 0.0, fat: 12.87, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Beef roast': {
    fndds_code: '21201000',
    nutrients: { protein: 26.54, carbs: 0.0, fat: 10.36, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Pork tenderloin': {
    fndds_code: '22101370',
    nutrients: { protein: 26.24, carbs: 0.0, fat: 3.51, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Chicken breast': {
    fndds_code: '24122110',
    nutrients: { protein: 32.06, carbs: 0.0, fat: 3.57, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Chicken thigh': {
    fndds_code: '24124110',
    nutrients: { protein: 25.86, carbs: 0.0, fat: 10.15, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Chicken drumstick': {
    fndds_code: '24123110',
    nutrients: { protein: 27.27, carbs: 0.0, fat: 6.96, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Chicken wings': {
    fndds_code: '24121110',
    nutrients: { protein: 23.82, carbs: 0.0, fat: 19.46, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Whole chicken': {
    fndds_code: '24111110',
    nutrients: { protein: 27.07, carbs: 0.0, fat: 13.62, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Salt': {
    fndds_code: '11111111',
    nutrients: { protein: 0.0, carbs: 0.0, fat: 0.0, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Black pepper': {
    fndds_code: '22222222',
    nutrients: { protein: 10.39, carbs: 63.95, fat: 3.26, sugars: 0.64 },
    ghge: 2.2 // Miscellaneous
  },
  'Garlic powder': {
    fndds_code: '33333333',
    nutrients: { protein: 16.55, carbs: 72.73, fat: 0.73, sugars: 2.43 },
    ghge: 2.2 // Miscellaneous
  },
  'Onion powder': {
    fndds_code: '44444444',
    nutrients: { protein: 10.41, carbs: 79.12, fat: 1.04, sugars: 9.38 },
    ghge: 2.2 // Miscellaneous
  },
  'Paprika': {
    fndds_code: '55555555',
    nutrients: { protein: 14.14, carbs: 53.99, fat: 12.89, sugars: 10.34 },
    ghge: 2.2 // Miscellaneous
  },
  'Soy sauce': {
    fndds_code: '42202000',
    nutrients: { protein: 8.14, carbs: 4.93, fat: 0.57, sugars: 0.4 },
    ghge: 2.2 // Miscellaneous
  },
  'Ketchup': {
    fndds_code: '74401010',
    nutrients: { protein: 1.25, carbs: 28.51, fat: 0.17, sugars: 22.9 },
    ghge: 2.2 // Miscellaneous
  },
  'Mustard': {
    fndds_code: '75119030',
    nutrients: { protein: 3.82, carbs: 6.01, fat: 2.92, sugars: 0.86 },
    ghge: 2.2 // Miscellaneous
  },
  'Vinegar': {
    fndds_code: '82103000',
    nutrients: { protein: 0.0, carbs: 0.93, fat: 0.0, sugars: 0.4 },
    ghge: 2.2 // Miscellaneous
  },
  'Hot sauce': {
    fndds_code: '75114000',
    nutrients: { protein: 1.08, carbs: 2.58, fat: 0.4, sugars: 1.13 },
    ghge: 2.2 // Miscellaneous
  },
  'White sugar': {
    fndds_code: '91101010',
    nutrients: { protein: 0.0, carbs: 99.98, fat: 0.0, sugars: 99.8 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Brown sugar': {
    fndds_code: '91101020',
    nutrients: { protein: 0.12, carbs: 98.09, fat: 0.0, sugars: 97.02 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Honey': {
    fndds_code: '91200010',
    nutrients: { protein: 0.3, carbs: 82.4, fat: 0.0, sugars: 82.12 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Maple syrup': {
    fndds_code: '91301010',
    nutrients: { protein: 0.04, carbs: 67.04, fat: 0.06, sugars: 60.44 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Corn syrup': {
    fndds_code: '91302000',
    nutrients: { protein: 0.0, carbs: 77.2, fat: 0.0, sugars: 11.2 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Cornstarch': {
    fndds_code: '58120010',
    nutrients: { protein: 0.26, carbs: 91.27, fat: 0.05, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Gelatin': {
    fndds_code: '92110200',
    nutrients: { protein: 85.6, carbs: 0.0, fat: 0.1, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Pectin': {
    fndds_code: '58130000',
    nutrients: { protein: 0.3, carbs: 89.6, fat: 0.0, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Agar-agar': {
    fndds_code: '58130010',
    nutrients: { protein: 6.21, carbs: 80.88, fat: 0.3, sugars: 2.76 },
    ghge: 2.2 // Miscellaneous
  },
  'Modified food starch': {
    fndds_code: '58120020',
    nutrients: { protein: 0.26, carbs: 91.27, fat: 0.05, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Baking powder': {
    fndds_code: '11111112',
    nutrients: { protein: 0.0, carbs: 27.7, fat: 0.0, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Baking soda': {
    fndds_code: '11111113',
    nutrients: { protein: 0.0, carbs: 0.0, fat: 0.0, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Yeast': {
    fndds_code: '11111114',
    nutrients: { protein: 40.44, carbs: 41.22, fat: 7.61, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Cream of tartar': {
    fndds_code: '11111115',
    nutrients: { protein: 0.0, carbs: 61.5, fat: 0.0, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  "Ammonium bicarbonate (baker's ammonia)": {
    fndds_code: '11111113',
    nutrients: { protein: 0.0, carbs: 0.0, fat: 0.0, sugars: 0.0 },
    ghge: 2.2 // Miscellaneous
  },
  'Cheese': {
    fndds_code: '14104010',
    nutrients: { protein: 22.87, carbs: 1.4, fat: 33.31, sugars: 0.3 },
    ghge: 11.5 // Milk and dairy products
  },
  'Plain yogurt': {
    fndds_code: '11400010',
    nutrients: { protein: 10.3, carbs: 3.59, fat: 0.39, sugars: 3.24 },
    ghge: 11.5 // Milk and dairy products
  },
  'Cottage cheese': {
    fndds_code: '14101010',
    nutrients: { protein: 11.12, carbs: 3.38, fat: 4.3, sugars: 2.67 },
    ghge: 11.5 // Milk and dairy products
  },
  'Kefir': {
    fndds_code: '11400100',
    nutrients: { protein: 3.79, carbs: 4.88, fat: 1.15, sugars: 4.54 },
    ghge: 11.5 // Milk and dairy products
  },
  'Sweetened condensed milk': {
    fndds_code: '11220000',
    nutrients: { protein: 7.91, carbs: 54.4, fat: 8.71, sugars: 54.4 },
    ghge: 11.5 // Milk and dairy products
  },
  'Traditional bread': {
    fndds_code: '51101000',
    nutrients: { protein: 9.38, carbs: 48.74, fat: 3.44, sugars: 5.56 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Plain crackers': {
    fndds_code: '54201010',
    nutrients: { protein: 9.45, carbs: 70.93, fat: 8.32, sugars: 1.25 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Salted popcorn': {
    fndds_code: '54401060',
    nutrients: { protein: 12.0, carbs: 77.9, fat: 4.19, sugars: 0.87 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Pasta': {
    fndds_code: '56111000',
    nutrients: { protein: 5.8, carbs: 30.86, fat: 0.93, sugars: 0.56 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Tortillas': {
    fndds_code: '52207000',
    nutrients: { protein: 4.84, carbs: 43.18, fat: 2.14, sugars: 0.77 },
    ghge: 3.9 // Grains and grain-based products
  },
  'Canned vegetables': {
    fndds_code: '73414010',
    nutrients: { protein: 2.1, carbs: 8.01, fat: 0.14, sugars: 3.01 },
    ghge: 1.3 // Avg fruit/veg
  },
  'Canned fruits in syrup': {
    fndds_code: '63301010',
    nutrients: { protein: 0.35, carbs: 18.52, fat: 0.08, sugars: 15.6 },
    ghge: 1.3 // Avg fruit/veg
  },
  'Pickles (American)': {
    fndds_code: '75121000',
    nutrients: { protein: 0.33, carbs: 2.05, fat: 0.17, sugars: 1.06 },
    ghge: 1.3 // Avg fruit/veg
  },
  'Tomato sauce/paste': {
    fndds_code: '74402010',
    nutrients: { protein: 1.76, carbs: 6.91, fat: 0.35, sugars: 4.09 },
    ghge: 1.3 // Avg fruit/veg
  },
  'Dried fruits with added sugar': {
    fndds_code: '63111020',
    nutrients: { protein: 0.17, carbs: 82.8, fat: 1.09, sugars: 72.56 },
    ghge: 1.3 // Avg fruit/veg
  },
  'Canned tuna': {
    fndds_code: '26100140',
    nutrients: { protein: 19.33, carbs: 0.0, fat: 0.81, sugars: 0.0 },
    ghge: 16.1 // Avg Meat/Fish
  },
  'Canned salmon': {
    fndds_code: '26100100',
    nutrients: { protein: 19.5, carbs: 0.0, fat: 6.01, sugars: 0.0 },
    ghge: 16.1 // Avg Meat/Fish
  },
  'Salted fish': {
    fndds_code: '26100230',
    nutrients: { protein: 62.82, carbs: 0.0, fat: 2.37, sugars: 0.0 },
    ghge: 16.1 // Avg Meat/Fish
  },
  'Smoked fish': {
    fndds_code: '26100220',
    nutrients: { protein: 18.28, carbs: 0.0, fat: 4.32, sugars: 0.0 },
    ghge: 16.1 // Avg Meat/Fish
  },
  'Cured ham': {
    fndds_code: '22601000',
    nutrients: { protein: 16.59, carbs: 1.5, fat: 5.51, sugars: 0.0 },
    ghge: 16.1 // Avg Meat/Fish
  },
  'Coca-Cola® or Pepsi®': {
    fndds_code: '92410310',
    nutrients: { protein: 0.0, carbs: 10.5, fat: 0.0, sugars: 10.36 },
    ghge: 0.4 // Water and water-based beverages
  },
  'Mountain Dew®': {
    fndds_code: '92410320',
    nutrients: { protein: 0.0, carbs: 12.35, fat: 0.0, sugars: 12.33 },
    ghge: 0.4 // Water and water-based beverages
  },
  'Sweetened iced tea': {
    fndds_code: '92302000',
    nutrients: { protein: 0.0, carbs: 8.44, fat: 0.0, sugars: 8.24 },
    ghge: 0.4 // Water and water-based beverages
  },
  'Sports drinks': {
    fndds_code: '92410330',
    nutrients: { protein: 0.0, carbs: 5.86, fat: 0.0, sugars: 5.48 },
    ghge: 0.4 // Water and water-based beverages
  },
  'Sweetened fruit drinks/fruit punch': {
    fndds_code: '92511010',
    nutrients: { protein: 0.0, carbs: 10.05, fat: 0.0, sugars: 10.02 },
    ghge: 0.4 // Water and water-based beverages
  },
  'Potato chips': {
    fndds_code: '77121010',
    nutrients: { protein: 6.56, carbs: 52.88, fat: 34.6, sugars: 0.28 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Chocolate bars': {
    fndds_code: '91705010',
    nutrients: { protein: 7.72, carbs: 59.39, fat: 29.83, sugars: 51.52 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Candy': {
    fndds_code: '91501030',
    nutrients: { protein: 6.9, carbs: 76.5, fat: 0.2, sugars: 46.12 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Packaged cookies': {
    fndds_code: '53201000',
    nutrients: { protein: 4.88, carbs: 67.24, fat: 23.36, sugars: 34.54 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Cheese-flavored crackers': {
    fndds_code: '54203000',
    nutrients: { protein: 10.59, carbs: 59.95, fat: 20.35, sugars: 0.5 },
    ghge: 2.6 // Sugar and confectionary
  },
  'Frozen pizza': {
    fndds_code: '58106220',
    nutrients: { protein: 11.39, carbs: 33.15, fat: 12.33, sugars: 3.58 },
    ghge: 4.8 // Composite dishes
  },
  'Instant noodles (Ramen)': {
    fndds_code: '28340640',
    nutrients: { protein: 1.83, carbs: 10.51, fat: 2.87, sugars: 0.54 },
    ghge: 4.8 // Composite dishes
  },
  'Microwaveable frozen dinners': {
    fndds_code: '27211110',
    nutrients: { protein: 6.78, carbs: 8.84, fat: 5.76, sugars: 0.44 },
    ghge: 4.8 // Composite dishes
  },
  'Canned pasta meals': {
    fndds_code: '27430300',
    nutrients: { protein: 2.2, carbs: 11.2, fat: 0.72, sugars: 2.0 },
    ghge: 4.8 // Composite dishes
  },
  'Frozen macaroni and cheese': {
    fndds_code: '58100110',
    nutrients: { protein: 5.66, carbs: 17.65, fat: 6.92, sugars: 1.64 },
    ghge: 4.8 // Composite dishes
  },
  'Chicken nuggets': {
    fndds_code: '24126110',
    nutrients: { protein: 14.61, carbs: 16.09, fat: 19.34, sugars: 0.41 },
    ghge: 17.1 // Meat and meat products
  },
  'Hot dogs': {
    fndds_code: '21501000',
    nutrients: { protein: 11.83, carbs: 2.76, fat: 28.53, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  'Chicken patties': {
    fndds_code: '24125210',
    nutrients: { protein: 13.9, carbs: 14.34, fat: 16.73, sugars: 0.32 },
    ghge: 17.1 // Meat and meat products
  },
  'Fish sticks': {
    fndds_code: '26100200',
    nutrients: { protein: 12.33, carbs: 21.0, fat: 10.3, sugars: 0.49 },
    ghge: 17.1 // Meat and meat products
  },
  'Deli meat slices': {
    fndds_code: '21501400',
    nutrients: { protein: 11.46, carbs: 3.73, fat: 27.52, sugars: 0.0 },
    ghge: 17.1 // Meat and meat products
  },
  // Fallback for untracked items
  'default': { fndds_code: '00000000', nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 }, ghge: 2.0 }
};

const portionMultipliers = {
  'small': 1,
  'medium': 2.5,
  'large': 4
};

// ... [KEEP YOUR EXISTING foodCategories AND imageMapping CONSTANTS HERE EXACTLY AS THEY WERE] ...
const foodCategories = [
  { id: 'g1_fruits', group: 'Group 1', name: 'Fruits', options: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'] },
  { id: 'g1_vegetables', group: 'Group 1', name: 'Vegetables', options: ['Spinach', 'Broccoli', 'Carrot', 'Tomato', 'Bell pepper'] },
  { id: 'g1_grains', group: 'Group 1', name: 'Whole Grains', options: ['Brown rice', 'Oats', 'Quinoa', 'Barley', 'Whole wheat berries'] },
  { id: 'g1_legumes', group: 'Group 1', name: 'Legumes', options: ['Black beans', 'Lentils', 'Chickpeas', 'Kidney beans', 'Split peas'] },
  { id: 'g1_meat', group: 'Group 1', name: 'Fresh Cuts of Meat', options: ['Beef steak', 'Pork loin', 'Lamb chop', 'Beef roast', 'Pork tenderloin'] },
  { id: 'g1_chicken', group: 'Group 1', name: 'Fresh Chicken Products', options: ['Chicken breast', 'Chicken thigh', 'Chicken drumstick', 'Chicken wings', 'Whole chicken'] },
  
  { id: 'g2_seasonings', group: 'Group 2', name: 'Seasonings', options: ['Salt', 'Black pepper', 'Garlic powder', 'Onion powder', 'Paprika'] },
  { id: 'g2_condiments', group: 'Group 2', name: 'Condiments', options: ['Soy sauce', 'Ketchup', 'Mustard', 'Vinegar', 'Hot sauce'] },
  { id: 'g2_sweeteners', group: 'Group 2', name: 'Sweeteners', options: ['White sugar', 'Brown sugar', 'Honey', 'Maple syrup', 'Corn syrup'] },
  { id: 'g2_thickeners', group: 'Group 2', name: 'Thickening and Gelling Agents', options: ['Cornstarch', 'Gelatin', 'Pectin', 'Agar-agar', 'Modified food starch'] },
  { id: 'g2_leavening', group: 'Group 2', name: 'Leavening Agents', options: ['Baking powder', 'Baking soda', 'Yeast', 'Cream of tartar', "Ammonium bicarbonate (baker's ammonia)"] },
  
  { id: 'g3_dairy', group: 'Group 3', name: 'Dairy Products', options: ['Cheese', 'Plain yogurt', 'Cottage cheese', 'Kefir', 'Sweetened condensed milk'] },
  { id: 'g3_grains', group: 'Group 3', name: 'Grain Products', options: ['Traditional bread', 'Plain crackers', 'Salted popcorn', 'Pasta', 'Tortillas'] },
  { id: 'g3_fruit_veg', group: 'Group 3', name: 'Fruit and Vegetable Products', options: ['Canned vegetables', 'Canned fruits in syrup', 'Pickles (American)', 'Tomato sauce/paste', 'Dried fruits with added sugar'] },
  { id: 'g3_meat_fish', group: 'Group 3', name: 'Meat and Fish Products', options: ['Canned tuna', 'Canned salmon', 'Salted fish', 'Smoked fish', 'Cured ham'] },
  
  { id: 'g4_beverages', group: 'Group 4', name: 'Sugar-Sweetened Beverages', options: ['Coca-Cola® or Pepsi®', 'Mountain Dew®', 'Sweetened iced tea', 'Sports drinks', 'Sweetened fruit drinks/fruit punch'] },
  { id: 'g4_snacks', group: 'Group 4', name: 'Packaged Snacks and Confectionery', options: ['Potato chips', 'Chocolate bars', 'Candy', 'Packaged cookies', 'Cheese-flavored crackers'] },
  { id: 'g4_ready_meals', group: 'Group 4', name: 'Ready-to-Eat or Heat Meals', options: ['Frozen pizza', 'Instant noodles (Ramen)', 'Microwaveable frozen dinners', 'Canned pasta meals', 'Frozen macaroni and cheese'] },
  { id: 'g4_reconstituted', group: 'Group 4', name: 'Reconstituted Meat and Poultry', options: ['Chicken nuggets', 'Hot dogs', 'Chicken patties', 'Fish sticks', 'Deli meat slices'] }
];

const imageMapping = {
  'Apple': 'apple.png', 'Banana': 'banana.png', 'Orange': 'orange.png', 'Mango': 'mango.png', 'Grapes': 'grapes.png',
  'Spinach': 'spinach.png', 'Broccoli': 'broccoli.png', 'Carrot': 'carrot.png', 'Tomato': 'tomato.png', 'Bell pepper': 'bell_pepper.png',
  'Brown rice': 'brown_rice.png', 'Oats': 'oats.png', 'Quinoa': 'quinoa.png', 'Barley': 'barley.png', 'Whole wheat berries': 'whole_wheat _berries.png',
  'Black beans': 'black_beans.png', 'Lentils': 'lentils.png', 'Chickpeas': 'chickpeas.png', 'Kidney beans': 'kidney_beans.png', 'Split peas': 'split_peas.png',
  'Beef steak': 'beef_steak.png', 'Pork loin': 'pork_loin.png', 'Lamb chop': 'lamb_chop.png', 'Beef roast': 'beef_roast.png', 'Pork tenderloin': 'pork_tenderloin.png',
  'Chicken breast': 'chicken_breast.png', 'Chicken thigh': 'chicken_thigh.png', 'Chicken drumstick': 'chicken_drumstick.png', 'Chicken wings': 'chicken_wings.png', 'Whole chicken': 'whole_chicken.png',
  'Salt': 'salt.png', 'Black pepper': 'black_pepper.png', 'Garlic powder': 'garlic_powder.png', 'Onion powder': 'onion_powder.png', 'Paprika': 'paprika.png',
  'Soy sauce': 'soy_sauce.png', 'Ketchup': 'ketchup.png', 'Mustard': 'mustard.png', 'Vinegar': 'vinegar.png', 'Hot sauce': 'hot_sauce.png',
  'White sugar': 'white_sugar.png', 'Brown sugar': 'brown_sugar.png', 'Honey': 'honey.png', 'Maple syrup': 'maple_syrup.png', 'Corn syrup': 'corn-syrup.png',
  'Cornstarch': 'cornstarch.png', 'Gelatin': 'gelatin.png', 'Pectin': 'pectin.png', 'Agar-agar': 'agar-agar.png', 'Modified food starch': 'mod_food_starch.png',
  'Baking powder': 'baking_powder.png', 'Baking soda': 'baking_soda.png', 'Yeast': 'yeast.png', 'Cream of tartar': 'cream_of_tartar.png', "Ammonium bicarbonate (baker's ammonia)": 'ammonium_bicarbonate.png',
  'Cheese': 'cheese.png', 'Plain yogurt': 'plain_yoghurt.png', 'Cottage cheese': 'cottage_cheese.png', 'Kefir': 'kefir.png', 'Sweetened condensed milk': 'sweet_condensed_milk.png',
  'Traditional bread': 'traditional_bread.png', 'Plain crackers': 'plain_crackers.png', 'Salted popcorn': 'salted_popcorn.png', 'Pasta': 'pasta.png', 'Tortillas': 'tortillas.png',
  'Canned vegetables': 'canned_vegetables.png', 'Canned fruits in syrup': 'canned_fruits.png', 'Pickles (American)': 'pickles.png', 'Tomato sauce/paste': 'tomato_sauce.png', 'Dried fruits with added sugar': 'dried_fruit.png',
  'Canned tuna': 'canned_tuna.png', 'Canned salmon': 'canned_salmon.png', 'Salted fish': 'salted_fish.png', 'Smoked fish': 'smoked_fish.png', 'Cured ham': 'cured_ham.png',
  'Coca-Cola® or Pepsi®': 'coca_cola.png', 'Mountain Dew®': 'mountain_dew.png', 'Sweetened iced tea': 'sweetened_ice_tea.png', 'Sports drinks': 'sports_drink.png', 'Sweetened fruit drinks/fruit punch': 'sweetened_fruit_drinks.png',
  'Potato chips': 'potato_chips.png', 'Chocolate bars': 'chocolate_bars.png', 'Candy': 'gummy_bears_candy.png', 'Packaged cookies': 'packaged_cookies.png', 'Cheese-flavored crackers': 'cheese_cracker.png',
  'Frozen pizza': 'frozen_pizza.png', 'Instant noodles (Ramen)': 'instant_noodles.png', 'Microwaveable frozen dinners': 'fronzen_dinners.png', 'Canned pasta meals': 'canned_pasta.png', 'Frozen macaroni and cheese': 'frozen_mac_and_cheese.png',
  'Chicken nuggets': 'chicken_nuggets.png', 'Hot dogs': 'hot dogs.png', 'Chicken patties': 'chicken_patties.png', 'Fish sticks': 'fish_sticks.png', 'Deli meat slices': 'deli_meat_slices.png'
};

const portionSizes = [
  { id: 'small', label: 'Small', count: 1 },
  { id: 'medium', label: 'Medium', count: 3 },
  { id: 'large', label: 'Large', count: 5 },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [consumed, setConsumed] = useState(null);
  
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [portions, setPortions] = useState({});
  
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [dashboardData, setDashboardData] = useState(null);

  const currentCategory = foodCategories[currentStep];
  const progressPercentage = (currentStep / foodCategories.length) * 100;

  const toggleFood = (food) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter(f => f !== food));
      const newPortions = { ...portions };
      delete newPortions[food];
      setPortions(newPortions);
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const updatePortion = (food, sizeId) => {
    setPortions({ ...portions, [food]: sizeId });
  };

  const handleNext = () => {
    setResponses(prev => ({
      ...prev,
      [currentCategory.id]: {
        group: currentCategory.group,
        category: currentCategory.name,
        consumed: consumed,
        items: consumed ? selectedFoods.map(food => ({
          food: food,
          portion: portions[food]
        })) : []
      }
    }));

    setConsumed(null);
    setSelectedFoods([]);
    setPortions({});
    setCurrentStep(prev => prev + 1);
  };

  // --- NEW DASHBOARD CALCULATION ---
  const calculateDashboardScores = () => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalSugars = 0;
    let totalCarbonFootprint = 0;
    let totalItems = 0;

    Object.values(responses).forEach(categoryData => {
      if (categoryData.consumed && categoryData.items.length > 0) {
        categoryData.items.forEach(item => {
          // Look up the specific food or use the default
          const foodData = foodDatabase[item.food] || foodDatabase['default'];
          const multiplier = portionMultipliers[item.portion];
          
          totalProtein += (foodData.nutrients.protein * multiplier);
          totalCarbs += (foodData.nutrients.carbs * multiplier);
          totalFat += (foodData.nutrients.fat * multiplier);
          totalSugars += (foodData.nutrients.sugars * multiplier);
          
          totalCarbonFootprint += (foodData.ghge * multiplier);
          totalItems += multiplier;
        });
      }
    });

    // Calculate a generic health score (placeholder logic)
    const avgHealth = totalItems > 0 ? 75 : 0; // Update this with your logic later

    setDashboardData({
      healthScore: avgHealth,
      carbonFootprint: totalCarbonFootprint.toFixed(1),
      nutrition: [
        { name: 'Protein', value: Number(totalProtein.toFixed(1)) },
        { name: 'Carbs', value: Number(totalCarbs.toFixed(1)) },
        { name: 'Fat', value: Number(totalFat.toFixed(1)) },
        { name: 'Sugars', value: Number(totalSugars.toFixed(1)) }
      ]
    });
  };

  const submitDataToSupabase = async () => {
    setIsSubmitting(true);
    const rowsToInsert = [];
    
    Object.values(responses).forEach(categoryData => {
      if (categoryData.consumed && categoryData.items.length > 0) {
        categoryData.items.forEach(item => {
          
          // 1. Fetch the exact food data from our new mapped database
          const foodData = foodDatabase[item.food] || foodDatabase['default'];

          rowsToInsert.push({
            session_id: sessionId,
            food_group: categoryData.group,
            category: categoryData.category,
            food_item: item.food,
            portion_size: item.portion,
            // 2. Add the code to the database row
            fndds_code: foodData.fndds_code 
          });
        });
      }
    });

    if (rowsToInsert.length === 0) {
      rowsToInsert.push({ 
        session_id: sessionId, 
        food_group: 'None', 
        category: 'None', 
        food_item: 'None', 
        portion_size: 'None',
        fndds_code: '00000000'
      });
    }

    const { error } = await supabase
      .from('iheat_responses')
      .insert(rowsToInsert);

    if (error) {
      console.error('Error saving data:', error);
      alert('There was an error saving your responses.');
    } else {
      calculateDashboardScores();
      setIsSuccess(true);
    }
    setIsSubmitting(false);
  };

  const isNextDisabled = consumed === null || 
    (consumed === true && (selectedFoods.length === 0 || selectedFoods.some(f => !portions[f])));

  // PIE CHART COLORS
  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

  if (currentStep >= foodCategories.length) {
    return (
      <>
        <h1 className="main-page-title">
          Integrated Human and Environmental Health Assessment Tool (IHEAT)
        </h1>
        <div className="app-container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          
          {!isSuccess ? (
            <>
              <h2>Survey Complete!</h2>
              <p>Thank you for completing the questionnaire. Please submit your responses to see your impact dashboard.</p>
              <button 
                className="btn-primary" 
                onClick={submitDataToSupabase}
                disabled={isSubmitting}
                style={{ marginTop: '20px' }}
              >
                {isSubmitting ? 'Saving Data...' : 'Submit to Database'}
              </button>
            </>
          ) : (
            <div className="dashboard-container">
              <h2>Your Impact Dashboard</h2>
              <p className="dashboard-subtitle">Based on your reported diet over the last week.</p>
              
              <div className="dashboard-grid">
                {/* TILE 1: HEALTH SCORE */}
                <div className="dashboard-card health-card">
                  <h3>Dietary Health Score</h3>
                  <div className="score-value">{dashboardData.healthScore}<span className="score-max">/100</span></div>
                  <p className="score-desc">Estimated nutritional quality based on food categories and portions.</p>
                  <div className="dashboard-progress-bg">
                    <div className="dashboard-progress-fill" style={{ width: `${dashboardData.healthScore}%`, backgroundColor: dashboardData.healthScore > 60 ? '#10b981' : '#f59e0b' }}></div>
                  </div>
                </div>

                {/* TILE 2: CARBON FOOTPRINT */}
                <div className="dashboard-card carbon-card">
                  <h3>Carbon Footprint</h3>
                  <div className="score-value">{dashboardData.carbonFootprint}<span className="score-max"> kg CO₂e</span></div>
                  <p className="score-desc">Overall Greenhouse Gas Emissions (GHGE) of your diet.</p>
                  <div className="impact-tag">
                    {dashboardData.carbonFootprint < 15 ? '🌱 Low Impact' : '⚠️ High Impact'}
                  </div>
                </div>

                {/* TILE 3: NUTRITIONAL PIE CHART */}
                <div className="dashboard-card nutrition-card">
                  <h3>Macronutrient Breakdown</h3>
                  <p className="score-desc" style={{marginBottom: '0'}}>Granular intake in grams (g).</p>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={dashboardData.nutrition}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {dashboardData.nutrition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}g`} />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
              
              <div style={{ marginTop: '30px', color: '#64748b', fontSize: '0.9rem' }}>
                Your anonymous responses have been successfully saved. You may now safely close this window.
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="main-page-title">
        Integrated Human and Environmental Health Assessment Tool (IHEAT)
      </h1>
      <div className="app-container">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="header">
          <span className="group-badge">{currentCategory.group}</span>
          <h2>{currentCategory.name}</h2>
        </div>
        
        <div className="question-block">
          <p><strong>1.</strong> Did you consume <strong>{currentCategory.name.toLowerCase()}</strong> in the last week?</p>
          <div className="btn-group">
            <button 
              className={`btn-choice ${consumed === true ? 'selected-yes' : ''}`}
              onClick={() => { setConsumed(true); setSelectedFoods([]); setPortions({}); }}
            >
              Yes
            </button>
            <button 
              className={`btn-choice ${consumed === false ? 'selected-no' : ''}`}
              onClick={() => setConsumed(false)}
            >
              No
            </button>
          </div>
        </div>

        {consumed && (
          <div className="question-block">
            <p><strong>2.</strong> Which items did you consume? (Select all that apply)</p>
            <div className="food-pill-grid">
              {currentCategory.options.map(item => (
                <button 
                  key={item} 
                  className={`food-pill ${selectedFoods.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleFood(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {consumed && selectedFoods.length > 0 && (
          <div className="question-block">
            <p><strong>3.</strong> What was your average portion size for each?</p>
            
            {selectedFoods.map(food => (
              <div key={food} className="food-portion-section">
                <h4 style={{ margin: '0 0 10px 0', color: '#3730a3' }}>{food}</h4>
                <div className="portion-grid">
                  {portionSizes.map(size => (
                    <div 
                      key={size.id} 
                      className={`portion-card ${portions[food] === size.id ? 'selected' : ''}`}
                      onClick={() => updatePortion(food, size.id)}
                    >
                      <div className="portion-image-container">
                        {Array.from({ length: size.count }).map((_, index) => (
                          <img 
                            key={index}
                            src={`${process.env.PUBLIC_URL}/assets/${imageMapping[food]}`} 
                            alt={food} 
                            className="food-icon-img"
                          />
                        ))}
                      </div>
                      <div><strong>{size.label}</strong></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="nav-buttons">
          <button 
            className="btn-primary"
            onClick={handleNext} 
            disabled={isNextDisabled}
          >
            {currentStep === foodCategories.length - 1 ? 'Finish Survey' : 'Next Category'}
          </button>
        </div>
      </div>
    </>
  );
}