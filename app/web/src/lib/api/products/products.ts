export type Product = {
    id: number;
    name: string;
    price: number;
}

export function getProducts(): Product[] {
    return [{
        id: 1,
        name: 'Product 1',
        price: 100
    }, {
        id: 2,
        name: 'Product 2',
        price: 200
    }]
}

export default Product;