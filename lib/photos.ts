export type Photo = { src: string; alt: string };

const p = (file: string, alt: string): Photo => ({
  src: `/gallery/${file}`,
  alt,
});

export const PHOTOS = {
  heroMain: p("latte-teal.jpg", "Heart-shaped latte art in a teal cup"),
  heroSmall: p("latte-flower.jpg", "Flower-patterned latte seen from above"),
  about: p("interior-dark.jpg", "Warm pendant lights above the café counter"),
  band: p("brunch-tables.jpg", "Brunch plates and cold drinks on outdoor tables"),
};

// Order matters: strongest photos first
export const GALLERY: Photo[] = [
  p("latte-teal.jpg", "Heart-shaped latte art in a teal cup"),
  p("pancakes.jpg", "Pancakes with berries and honey"),
  p("juice-orange.jpg", "Fresh orange juice with mint"),
  p("tray-cake-sandwich.jpg", "Latte, chocolate cake and grilled sandwiches on a wooden tray"),
  p("latte-flower.jpg", "Flower-patterned latte seen from above"),
  p("espresso-pour.jpg", "Espresso pouring into a cup"),
  p("juice-beet.jpg", "Pink beetroot juice with fresh beetroot"),
  p("sandwich-latte.jpg", "Grilled vegetable sandwich with a latte"),
  p("chicken-lollipop.jpg", "Glazed chicken lollipops with sauce"),
  p("juice-pineapple.jpg", "Pineapple juice with fresh pineapple"),
  p("espresso-yellow.jpg", "A yellow cup of espresso"),
  p("brunch-tables.jpg", "Brunch plates and cold drinks on outdoor tables"),
];