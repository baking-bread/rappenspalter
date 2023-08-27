type Quantity = {
    value: number;
    unit: Unit;
}

export enum Unit {
    GRAM = "g",
    MILLILITER = "ml",
    PIECE = "piece",
    PERCENT = "%",
    KCAL = "kcal",
}

export default Quantity;