import { Budget, BudgetComparisonExpression, ConsumptionManagementClient } from "@azure/arm-consumption";
import ConsumptionBasedFeature from "./consumption-based-feature";
import ConsumptionBudget from "./budget";
import { getClient } from "../clients/credentials";

export class SimpleTagBudget implements ConsumptionBudget {

    public readonly consumption: ConsumptionManagementClient = getClient(ConsumptionManagementClient);
    private _budget?: Budget;

    constructor(public readonly name: string, public readonly group: string, public readonly location: string, public readonly tags: {[key: string]: string}, public readonly amount?: number) {

        if (!this.amount) {
            console.log(`No budget amount specified for ${this.name}.`);
        }

        if (this.tags && Object.keys(this.tags).length > 1) {
            console.warn("Budgets can only be created for a single tag. Only the first tag will be used.");
        }
    }

    apply(): Promise<void> {
        return this.configure();
    }

    ok(): Promise<boolean> {
        return this.ready().then((ready) => {
            if ((this._budget?.currentSpend?.amount || 0) >= (this._budget?.amount || 0)) {
                return false;
            }

            return ready;
        })
    }

    configure(): Promise<any> {
        if (!this.tags) throw new Error("No tags specified for budget.");

        return this.consumption.budgets.createOrUpdate(`/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${this.group}`, this.name, {
            category: 'Cost',
            timeGrain: 'Monthly',
            amount: this.amount,
            timePeriod: {
                startDate: firstOfMonth(),
            },
            filter: {
                tags: mapTags(this.tags),
            }
        }).then(() => {
            console.log(`Budget ${this.name} created.`);
        });
    }

    ready(): Promise<boolean> {
        return this.consumption.budgets.get(`/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${this.group}`, this.name)
        .then((budget) => {
            this._budget = budget;
            return true;
        })
        .catch(() => false);
    }
    
    destroy(): Promise<any> {
        return this.consumption.budgets.delete(`/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${this.group}`, this.name);
    }
}

function mapTags(tags: {[key: string]: string}): BudgetComparisonExpression  {
    const entries = Object.entries(tags);

    return {
        name: entries[0][0],
        values: [entries[0][1]],
        operator: "In",
    }
}

function firstOfMonth() {
    const date = new Date();
    date.setDate(1);
    return date;
}