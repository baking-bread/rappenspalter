import { ResourceGroup } from "@azure/arm-resources";
import { ConsumptionManagementClient } from "@azure/arm-consumption";
import { getCredentials } from "../clients/credentials";

export default function createBudget(resourceGroup: ResourceGroup) {
    const client = getClient();
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    const today = new Date();
    today.setDate(1);

    return client.budgets.createOrUpdate(`subscriptions/${subscriptionId!}`, 'i-choufe-budget', {
        amount: 5,
        category: 'Cost',
        timeGrain: 'Monthly',
        timePeriod: {
            startDate: today,
        }
    });
}

function getClient() {
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    const credentials = getCredentials();

    if (!subscriptionId) {
        throw new Error("AZURE_SUBSCRIPTION_ID is not set");
    }

    return new ConsumptionManagementClient(credentials, subscriptionId);
}