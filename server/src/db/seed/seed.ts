import { NodePgDatabase } from "drizzle-orm/node-postgres"
import { reset, seed } from "drizzle-seed"

export async function reset_db(db: NodePgDatabase, tables: Object) {
    try {
        reset(db, tables);
    } catch (error) {
        console.log("WARNING: `reset_db` not working!");
    }
}

export async function seed_db(db: NodePgDatabase, tables: Object) {
    try {
        await seed(db, tables).refine(f => ({
            products: {
                count: 500,
                columns: {
                    brand: f.valuesFromArray({
                        values: [
                            "Value", "Pams", "Maggi", "Pams Finest", "Copenhagen",
                            "Universal", "Bikano", "Trident", "Noodle Co", "Inaka Soba",
                            "Sizzlers", "Karikaas", "Doritos", "Rolling Meadow", "Black Beans",
                            "Heartland", "McCain", "Hellers", "Orion", "Littos"
                        ],
                    }),
                    details: f.valuesFromArray({
                        values: [
                            "Value", "Pams", "Maggi", "Pams Finest", "Copenhagen",
                            "Universal", "Bikano", "Trident", "Noodle Co", "Inaka Soba",
                            "Sizzlers", "Karikaas", "Doritos", "Rolling Meadow", "Black Beans",
                            "Heartland", "McCain", "Hellers", "Orion", "Littos"
                        ],
                    }),
                    amount: f.int({
                        minValue: 1,
                        maxValue: 1000,
                    }),
                    name: f.valuesFromArray({
                        values: [
                            "Organic Bananas", "Whole Milk", "Large Brown Eggs", "Wheat Bread", "Ground Coffee",
                            "Red Apples", "Greek Yogurt", "Chicken Breast", "Baby Spinach", "Orange Juice",
                            "Pasta Sauce", "Spaghetti", "Ground Beef", "White Rice", "Black Beans",
                            "Cheddar Cheese", "Butter", "Carrots", "Onions", "Garlic",
                            "Tomatoes", "Potatoes", "Sweet Potatoes", "Bell Peppers", "Olive Oil",
                            "Salt", "Black Pepper", "Sugar", "Flour", "Baking Powder",
                            "Vanilla Extract", "Honey", "Maple Syrup", "Peanut Butter", "Strawberry Jam",
                            "Cereal", "Oatmeal", "Granola", "Almonds", "Walnuts",
                            "Potato Chips", "Tortilla Chips", "Salsa", "Hummus", "Crackers",
                            "Paper Towels", "Toilet Paper", "Dish Soap", "Laundry Detergent", "Trash Bags",
                            "Salmon Fillet", "Tuna", "Shrimp", "Tilapia", "Cod",
                            "Broccoli", "Cauliflower", "Asparagus", "Green Beans", "Peas",
                            "Lettuce", "Kale", "Arugula", "Mixed Greens", "Cucumber",
                            "Zucchini", "Eggplant", "Mushrooms", "Celery", "Corn",
                            "Avocados", "Limes", "Lemons", "Oranges", "Grapefruit",
                            "Strawberries", "Blueberries", "Raspberries", "Blackberries", "Grapes",
                            "Watermelon", "Cantaloupe", "Honeydew", "Pineapple", "Mango",
                            "Bacon", "Ham", "Turkey", "Salami", "Pepperoni",
                            "Cream Cheese", "Mozzarella", "Swiss Cheese", "Parmesan", "Feta",
                            "Sour Cream", "Heavy Cream", "Half & Half", "Almond Milk", "Soy Milk",
                            "Brown Sugar", "Powdered Sugar", "Baking Soda", "Yeast", "Cornstarch",
                            "Ketchup", "Mustard", "Mayonnaise", "BBQ Sauce", "Hot Sauce",
                            "Soy Sauce", "Fish Sauce", "Worcestershire Sauce", "Vinegar", "Olive Oil",
                            "Canola Oil", "Vegetable Oil", "Coconut Oil", "Sesame Oil", "Cooking Spray",
                            "Rice Vinegar", "Apple Cider Vinegar", "Balsamic Vinegar", "Red Wine Vinegar", "White Vinegar",
                            "Chicken Stock", "Beef Stock", "Vegetable Stock", "Tomato Paste", "Diced Tomatoes",
                            "Coconut Milk", "Condensed Milk", "Evaporated Milk", "Almond Extract", "Mint Extract",
                            "Cinnamon", "Nutmeg", "Ginger", "Cumin", "Paprika",
                            "Oregano", "Basil", "Thyme", "Rosemary", "Bay Leaves",
                            "Chili Powder", "Curry Powder", "Turmeric", "Cayenne Pepper", "Red Pepper Flakes",
                            "Bagels", "English Muffins", "Tortillas", "Pita Bread", "Naan",
                            "Croissants", "Dinner Rolls", "Hot Dog Buns", "Hamburger Buns", "Sandwich Bread",
                            "Pasta Shells", "Penne", "Linguine", "Fettuccine", "Lasagna Noodles",
                            "Rice Noodles", "Egg Noodles", "Ramen Noodles", "Udon Noodles", "Soba Noodles",
                            "Quinoa", "Couscous", "Barley", "Lentils", "Split Peas",
                            "Chickpeas", "Kidney Beans", "Pinto Beans", "Navy Beans", "Cannellini Beans",
                            "Pork Chops", "Lamb Chops", "Ribeye Steak", "Sirloin Steak", "Ground Turkey",
                            "Ground Pork", "Italian Sausage", "Bratwurst", "Hot Dogs", "Tofu",
                            "Tempeh", "Seitan", "Beyond Meat", "Impossible Burger", "Veggie Burgers",
                            "Ice Cream", "Frozen Yogurt", "Sorbet", "Popsicles", "Frozen Pizza",
                            "Frozen Vegetables", "Frozen Fruit", "Frozen Waffles", "Frozen Pancakes", "TV Dinners",
                            "Chips Ahoy", "Oreos", "Graham Crackers", "Animal Crackers", "Saltines",
                            "Ritz Crackers", "Wheat Thins", "Triscuits", "Goldfish", "Cheez-Its",
                            "M&Ms", "Snickers", "Twix", "KitKat", "Reese's Cups",
                            "Skittles", "Starburst", "Gummy Bears", "Jelly Beans", "Lifesavers",
                            "Cola", "Lemon-Lime Soda", "Root Beer", "Ginger Ale", "Club Soda",
                            "Tonic Water", "Energy Drinks", "Sports Drinks", "Sparkling Water", "Spring Water",
                            "Green Tea", "Black Tea", "Chamomile Tea", "Earl Grey Tea", "Herbal Tea",
                            "Coffee Beans", "Instant Coffee", "Coffee Filters", "Creamer", "Sugar Packets",
                            "Protein Powder", "Vitamin C", "Multivitamins", "Fish Oil", "Probiotics",
                            "Band-Aids", "Cotton Swabs", "Dental Floss", "Toothpaste", "Mouthwash",
                            "Shampoo", "Conditioner", "Body Wash", "Hand Soap", "Deodorant",
                            "Aluminum Foil", "Plastic Wrap", "Sandwich Bags", "Storage Containers", "Paper Plates",
                            "Plastic Cups", "Napkins", "Dish Sponges", "All-Purpose Cleaner", "Glass Cleaner",
                            "Cat Food", "Dog Food", "Cat Litter", "Pet Treats", "Pet Toys",
                            "Baby Formula", "Baby Food", "Diapers", "Baby Wipes", "Baby Powder",
                            "Granola Bars", "Protein Bars", "Energy Bars", "Trail Mix", "Mixed Nuts",
                            "Popcorn", "Pretzels", "Rice Cakes", "Beef Jerky", "Dried Fruit",
                            "Pickles", "Olives", "Pepperoncini", "Jalapeños", "Banana Peppers",
                            "Artichoke Hearts", "Sun-Dried Tomatoes", "Roasted Red Peppers", "Capers", "Water Chestnuts",
                            "Bamboo Shoots", "Bean Sprouts", "Baby Corn", "Palm Hearts", "Sauerkraut",
                            "Kimchi", "Miso Paste", "Tahini", "Anchovy Paste", "Horseradish",
                            "Wasabi", "Sriracha", "Hoisin Sauce", "Oyster Sauce", "Sweet Chili Sauce",
                            "Teriyaki Sauce", "Alfredo Sauce", "Pesto", "Marinara Sauce", "Vodka Sauce",
                            "Ranch Dressing", "Italian Dressing", "Caesar Dressing", "Blue Cheese Dressing", "Thousand Island",
                            "Brownie Mix", "Cake Mix", "Pancake Mix", "Muffin Mix", "Cookie Mix",
                            "Pie Crust", "Whipped Cream", "Chocolate Chips", "Sprinkles", "Food Coloring",
                            "Marshmallows", "Graham Crackers", "Gelatin", "Pudding Mix", "Frosting",
                            "Nuts & Seeds Mix", "Sunflower Seeds", "Pumpkin Seeds", "Chia Seeds", "Flax Seeds",
                            "Dried Cranberries", "Dried Apricots", "Dried Mango", "Dried Pineapple", "Raisins",
                            "Dates", "Figs", "Prunes", "Coconut Flakes", "Goji Berries"
                        ],
                    }),
                },
            },
            stores: {
                count: 47,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "Woolworths Amberley", "Woolworths Andersons Bay", "Woolworths Aotea",
                            "Woolworths Ashburton", "Woolworths Ashburton South", "Woolworths Auckland Airport",
                            "Woolworths Auckland Quay Street", "Woolworths Auckland Victoria Street West", "Woolworths Avonhead",
                            "Woolworths Awapuni", "New World Alexandra", "New World Aokautere",
                            "New World Ashburton", "New World Balclutha", "New World Birkenhead",
                            "New World Bishopdale", "New World Blenheim", "New World Botany",
                            "PAK\'nSAVE Albany", "PAK\'nSAVE Alderman Dr Hen", "PAK\'nSAVE Blenheim",
                            "PAK\'nSAVE Botany", "PAK\'nSAVE Cameron Road", "PAK\'nSAVE Clarence St",
                            "PAK\'nSAVE Clendon", "PAK\'nSAVE Dunedin", "PAK\'nSAVE Glen Innes",
                            "PAK\'nSAVE Hastings", "PAK\'nSAVE Hawera", "The Warehouse",
                            "Fresh Choice Avondale", "Fresh Choice Flat Bush", "Fresh Choice Geraldine",
                            "Fresh Choice Glen Eden", "Fresh Choice Green Island", "Fresh Choice Greerton",
                            "Fresh Choice Greytown", "Fresh Choice Half Moon Bay", "Fresh Choice Huntly",
                            "Fresh Choice Kelly Road", "Super Value Bell Block", "Super Value Milton",
                            "Super Value Pauanui", "Super Value Plaza", "Super Value Reefton",
                            "Super Value Tinwald", "Super Value Wanganuik",
                        ],
                    }),
                },
            },
            chains: {
                count: 5,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "New World",
                            "Pak'n Save",
                            "Wools Worth",
                            "The Warehouse",
                            "Fresh Choice",
                            "Super Value",
                        ],
                    }),
                },
            },
            store_products: {
                count: 3000,
                columns: {
                    price: f.number({
                        minValue: 1,
                        maxValue: 20,
                    }),
                },
            },
            category: {
                count: 12,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "Fruit & Veg",
                            "Meat",
                            "Fish",
                            "Deli",
                            "Bakery",
                            "Frozen",
                            "Pantry",
                            "Beer & Wine",
                            "Drinks",
                            "Household",
                            "Baby & Child",
                            "Health & Body",
                        ],
                    }),
                },
            },
            units: {
                count: 3,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            "l",
                            "kg",
                            "ea",
                        ],
                        isUnique: true,
                    }),
                },
            },
            shopping_list: {
                count: 10,
                columns: {
                    amount: f.int({
                        minValue: 1,
                        maxValue: 10,
                    }),
                }
            },
        }))
    } catch (error) {
        console.log("WARNING: found deplicate keys while trying to seed the database. Remove the duplicate keys first. You can reset the database with `reset()` from drizzle-seed.");
    }
}
