export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "Coffee" | "Food" | "Desserts";
  available: boolean;
};

export const menuItems: MenuItem[] = [
  { id: 1, name: "Cappuccino", description: "Espresso with steamed milk and a thick foam.", price: 350, category: "Coffee", available: true },
  { id: 2, name: "Iced Latte", description: "Chilled espresso over milk and ice.", price: 400, category: "Coffee", available: true },
  { id: 3, name: "Kenyan Filter Coffee", description: "Smooth single-origin brew.", price: 300, category: "Coffee", available: true },
  { id: 4, name: "Avocado Toast", description: "Sourdough, smashed avocado, lime and chilli.", price: 650, category: "Food", available: true },
  { id: 5, name: "Chicken Wrap", description: "Grilled chicken, greens and garlic sauce.", price: 700, category: "Food", available: true },
  { id: 6, name: "Veggie Bowl", description: "Seasonal vegetables, grains and tahini.", price: 750, category: "Food", available: false },
  { id: 7, name: "Chocolate Cake", description: "Rich, moist and served warm.", price: 450, category: "Desserts", available: true },
  { id: 8, name: "Fruit Salad", description: "Fresh local fruit with honey.", price: 350, category: "Desserts", available: true },
];