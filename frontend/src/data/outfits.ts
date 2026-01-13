export interface Outfit {
    id: string;
    name: string;
    category: "Tops" | "Dresses" | "Jackets" | "Skirts";
    price: number;
    image: string;
}

export const outfits: Outfit[] = [
    {
        id: "1",
        name: "Red Floral Summer Dress",
        category: "Dresses",
        price: 49.99,
        image: "/outfits/red_floral_dress.png",
    },
    {
        id: "2",
        name: "Classic Denim Jacket",
        category: "Jackets",
        price: 89.99,
        image: "/outfits/blue_denim_jacket.png",
    },
    {
        id: "3",
        name: "Elegant White Silk Blouse",
        category: "Tops",
        price: 59.99,
        image: "/outfits/white_blouse.png",
    },
    {
        id: "4",
        name: "Black Pleated Midi Skirt",
        category: "Skirts",
        price: 39.99,
        image: "/outfits/black_skirt.png",
    },
    {
        id: "5",
        name: "Evening Red Cocktail Dress",
        category: "Dresses",
        price: 129.99,
        image: "/outfits/red_floral_dress.png", // Reused image for demo
    },
    {
        id: "6",
        name: "Distressed Denim Jacket",
        category: "Jackets",
        price: 79.99,
        image: "/outfits/blue_denim_jacket.png", // Reused image
    },
    {
        id: "7",
        name: "Office White Shirt",
        category: "Tops",
        price: 45.00,
        image: "/outfits/white_blouse.png", // Reused image
    },
    {
        id: "8",
        name: "Formal Black Skirt",
        category: "Skirts",
        price: 55.00,
        image: "/outfits/black_skirt.png", // Reused image
    },
];
