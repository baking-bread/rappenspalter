import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

export function getCredentials() {
    let credentials;
    const tenantId = process.env["AZURE_TENANT_ID"];
    const clientId = process.env["AZURE_CLIENT_ID"];
    const secret = process.env["AZURE_CLIENT_SECRET"];

    if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
        // production
        credentials = new DefaultAzureCredential();
    } else {
        // development
        if (tenantId && clientId && secret) {
            console.log("development");
            credentials = new ClientSecretCredential(tenantId, clientId, secret);
        } else {
            credentials = new DefaultAzureCredential();
        }
    }
    return credentials;
}

export function getClient<T>(clientClass: new (credentials: any, subscriptionId: string) => T): T {
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    const credentials = getCredentials();

    if (!subscriptionId) {
        throw new Error("AZURE_SUBSCRIPTION_ID is not set");
    }

    return new clientClass(credentials, subscriptionId);
}