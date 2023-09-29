import { Amount, Budget, ConsumptionManagementClient } from "@azure/arm-consumption";
import { getClient } from "../clients/credentials";
import ConsumptionBudget from "./budget";
import { SimpleTagBudget } from "./simple-tag-budget";

export default abstract class ConsumptionBasedFeature {


    public readonly children: ConsumptionBasedFeature[] = [];
    public readonly budget: ConsumptionBudget;

    public constructor(
        public readonly name: string,
        public readonly group: string,
        public readonly location: string,
        public readonly tags?: {[key: string]: string},
        public readonly amount?: number,
    ) {
        const budgetTag = { 'component': this.name };
        this.tags = { ...tags, ...budgetTag };
        this.budget = new SimpleTagBudget(`${name}-budget`, group, location, budgetTag, amount);
    }

    abstract configure(): Promise<any>;
    abstract ready(): Promise<boolean>;
    abstract destroy(): Promise<any>;
    
    public async apply(): Promise<void> {
        // apply the budget
        await this.budget.apply();

        if (!await this.budget.ok()) {
            for (const child of this.children) {
                await child.destroy();
            }

            this.destroy();
            return;
        }


        // apply this feature
        await this.configure();

        // apply children
        for (const child of this.children) {
            await child.apply();
        }
    }
}