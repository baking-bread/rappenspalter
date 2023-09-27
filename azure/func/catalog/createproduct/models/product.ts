import Price from "./price";
import Quantity from "./quantity";

type Product = {
    vendor: string;
    name: string;
    subject_designation: string;
    price: Price;
    quantity: Quantity;
}

export default Product;

/*
type Product = {
    vendor: string;
    name: string;
    labels: string[];
    subject_designation: string;
    nutritional_facts: NutritionFact[] | string[][];
    ingredient_list: Ingredient[] | string[][];
    address: Address | string[] | string;
    country: string;
    ingredient_origin: string[][];
    price: string | Price;
    quantity: Quantity | string;
    categories: string[];
    attributes: string[][];
    tax: number;
    created_at: Date;
    language: string;
}
*/