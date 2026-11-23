export type Variant = { size: number; color: string | null; stock: number };
export type Category = "Mujer" | "Hombre" | "Unisex" | "Niños";
export type Product = {
  isNew: boolean;
  id: string;
  name: string;
  brand: string;
  image: string;
  colors: { name: string; image: string }[];
  category: Category | null;
  price: number | null;
  variants: Variant[];
};
export type CartItem = { productId: string; variant: Variant; quantity: number };
