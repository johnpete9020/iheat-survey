import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// 1. MOCK SCORING SYSTEM (Update these values with your actual scientific data)
const impactScores = {
  'Fruits': { health: 9, carbon: 0.4 },
  'Vegetables': { health: 10, carbon: 0.3 },
  'Whole Grains': { health: 8, carbon: 0.5 },
  'Legumes': { health: 9, carbon: 0.2 },
  'Fresh Cuts of Meat': { health: 4, carbon: 7.5 },
  'Fresh Chicken Products': { health: 6, carbon: 2.5 },
  'Dairy Products': { health: 6, carbon: 3.0 },
  'Sugar-Sweetened Beverages': { health: 1, carbon: 1.2 },
  'Packaged Snacks and Confectionery': { health: 2, carbon: 1.8 },
  'Ready-to-Eat or Heat Meals': { health: 3, carbon: 4.0 },
  'default': { health: 5, carbon: 1.0 } // Fallback for uncategorized items
};

const portionMultipliers = {
  'small': 1,
  'medium': 2.5,
  'large': 4
};

// ... [Keep your existing foodCategories and imageMapping constants exactly the same here] ...
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
  
  // NEW: State to hold the final calculated dashboard scores
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

  // 2. DASHBOARD CALCULATION FUNCTION
  const calculateDashboardScores = () => {
    let totalHealthScore = 0;
    let totalCarbonFootprint = 0;
    let totalItems = 0;

    Object.values(responses).forEach(categoryData => {
      if (categoryData.consumed && categoryData.items.length > 0) {
        // Look up the base score for this category (or use default)
        const baseScore = impactScores[categoryData.category] || impactScores['default'];
        
        categoryData.items.forEach(item => {
          const multiplier = portionMultipliers[item.portion];
          totalHealthScore += (baseScore.health * multiplier);
          totalCarbonFootprint += (baseScore.carbon * multiplier);
          totalItems += multiplier;
        });
      }
    });

    // Calculate a normalized score out of 100 (Simplified logic)
    const avgHealth = totalItems > 0 ? (totalHealthScore / totalItems) * 10 : 0;

    setDashboardData({
      healthScore: Math.round(avgHealth),
      carbonFootprint: totalCarbonFootprint.toFixed(1)
    });
  };

  const submitDataToSupabase = async () => {
    setIsSubmitting(true);
    const rowsToInsert = [];
    
    Object.values(responses).forEach(categoryData => {
      if (categoryData.consumed && categoryData.items.length > 0) {
        categoryData.items.forEach(item => {
          rowsToInsert.push({
            session_id: sessionId,
            food_group: categoryData.group,
            category: categoryData.category,
            food_item: item.food,
            portion_size: item.portion
          });
        });
      }
    });

    if (rowsToInsert.length === 0) {
      rowsToInsert.push({ session_id: sessionId, food_group: 'None', category: 'None', food_item: 'None', portion_size: 'None' });
    }

    const { error } = await supabase
      .from('iheat_responses')
      .insert(rowsToInsert);

    if (error) {
      console.error('Error saving data:', error);
      alert('There was an error saving your responses.');
    } else {
      // Upon success, calculate and display the dashboard
      calculateDashboardScores();
      setIsSuccess(true);
    }
    setIsSubmitting(false);
  };

  const isNextDisabled = consumed === null || 
    (consumed === true && (selectedFoods.length === 0 || selectedFoods.some(f => !portions[f])));

  if (currentStep >= foodCategories.length) {
    return (
      <>
        <h1 className="main-page-title">
          Integrated Human and Environmental Health Assessment Tool (IHEAT)
        </h1>
        <div className="app-container" style={{ textAlign: 'center' }}>
          
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
            // 3. NEW DASHBOARD UI
            <div className="dashboard-container">
              <h2>Your Impact Dashboard</h2>
              <p className="dashboard-subtitle">Based on your reported diet over the last week.</p>
              
              <div className="dashboard-grid">
                <div className="dashboard-card health-card">
                  <h3>Dietary Health Score</h3>
                  <div className="score-value">{dashboardData.healthScore}<span className="score-max">/100</span></div>
                  <p className="score-desc">Estimated nutritional quality based on food categories and portions.</p>
                  <div className="dashboard-progress-bg">
                    <div className="dashboard-progress-fill" style={{ width: `${dashboardData.healthScore}%`, backgroundColor: dashboardData.healthScore > 60 ? '#10b981' : '#f59e0b' }}></div>
                  </div>
                </div>

                <div className="dashboard-card carbon-card">
                  <h3>Carbon Footprint</h3>
                  <div className="score-value">{dashboardData.carbonFootprint}<span className="score-max"> kg</span></div>
                  <p className="score-desc">Estimated greenhouse gas emissions (CO₂e) of your diet.</p>
                  <div className="impact-tag">
                    {dashboardData.carbonFootprint < 15 ? '🌱 Low Impact' : '⚠️ High Impact'}
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