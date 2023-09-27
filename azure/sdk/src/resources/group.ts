import { ResourceManagementClient } from "@azure/arm-resources";
import { getCredentials } from "../clients/credentials";

export default function createResourceGroup() {
    const client = getClient();

    return client.resourceGroups.createOrUpdate('i-choufe', {
        location: 'switzerlandnorth',
        tags: {
            'i-choufe': 'true'
        }
    });
}

function getClient(): ResourceManagementClient {
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    const credentials = getCredentials();

    if (!subscriptionId) {
        throw new Error("AZURE_SUBSCRIPTION_ID is not set");
    }

    return new ResourceManagementClient(credentials, subscriptionId);
}