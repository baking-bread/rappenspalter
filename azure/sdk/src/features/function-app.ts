import { WebSiteManagementClient } from "@azure/arm-appservice";
import { getClient } from "../clients/credentials";
import ConsumptionBasedFeature from "./consumption-based-feature";

export default class FunctionApp extends ConsumptionBasedFeature {

    public readonly client: WebSiteManagementClient = getClient(WebSiteManagementClient);

    async configure(): Promise<any> {
        await this.client.appServicePlans.beginCreateOrUpdateAndWait(this.group, `${this.name}-plan`, {
            kind: 'linux',
            location: this.location,
            tags: this.tags,
            reserved: true,
            sku: {
                name: 'Y1',
                tier: 'Dynamic',
            },
        }).then(() => {
            console.log(`App service plan ${this.name}-plan created.`);
        });

        await this.client.webApps.beginCreateOrUpdateAndWait(this.group, this.name, {
            kind: 'functionapp,linux',
            location: this.location,
            tags: this.tags,
            serverFarmId: `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${this.group}/providers/Microsoft.Web/serverfarms/${this.name}-plan`,
            reserved: true,
            siteConfig: {
                numberOfWorkers: 1,
                linuxFxVersion: 'Node|18',
                nodeVersion: '18',
                cors: {
                    allowedOrigins: [
                        "https://portal.azure.com"
                    ]
                },
            },
            containerSize: 1536,
            httpsOnly: true,
            
        }).then(() => {
            console.log(`Function app ${this.name} created. Waiting for deployment to finish...`);
        });

        await this.client.webApps.beginCreateOrUpdateSourceControlAndWait(this.group, `${this.name}`, {
            branch: 'main',
            deploymentRollbackEnabled: true,
            isGitHubAction: true,
            repoUrl: 'https://github.com/baking-bread/rappenspalter',
            gitHubActionConfiguration: {
                isLinux: true,
                generateWorkflowFile: false,
            },
            name: `${this.name}-sourcecontrol`,
        }).then(() => {
            console.log(`Source control for ${this.name} created.`);
        });
    }

    ready(): Promise<boolean> {
        return this.client.webApps.get(this.group, this.name).then(() => true).catch(() => false);
    }

    destroy(): Promise<any> {
        return this.client.webApps.delete(this.group, this.name);
    }
}