/**
 * Cookie Shop - Product Catalog Data
 * Centralized catalog definition for all artisan cookie items.
 */

export const PRODUCTS_DATA = [
  {
    id: "cookie-classic",
    name: "Classic Chocolate",
    shortName: "Classic",
    price: 5.99,
    image: "./assets/img/cookie-1.png",
    alt: "Classic chocolate chip cookie",
    badge: "Best sellers",
    description: "Golden and crispy on the outside, soft on the inside, with generous pieces of melted semi-sweet chocolate.",
    calories: "280 kcal",
    allergens: "Gluten, Dairy, Soy",
  },
  {
    id: "cookie-double-choco",
    name: "Double Chocolate",
    shortName: "Double choco",
    price: 9.99,
    image: "./assets/img/cookie-2.png",
    alt: "Double chocolate cookie with white chocolate chips",
    badge: "Popular",
    description: "A rich, intense cocoa dough with chunks of premium white chocolate that melt on the palate with every bite.",
    calories: "320 kcal",
    allergens: "Gluten, Dairy, Soy",
  },
  {
    id: "cookie-red-velvet",
    name: "Red Velvet",
    shortName: "Red velvet",
    price: 12.99,
    image: "./assets/img/cookie-3.png",
    alt: "Red velvet cookie with white chocolate chips",
    badge: "Favorite",
    description: "Smooth and velvety cocoa dough infused with vanilla, loaded with creamy white chocolate chips for your enjoyment.",
    calories: "310 kcal",
    allergens: "Gluten, Dairy",
  },
  {
    id: "cookie-oats-raisins",
    name: "Oats & Raisins",
    shortName: "Oats and raisins",
    price: 6.99,
    image: "./assets/img/cookie-4.png",
    alt: "Oatmeal raisin cookie",
    badge: "Wholesome",
    description: "Toasted rolled oats combined with plump, juicy raisins and warm cinnamon spice for a comforting homestyle treat.",
    calories: "250 kcal",
    allergens: "Gluten",
  },
  {
    id: "cookie-peanuts",
    name: "Peanut Butter Crunch",
    shortName: "Peanuts",
    price: 4.99,
    image: "./assets/img/cookie-5.png",
    alt: "Peanut butter cookie",
    badge: "Classic",
    description: "Creamy roasted peanut butter folded into tender dough with crispy edges and a melt-in-your-mouth center.",
    calories: "290 kcal",
    allergens: "Peanuts, Dairy, Gluten",
  },
  {
    id: "cookie-white-matcha",
    name: "White Matcha",
    shortName: "White matcha",
    price: 13.99,
    image: "./assets/img/cookie-6.png",
    alt: "White chocolate matcha cookie",
    badge: "Artisan",
    description: "Authentic ceremonial-grade Japanese green matcha dough balanced with sweet, silky Belgian white chocolate chips.",
    calories: "300 kcal",
    allergens: "Gluten, Dairy",
  },
];

/**
 * Find a product by its unique identifier
 * @param {string} id
 * @returns {object|undefined}
 */
export const getProductById = (id) => PRODUCTS_DATA.find((item) => item.id === id);

