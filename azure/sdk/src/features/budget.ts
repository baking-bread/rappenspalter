import Feature from "./feature";

export default interface ConsumptionBudget extends Feature {

    ok(): Promise<boolean>;

}