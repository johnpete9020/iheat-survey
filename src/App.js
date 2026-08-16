import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './App.css';

// --- UPDATED DATABASE WITH MICRONUTRIENTS (FNDDS + SHARP) ---
const foodDatabase = {
  'Apple': {
    fndds_code: '63101000',
    nutrients: { protein: 0.17, carbs: 14.8, fat: 0.15, sugars: 12.08 },
    micros: { iron: 0.03, calcium: 5.0, potassium: 104.0, vitC: 4.6 },
    ghge: 0.9 // Apple, raw
  },
  'Banana': {
    fndds_code: '63107010',
    nutrients: { protein: 0.74, carbs: 22.71, fat: 0.28, sugars: 15.8 },
    micros: { iron: 0.0, calcium: 5.0, potassium: 326.0, vitC: 12.0 },
    ghge: 0.9 // Banana, raw
  },
  'Orange': {
    fndds_code: '61119010',
    nutrients: { protein: 0.92, carbs: 11.78, fat: 0.14, sugars: 8.96 },
    micros: { iron: 0.22, calcium: 42.0, potassium: 174.0, vitC: 56.2 },
    ghge: 0.9 // Orange, raw
  },
  'Mango': {
    fndds_code: '63129010',
    nutrients: { protein: 0.82, carbs: 14.98, fat: 0.38, sugars: 13.66 },
    micros: { iron: 0.16, calcium: 11.0, potassium: 168.0, vitC: 36.4 },
    ghge: 0.9 // Mango, raw
  },
  'Grapes': {
    fndds_code: '63123000',
    nutrients: { protein: 0.9, carbs: 19.4, fat: 0.2, sugars: 16.74 },
    micros: { iron: 0.18, calcium: 10.0, potassium: 224.0, vitC: 3.2 },
    ghge: 0.9 // Grapes, raw
  },
  'Spinach': {
    fndds_code: '72125100',
    nutrients: { protein: 2.85, carbs: 2.41, fat: 0.62, sugars: 0.42 },
    micros: { iron: 1.26, calcium: 68.0, potassium: 582.0, vitC: 26.5 },
    ghge: 1.8 // Spinach, raw
  },
  'Broccoli': {
    fndds_code: '72201100',
    nutrients: { protein: 2.57, carbs: 6.27, fat: 0.34, sugars: 1.4 },
    micros: { iron: 0.69, calcium: 46.0, potassium: 303.0, vitC: 91.3 },
    ghge: 1.8 // Broccoli, raw
  },
  'Carrot': {
    fndds_code: '27311110',
    nutrients: { protein: 6.93, carbs: 13.46, fat: 5.15, sugars: 1.19 },
    micros: { iron: 2.05, calcium: 17.0, potassium: 337.0, vitC: 25.1 },
    ghge: 1.8 // Beef, potatoes, and vegetables including carrots, broccoli, and/or dark-green leafy; no sauce
  },
  'Tomato': {
    fndds_code: '14670000',
    nutrients: { protein: 7.17, carbs: 3.86, fat: 10.87, sugars: 2.32 },
    micros: { iron: 0.43, calcium: 147.0, potassium: 133.0, vitC: 5.1 },
    ghge: 1.8 // Mozzarella cheese, tomato, and basil, with oil and vinegar dressing
  },
  'Bell pepper': {
    fndds_code: '75122100',
    nutrients: { protein: 0.72, carbs: 4.78, fat: 0.11, sugars: 2.4 },
    micros: { iron: 0.28, calcium: 8.0, potassium: 153.0, vitC: 78.4 },
    ghge: 1.8 // Peppers, sweet, green, raw
  },
  'Brown rice': {
    fndds_code: '56205011',
    nutrients: { protein: 2.44, carbs: 25.76, fat: 1.11, sugars: 0.22 },
    micros: { iron: 0.5, calcium: 3.0, potassium: 51.0, vitC: 0.0 },
    ghge: 3.9 // Rice, brown, cooked, NS as to fat
  },
  'Oats': {
    fndds_code: '11435100',
    nutrients: { protein: 9.22, carbs: 20.02, fat: 3.67, sugars: 10.74 },
    micros: { iron: 0.77, calcium: 98.0, potassium: 191.0, vitC: 0.5 },
    ghge: 3.9 // Yogurt, Greek, with oats
  },
  'Quinoa': {
    fndds_code: '56204000',
    nutrients: { protein: 4.2, carbs: 20.22, fat: 5.42, sugars: 0.84 },
    micros: { iron: 1.41, calcium: 16.0, potassium: 161.0, vitC: 0.0 },
    ghge: 3.9 // Quinoa, NS as to fat
  },
  'Barley': {
    fndds_code: '51801010',
    nutrients: { protein: 10.67, carbs: 47.54, fat: 4.53, sugars: 5.73 },
    micros: { iron: 3.51, calcium: 55.0, potassium: 172.0, vitC: 0.0 },
    ghge: 3.9 // Bread, barley
  },
  'Whole wheat': {
    fndds_code: '51320500',
    nutrients: { protein: 3.27, carbs: 4.63, fat: 3.2, sugars: 4.81 },
    micros: { iron: 0.0, calcium: 123.0, potassium: 150.0, vitC: 0.0 },
    ghge: 3.9 // Milk, whole
  },
  'Black beans': {
    fndds_code: '41101990',
    nutrients: { protein: 8.23, carbs: 22.04, fat: 7.01, sugars: 0.3 },
    micros: { iron: 2.19, calcium: 24.0, potassium: 337.0, vitC: 0.0 },
    ghge: 2.1 // Black beans, NFS
  },
  'Lentils': {
    fndds_code: '41304970',
    nutrients: { protein: 8.38, carbs: 18.71, fat: 6.86, sugars: 1.67 },
    micros: { iron: 3.03, calcium: 17.0, potassium: 326.0, vitC: 1.4 },
    ghge: 2.1 // Lentils, NFS
  },
  'Chickpeas': {
    fndds_code: '41301990',
    nutrients: { protein: 8.23, carbs: 25.48, fat: 8.91, sugars: 4.46 },
    micros: { iron: 2.65, calcium: 46.0, potassium: 271.0, vitC: 1.1 },
    ghge: 2.1 // Chickpeas, NFS
  },
  'Kidney beans': {
    fndds_code: '25130000',
    nutrients: { protein: 27.05, carbs: 0.0, fat: 4.61, sugars: 0.0 },
    micros: { iron: 5.25, calcium: 14.0, potassium: 288.0, vitC: 4.1 },
    ghge: 2.1 // Kidney
  },
  'Split peas': {
    fndds_code: '13121120',
    nutrients: { protein: 2.42, carbs: 32.59, fat: 6.88, sugars: 24.17 },
    micros: { iron: 0.28, calcium: 73.0, potassium: 260.0, vitC: 4.5 },
    ghge: 2.1 // Banana split
  },
  'Beef steak': {
    fndds_code: '21101000',
    nutrients: { protein: 27.0, carbs: 0.0, fat: 12.88, sugars: 0.0 },
    micros: { iron: 2.37, calcium: 10.0, potassium: 371.0, vitC: 0.0 },
    ghge: 17.1 // Beef, steak, NFS
  },
  'Pork loin': {
    fndds_code: '22000100',
    nutrients: { protein: 27.14, carbs: 0.0, fat: 8.67, sugars: 0.0 },
    micros: { iron: 1.05, calcium: 21.0, potassium: 422.0, vitC: 0.0 },
    ghge: 17.1 // Pork, NFS
  },
  'Lamb chop': {
    fndds_code: '23000100',
    nutrients: { protein: 24.32, carbs: 0.0, fat: 20.77, sugars: 0.0 },
    micros: { iron: 2.05, calcium: 20.0, potassium: 300.0, vitC: 0.0 },
    ghge: 17.1 // Lamb, NS as to cut
  },
  'Beef roast': {
    fndds_code: '21000100',
    nutrients: { protein: 27.13, carbs: 0.0, fat: 13.04, sugars: 0.0 },
    micros: { iron: 2.76, calcium: 8.0, potassium: 341.0, vitC: 0.0 },
    ghge: 17.1 // Beef, NFS
  },
  'Pork tenderloin': {
    fndds_code: '22000100',
    nutrients: { protein: 27.14, carbs: 0.0, fat: 8.67, sugars: 0.0 },
    micros: { iron: 1.05, calcium: 21.0, potassium: 422.0, vitC: 0.0 },
    ghge: 17.1 // Pork, NFS
  },
  'Chicken breast': {
    fndds_code: '24122140',
    nutrients: { protein: 26.37, carbs: 0.09, fat: 7.67, sugars: 0.09 },
    micros: { iron: 1.12, calcium: 14.0, potassium: 251.0, vitC: 0.0 },
    ghge: 17.1 // Chicken breast, baked or broiled, skin eaten, from pre-cooked
  },
  'Chicken thigh': {
    fndds_code: '24152240',
    nutrients: { protein: 22.51, carbs: 0.12, fat: 15.08, sugars: 0.12 },
    micros: { iron: 1.25, calcium: 13.0, potassium: 218.0, vitC: 0.0 },
    ghge: 17.1 // Chicken thigh, baked or broiled, skin eaten, from pre-cooked
  },
  'Chicken drumstick': {
    fndds_code: '24142310',
    nutrients: { protein: 25.65, carbs: 0.12, fat: 11.46, sugars: 0.12 },
    micros: { iron: 1.21, calcium: 15.0, potassium: 257.0, vitC: 0.0 },
    ghge: 17.1 // Chicken drumstick, baked or broiled, skin eaten, from pre-cooked
  },
  'Chicken wings': {
    fndds_code: '24162140',
    nutrients: { protein: 23.42, carbs: 0.6, fat: 18.04, sugars: 0.6 },
    micros: { iron: 1.15, calcium: 15.0, potassium: 198.0, vitC: 0.0 },
    ghge: 17.1 // Chicken wing, baked or broiled, from pre-cooked
  },
  'Whole chicken': {
    fndds_code: '11111000',
    nutrients: { protein: 3.27, carbs: 4.63, fat: 3.2, sugars: 4.81 },
    micros: { iron: 0.0, calcium: 123.0, potassium: 150.0, vitC: 0.0 },
    ghge: 17.1 // Milk, whole
  },
  'Salt': {
    fndds_code: '14203020',
    nutrients: { protein: 10.24, carbs: 6.59, fat: 0.29, sugars: 1.83 },
    micros: { iron: 0.16, calcium: 71.0, potassium: 85.0, vitC: 0.0 },
    ghge: 2.2 // Cheese, cottage, salted, dry curd
  },
  'Black pepper': {
    fndds_code: '41101990',
    nutrients: { protein: 8.23, carbs: 22.04, fat: 7.01, sugars: 0.3 },
    micros: { iron: 2.19, calcium: 24.0, potassium: 337.0, vitC: 0.0 },
    ghge: 2.2 // Black beans, NFS
  },
  'Garlic powder': {
    fndds_code: '27151050',
    nutrients: { protein: 11.56, carbs: 2.45, fat: 24.96, sugars: 0.47 },
    micros: { iron: 1.34, calcium: 40.0, potassium: 167.0, vitC: 2.8 },
    ghge: 2.2 // Shrimp in garlic sauce, Puerto Rican style
  },
  'Onion powder': {
    fndds_code: '11440030',
    nutrients: { protein: 6.82, carbs: 4.06, fat: 12.91, sugars: 3.38 },
    micros: { iron: 0.14, calcium: 129.0, potassium: 181.0, vitC: 0.2 },
    ghge: 2.2 // Onion dip, yogurt based
  },
  'Paprika': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Soy sauce': {
    fndds_code: '41420300',
    nutrients: { protein: 8.14, carbs: 4.93, fat: 0.57, sugars: 0.4 },
    micros: { iron: 2.38, calcium: 33.0, potassium: 435.0, vitC: 0.0 },
    ghge: 2.2 // Soy sauce
  },
  'Ketchup': {
    fndds_code: '74401010',
    nutrients: { protein: 1.08, carbs: 27.1, fat: 0.32, sugars: 21.54 },
    micros: { iron: 0.41, calcium: 16.0, potassium: 301.0, vitC: 4.0 },
    ghge: 2.2 // Ketchup
  },
  'Mustard': {
    fndds_code: '72122100',
    nutrients: { protein: 2.86, carbs: 4.67, fat: 0.42, sugars: 1.32 },
    micros: { iron: 1.46, calcium: 115.0, potassium: 384.0, vitC: 70.0 },
    ghge: 2.2 // Mustard greens, raw
  },
  'Vinegar': {
    fndds_code: '14670000',
    nutrients: { protein: 7.17, carbs: 3.86, fat: 10.87, sugars: 2.32 },
    micros: { iron: 0.43, calcium: 147.0, potassium: 133.0, vitC: 5.1 },
    ghge: 2.2 // Mozzarella cheese, tomato, and basil, with oil and vinegar dressing
  },
  'Hot sauce': {
    fndds_code: '75511010',
    nutrients: { protein: 1.29, carbs: 0.8, fat: 0.76, sugars: 0.13 },
    micros: { iron: 0.28, calcium: 21.0, potassium: 202.0, vitC: 72.8 },
    ghge: 2.2 // Hot pepper sauce
  },
  'White sugar': {
    fndds_code: '13411000',
    nutrients: { protein: 3.84, carbs: 9.21, fat: 10.2, sugars: 4.63 },
    micros: { iron: 0.11, calcium: 137.0, potassium: 153.0, vitC: 0.4 },
    ghge: 2.6 // White sauce or gravy
  },
  'Brown sugar': {
    fndds_code: '52401000',
    nutrients: { protein: 10.67, carbs: 47.54, fat: 4.53, sugars: 5.73 },
    micros: { iron: 3.51, calcium: 55.0, potassium: 172.0, vitC: 0.0 },
    ghge: 2.6 // Bread, Boston Brown
  },
  'Honey': {
    fndds_code: '91302010',
    nutrients: { protein: 0.3, carbs: 82.4, fat: 0.0, sugars: 82.12 },
    micros: { iron: 0.42, calcium: 6.0, potassium: 52.0, vitC: 0.5 },
    ghge: 2.6 // Honey
  },
  'Maple syrup': {
    fndds_code: '56203130',
    nutrients: { protein: 2.44, carbs: 20.23, fat: 1.25, sugars: 7.99 },
    micros: { iron: 2.62, calcium: 88.0, potassium: 135.0, vitC: 0.0 },
    ghge: 2.6 // Oatmeal, instant, maple flavored, no added fat
  },
  'Corn syrup': {
    fndds_code: '21416000',
    nutrients: { protein: 18.17, carbs: 0.47, fat: 18.98, sugars: 0.0 },
    micros: { iron: 2.2, calcium: 15.0, potassium: 147.0, vitC: 13.9 },
    ghge: 2.6 // Beef, corned
  },
  'Cornstarch': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Gelatin': {
    fndds_code: '14610200',
    nutrients: { protein: 6.82, carbs: 9.03, fat: 2.27, sugars: 7.66 },
    micros: { iron: 0.1, calcium: 48.0, potassium: 59.0, vitC: 0.3 },
    ghge: 2.2 // Cheese, cottage cheese, with gelatin dessert
  },
  'Pectin': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Agar-agar': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Modified food starch': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Baking powder': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Baking soda': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Yeast': {
    fndds_code: '51165000',
    nutrients: { protein: 6.2, carbs: 50.9, fat: 16.4, sugars: 31.73 },
    micros: { iron: 1.5, calcium: 111.0, potassium: 113.0, vitC: 0.0 },
    ghge: 2.2 // Coffee cake, yeast type
  },
  'Cream of tartar': {
    fndds_code: '11512100',
    nutrients: { protein: 2.7, carbs: 16.25, fat: 2.8, sugars: 14.92 },
    micros: { iron: 0.0, calcium: 101.0, potassium: 150.0, vitC: 0.2 },
    ghge: 2.2 // Hot chocolate / cocoa, with whipped cream
  },
  "Ammonium bicarbonate (baker's ammonia)": {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 2.2 // Fallback
  },
  'Cheese': {
    fndds_code: '14104100',
    nutrients: { protein: 23.3, carbs: 2.44, fat: 34.0, sugars: 0.33 },
    micros: { iron: 0.16, calcium: 707.0, potassium: 77.0, vitC: 0.0 },
    ghge: 11.5 // Cheese, Cheddar
  },
  'Plain yogurt': {
    fndds_code: '11480010',
    nutrients: { protein: 3.82, carbs: 5.57, fat: 4.48, sugars: 4.09 },
    micros: { iron: 0.04, calcium: 133.0, potassium: 172.0, vitC: 0.5 },
    ghge: 11.5 // Baby Toddler yogurt, plain
  },
  'Cottage cheese': {
    fndds_code: '14200100',
    nutrients: { protein: 11.0, carbs: 4.31, fat: 2.3, sugars: 4.1 },
    micros: { iron: 0.07, calcium: 87.0, potassium: 99.0, vitC: 0.0 },
    ghge: 11.5 // Cheese, cottage, NFS
  },
  'Kefir': {
    fndds_code: '11115400',
    nutrients: { protein: 3.59, carbs: 7.48, fat: 0.96, sugars: 6.91 },
    micros: { iron: 0.02, calcium: 122.0, potassium: 177.0, vitC: 0.0 },
    ghge: 11.5 // Kefir
  },
  'Sweetened condensed milk': {
    fndds_code: '11220000',
    nutrients: { protein: 7.91, carbs: 54.4, fat: 8.7, sugars: 54.4 },
    micros: { iron: 0.2, calcium: 284.0, potassium: 371.0, vitC: 1.0 },
    ghge: 11.5 // Milk, condensed, sweetened
  },
  'Traditional bread': {
    fndds_code: '51101000',
    nutrients: { protein: 9.43, carbs: 49.2, fat: 3.59, sugars: 5.34 },
    micros: { iron: 3.59, calcium: 142.0, potassium: 123.0, vitC: 0.0 },
    ghge: 3.9 // Bread, white
  },
  'Plain crackers': {
    fndds_code: '11411010',
    nutrients: { protein: 5.25, carbs: 7.04, fat: 1.55, sugars: 7.04 },
    micros: { iron: 0.08, calcium: 183.0, potassium: 234.0, vitC: 0.7 },
    ghge: 3.9 // Yogurt, NS as to type of milk, plain
  },
  'Salted popcorn': {
    fndds_code: '54403010',
    nutrients: { protein: 12.89, carbs: 77.47, fat: 4.52, sugars: 0.87 },
    micros: { iron: 3.19, calcium: 11.0, potassium: 329.0, vitC: 0.0 },
    ghge: 3.9 // Popcorn, air-popped, no butter added
  },
  'Pasta': {
    fndds_code: '56130000',
    nutrients: { protein: 5.76, carbs: 30.68, fat: 0.92, sugars: 0.56 },
    micros: { iron: 1.28, calcium: 7.0, potassium: 44.0, vitC: 0.0 },
    ghge: 3.9 // Pasta, cooked
  },
  'Tortillas': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 3.9 // Fallback
  },
  'Canned vegetables': {
    fndds_code: '22311500',
    nutrients: { protein: 20.94, carbs: 0.49, fat: 8.43, sugars: 0.0 },
    micros: { iron: 0.91, calcium: 6.0, potassium: 247.0, vitC: 0.0 },
    ghge: 1.3 // Ham, canned
  },
  'Canned fruits in syrup': {
    fndds_code: '22311500',
    nutrients: { protein: 20.94, carbs: 0.49, fat: 8.43, sugars: 0.0 },
    micros: { iron: 0.91, calcium: 6.0, potassium: 247.0, vitC: 0.0 },
    ghge: 1.3 // Ham, canned
  },
  'Pickles (American)': {
    fndds_code: '75503010',
    nutrients: { protein: 0.48, carbs: 1.99, fat: 0.43, sugars: 1.28 },
    micros: { iron: 0.38, calcium: 54.0, potassium: 24.0, vitC: 1.0 },
    ghge: 1.3 // Pickles, dill
  },
  'Tomato sauce/paste': {
    fndds_code: '58131523',
    nutrients: { protein: 2.48, carbs: 13.64, fat: 1.45, sugars: 3.72 },
    micros: { iron: 1.05, calcium: 21.0, potassium: 216.0, vitC: 0.3 },
    ghge: 1.3 // Ravioli, cheese-filled, with tomato sauce, canned
  },
  'Dried fruits with added sugar': {
    fndds_code: '21602000',
    nutrients: { protein: 31.1, carbs: 2.76, fat: 1.94, sugars: 2.7 },
    micros: { iron: 3.96, calcium: 15.0, potassium: 457.0, vitC: 19.3 },
    ghge: 1.3 // Beef, dried, chipped, uncooked
  },
  'Canned tuna': {
    fndds_code: '22311500',
    nutrients: { protein: 20.94, carbs: 0.49, fat: 8.43, sugars: 0.0 },
    micros: { iron: 0.91, calcium: 6.0, potassium: 247.0, vitC: 0.0 },
    ghge: 16.1 // Ham, canned
  },
  'Canned salmon': {
    fndds_code: '22311500',
    nutrients: { protein: 20.94, carbs: 0.49, fat: 8.43, sugars: 0.0 },
    micros: { iron: 0.91, calcium: 6.0, potassium: 247.0, vitC: 0.0 },
    ghge: 16.1 // Ham, canned
  },
  'Salted fish': {
    fndds_code: '14203020',
    nutrients: { protein: 10.24, carbs: 6.59, fat: 0.29, sugars: 1.83 },
    micros: { iron: 0.16, calcium: 71.0, potassium: 85.0, vitC: 0.0 },
    ghge: 16.1 // Cheese, cottage, salted, dry curd
  },
  'Smoked fish': {
    fndds_code: '26137190',
    nutrients: { protein: 18.28, carbs: 0.0, fat: 4.32, sugars: 0.0 },
    micros: { iron: 0.85, calcium: 11.0, potassium: 175.0, vitC: 0.0 },
    ghge: 16.1 // Fish, salmon, smoked
  },
  'Cured ham': {
    fndds_code: '22600200',
    nutrients: { protein: 37.41, carbs: 1.9, fat: 35.8, sugars: 1.57 },
    micros: { iron: 1.63, calcium: 15.0, potassium: 565.0, vitC: 0.0 },
    ghge: 16.1 // Pork bacon, NS as to fresh, smoked or cured, cooked
  },
  'Coca-Cola® or Pepsi®': {
    fndds_code: '00000000',
    nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 },
    micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 },
    ghge: 0.4 // Fallback
  },
  'Mountain Dew®': {
    fndds_code: '95310500',
    nutrients: { protein: 0.25, carbs: 12.08, fat: 0.08, sugars: 12.08 },
    micros: { iron: 0.02, calcium: 13.0, potassium: 5.0, vitC: 0.0 },
    ghge: 0.4 // Energy drink (Mountain Dew AMP)
  },
  'Sweetened iced tea': {
    fndds_code: '11220000',
    nutrients: { protein: 7.91, carbs: 54.4, fat: 8.7, sugars: 54.4 },
    micros: { iron: 0.2, calcium: 284.0, potassium: 371.0, vitC: 1.0 },
    ghge: 0.4 // Milk, condensed, sweetened
  },
  'Sports drinks': {
    fndds_code: '92900300',
    nutrients: { protein: 0.0, carbs: 97.9, fat: 1.01, sugars: 97.15 },
    micros: { iron: 0.11, calcium: 15.0, potassium: 139.0, vitC: 1.9 },
    ghge: 0.4 // Sports drink, dry concentrate, not reconstituted
  },
  'Sweetened fruit drinks/fruit punch': {
    fndds_code: '11220000',
    nutrients: { protein: 7.91, carbs: 54.4, fat: 8.7, sugars: 54.4 },
    micros: { iron: 0.2, calcium: 284.0, potassium: 371.0, vitC: 1.0 },
    ghge: 0.4 // Milk, condensed, sweetened
  },
  'Potato chips': {
    fndds_code: '27211000',
    nutrients: { protein: 7.92, carbs: 14.52, fat: 4.93, sugars: 0.65 },
    micros: { iron: 1.34, calcium: 11.0, potassium: 457.0, vitC: 14.5 },
    ghge: 2.6 // Beef and potatoes, no sauce
  },
  'Chocolate bars': {
    fndds_code: '11321000',
    nutrients: { protein: 3.35, carbs: 8.32, fat: 2.03, sugars: 7.49 },
    micros: { iron: 0.48, calcium: 116.0, potassium: 156.0, vitC: 0.1 },
    ghge: 2.6 // Soy milk, chocolate
  },
  'Candy': {
    fndds_code: '13120110',
    nutrients: { protein: 4.4, carbs: 30.9, fat: 20.2, sugars: 30.0 },
    micros: { iron: 0.81, calcium: 120.0, potassium: 251.0, vitC: 0.4 },
    ghge: 2.6 // Ice cream candy bar
  },
  'Packaged cookies': {
    fndds_code: '13120790',
    nutrients: { protein: 5.21, carbs: 34.38, fat: 21.88, sugars: 25.0 },
    micros: { iron: 0.52, calcium: 104.0, potassium: 167.0, vitC: 0.0 },
    ghge: 2.6 // Ice cream cone, vanilla, prepackaged
  },
  'Cheese-flavored crackers': {
    fndds_code: '54304000',
    nutrients: { protein: 10.93, carbs: 59.42, fat: 22.74, sugars: 4.53 },
    micros: { iron: 3.42, calcium: 99.0, potassium: 181.0, vitC: 0.0 },
    ghge: 2.6 // Crackers, cheese
  },
  'Frozen pizza': {
    fndds_code: '11459990',
    nutrients: { protein: 3.0, carbs: 21.6, fat: 3.6, sugars: 19.92 },
    micros: { iron: 0.14, calcium: 106.0, potassium: 156.0, vitC: 0.5 },
    ghge: 4.8 // Frozen yogurt, NFS
  },
  'Instant noodles (Ramen)': {
    fndds_code: '58407030',
    nutrients: { protein: 1.53, carbs: 9.04, fat: 2.64, sugars: 0.3 },
    micros: { iron: 0.43, calcium: 8.0, potassium: 26.0, vitC: 0.0 },
    ghge: 4.8 // Soup, ramen noodles, water added
  },
  'Microwaveable frozen dinners': {
    fndds_code: '28110300',
    nutrients: { protein: 6.82, carbs: 10.94, fat: 8.4, sugars: 1.35 },
    micros: { iron: 0.77, calcium: 17.0, potassium: 228.0, vitC: 1.7 },
    ghge: 4.8 // Salisbury steak dinner, NFS, frozen meal
  },
  'Canned pasta meals': {
    fndds_code: '22311500',
    nutrients: { protein: 20.94, carbs: 0.49, fat: 8.43, sugars: 0.0 },
    micros: { iron: 0.91, calcium: 6.0, potassium: 247.0, vitC: 0.0 },
    ghge: 4.8 // Ham, canned
  },
  'Frozen macaroni and cheese': {
    fndds_code: '11459990',
    nutrients: { protein: 3.0, carbs: 21.6, fat: 3.6, sugars: 19.92 },
    micros: { iron: 0.14, calcium: 106.0, potassium: 156.0, vitC: 0.5 },
    ghge: 4.8 // Frozen yogurt, NFS
  },
  'Chicken nuggets': {
    fndds_code: '24198736',
    nutrients: { protein: 13.36, carbs: 17.88, fat: 19.23, sugars: 0.8 },
    micros: { iron: 0.94, calcium: 21.0, potassium: 205.0, vitC: 0.0 },
    ghge: 17.1 // Chicken nuggets, from frozen
  },
  'Hot dogs': {
    fndds_code: '11512005',
    nutrients: { protein: 1.82, carbs: 13.9, fat: 1.04, sugars: 12.0 },
    micros: { iron: 0.19, calcium: 54.0, potassium: 201.0, vitC: 0.0 },
    ghge: 17.1 // Hot chocolate / cocoa, NFS
  },
  'Chicken patties': {
    fndds_code: '28140720',
    nutrients: { protein: 10.68, carbs: 16.0, fat: 8.1, sugars: 1.0 },
    micros: { iron: 1.13, calcium: 17.0, potassium: 231.0, vitC: 3.1 },
    ghge: 17.1 // Chicken patty, or nuggets, boneless, breaded, potatoes, vegetable, frozen meal
  },
  'Fish sticks': {
    fndds_code: '26100100',
    nutrients: { protein: 17.22, carbs: 0.0, fat: 2.34, sugars: 0.0 },
    micros: { iron: 0.44, calcium: 12.0, potassium: 387.0, vitC: 1.3 },
    ghge: 17.1 // Fish, raw
  },
  'Deli meat slices': {
    fndds_code: '25230210',
    nutrients: { protein: 16.7, carbs: 0.27, fat: 3.73, sugars: 0.0 },
    micros: { iron: 0.99, calcium: 7.0, potassium: 341.0, vitC: 22.0 },
    ghge: 17.1 // Ham, prepackaged or deli, luncheon meat
  },
  'default': { fndds_code: '00000000', nutrients: { protein: 0, carbs: 0, fat: 0, sugars: 0 }, micros: { iron: 0, calcium: 0, potassium: 0, vitC: 0 }, ghge: 2.0 }
};

const portionMultipliers = {
  'small': 1,
  'medium': 2.5,
  'large': 4
};

// --- NOVA PROCESSING CLASSIFICATION (1-4) ---
// 1 = Unprocessed, 2 = Culinary Ingredients, 3 = Processed, 4 = Ultra-Processed
const novaMapping = {
  'Apple': 1, 'Banana': 1, 'Orange': 1, 'Mango': 1, 'Grapes': 1,
  'Spinach': 1, 'Broccoli': 1, 'Carrot': 1, 'Tomato': 1, 'Bell pepper': 1,
  'Brown rice': 1, 'Oats': 1, 'Quinoa': 1, 'Barley': 1, 'Whole wheat': 1,
  'Black beans': 1, 'Lentils': 1, 'Chickpeas': 1, 'Kidney beans': 1, 'Split peas': 1,
  'Beef steak': 1, 'Pork loin': 1, 'Lamb chop': 1, 'Beef roast': 1, 'Pork tenderloin': 1,
  'Chicken breast': 1, 'Chicken thigh': 1, 'Chicken drumstick': 1, 'Chicken wings': 1, 'Whole chicken': 1,
  'Plain yogurt': 1, 'Kefir': 1, 'Pasta': 1, 
  
  'Salt': 2, 'Black pepper': 2, 'Garlic powder': 2, 'Onion powder': 2, 'Paprika': 2,
  'Vinegar': 2, 'White sugar': 2, 'Brown sugar': 2, 'Honey': 2, 'Maple syrup': 2, 'Corn syrup': 2,
  'Cornstarch': 2, 'Gelatin': 2, 'Pectin': 2, 'Agar-agar': 2, 
  'Baking powder': 2, 'Baking soda': 2, 'Yeast': 2, 'Cream of tartar': 2, "Ammonium bicarbonate (baker's ammonia)": 2,

  'Soy sauce': 3, 'Mustard': 3, 'Hot sauce': 3, 'Cheese': 3, 'Cottage cheese': 3, 'Sweetened condensed milk': 3,
  'Traditional bread': 3, 'Salted popcorn': 3, 'Tortillas': 3,
  'Canned vegetables': 3, 'Canned fruits in syrup': 3, 'Pickles (American)': 3, 'Tomato sauce/paste': 3, 'Dried fruits with added sugar': 3,
  'Canned tuna': 3, 'Canned salmon': 3, 'Salted fish': 3, 'Smoked fish': 3, 'Cured ham': 3,

  'Ketchup': 4, 'Modified food starch': 4, 'Plain crackers': 4,
  'Coca-Cola® or Pepsi®': 4, 'Mountain Dew®': 4, 'Sweetened iced tea': 4, 'Sports drinks': 4, 'Sweetened fruit drinks/fruit punch': 4,
  'Potato chips': 4, 'Chocolate bars': 4, 'Candy': 4, 'Packaged cookies': 4, 'Cheese-flavored crackers': 4,
  'Frozen pizza': 4, 'Instant noodles (Ramen)': 4, 'Microwaveable frozen dinners': 4, 'Canned pasta meals': 4, 'Frozen macaroni and cheese': 4,
  'Chicken nuggets': 4, 'Hot dogs': 4, 'Chicken patties': 4, 'Fish sticks': 4, 'Deli meat slices': 4
};

// ... [KEEP YOUR EXISTING foodCategories AND imageMapping CONSTANTS HERE EXACTLY AS THEY WERE] ...
const foodCategories = [
  { id: 'g1_fruits', group: 'Group 1', name: 'Fruits', options: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'] },
  { id: 'g1_vegetables', group: 'Group 1', name: 'Vegetables', options: ['Spinach', 'Broccoli', 'Carrot', 'Tomato', 'Bell pepper'] },
  { id: 'g1_grains', group: 'Group 1', name: 'Whole Grains', options: ['Brown rice', 'Oats', 'Quinoa', 'Barley', 'Whole wheat'] },
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
  'Brown rice': 'brown_rice.png', 'Oats': 'oats.png', 'Quinoa': 'quinoa.png', 'Barley': 'barley.png', 'Whole wheat': 'whole_wheat.png',
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
    
    // New Micronutrient accumulators
    let totalIron = 0;
    let totalCalcium = 0;
    let totalPotassium = 0;
    let totalVitC = 0;

    let totalCarbonFootprint = 0;
    let totalItems = 0;
    let totalNovaScore = 0;

    Object.values(responses).forEach(categoryData => {
      if (categoryData.consumed && categoryData.items.length > 0) {
        categoryData.items.forEach(item => {
          const foodData = foodDatabase[item.food] || foodDatabase['default'];
          const multiplier = portionMultipliers[item.portion];
          
          // Macros & Emissions
          totalProtein += (foodData.nutrients.protein * multiplier);
          totalCarbs += (foodData.nutrients.carbs * multiplier);
          totalFat += (foodData.nutrients.fat * multiplier);
          totalSugars += (foodData.nutrients.sugars * multiplier);
          totalCarbonFootprint += (foodData.ghge * multiplier);

          // Micronutrients
          totalIron += (foodData.micros.iron * multiplier);
          totalCalcium += (foodData.micros.calcium * multiplier);
          totalPotassium += (foodData.micros.potassium * multiplier);
          totalVitC += (foodData.micros.vitC * multiplier);
          
          const itemNovaGroup = novaMapping[item.food] || 4;
          totalNovaScore += (itemNovaGroup * multiplier);
          totalItems += multiplier;
        });
      }
    });

    const averageNova = totalItems > 0 ? (totalNovaScore / totalItems) : 4;
    let finalHealthScore = Math.max(0, Math.round(100 - ((averageNova - 1) * 33.33)));

    setDashboardData({
      healthScore: finalHealthScore,
      carbonFootprint: totalCarbonFootprint.toFixed(1),
      nutrition: [
        { name: 'Protein', value: Number(totalProtein.toFixed(1)) },
        { name: 'Carbs', value: Number(totalCarbs.toFixed(1)) },
        { name: 'Fat', value: Number(totalFat.toFixed(1)) },
        { name: 'Sugars', value: Number(totalSugars.toFixed(1)) }
      ],
      // NEW: Array specifically structured for the Bar Chart
      microsArray: [
        { name: 'Iron', amount: Number(totalIron.toFixed(1)), unit: 'mg' },
        { name: 'Calcium', amount: Number(totalCalcium.toFixed(1)), unit: 'mg' },
        { name: 'Potassium', amount: Number(totalPotassium.toFixed(1)), unit: 'mg' },
        { name: 'Vit C', amount: Number(totalVitC.toFixed(1)), unit: 'mg' }
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

                {/* TILE 4: MICRONUTRIENT BAR CHART */}
<div className="dashboard-card micro-card">
  <h3>Micronutrient Breakdown</h3>
  <p className="score-desc" style={{marginBottom: '0'}}>Total intake in milligrams (mg).</p>
  <div style={{ width: '100%', height: 220 }}>
    <ResponsiveContainer>
      <BarChart data={dashboardData.microsArray} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, 'Amount']} />
        <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
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