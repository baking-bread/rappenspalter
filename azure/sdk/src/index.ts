import 'dotenv/config'
import { setLogLevel, AzureLogLevel } from "@azure/logger";
import { ResourceGroup, ResourceManagementClient } from "@azure/arm-resources";
import { ConsumptionManagementClient } from "@azure/arm-consumption";
import { getClient } from './clients/credentials';
import { WebSiteManagementClient } from '@azure/arm-appservice';

const GROUP_NAME = 'rappenspalter';
const APP_NAME = 'rappenspalter';
const SWITZERLANDNORTH = 'switzerlandnorth';
const WESTEUROPE = 'westeurope';

function main() {
    const logLevel = process.env["AZURE_LOG_LEVEL"] as AzureLogLevel;
    logLevel && setLogLevel(logLevel);

    const resourceGroupClient = getClient(ResourceManagementClient);
    const consumptionClient = getClient(ConsumptionManagementClient);
    const webSiteClient = getClient(WebSiteManagementClient);


    resourceGroupClient.resourceGroups.createOrUpdate(APP_NAME, {
        location: WESTEUROPE
    }).then((resourceGroup: ResourceGroup) => {

        webSiteClient.staticSites.beginCreateOrUpdateStaticSiteAndWait(GROUP_NAME, APP_NAME, {
            location: WESTEUROPE,
            tags: { 'cost-center': 'basic' },
            sku: { name: 'Free', tier: 'Free' },
            repositoryUrl: 'https://github.com/baking-bread/rappenspalter',
            branch: 'main',
            stagingEnvironmentPolicy: 'Enabled',
            allowConfigFileUpdates: true,
            provider: 'GitHub',
            enterpriseGradeCdnStatus: 'Disabled',
          }).then((result) => {
            console.log(result);
            });

        const firstOfMonth = new Date();
        firstOfMonth.setDate(1);

        consumptionClient.budgets.createOrUpdate(`/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${APP_NAME}`, 'basic', {
            category: 'Cost',
            timeGrain: 'Monthly',
            amount: 10,
            timePeriod: {
                startDate: firstOfMonth,
            },
            filter: {
                tags: {
                    name: "cost-center",
                    values: ["basic"],
                    operator: "In",
                }
            }
        });

    });
}

main()