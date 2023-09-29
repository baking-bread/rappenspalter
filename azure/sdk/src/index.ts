import 'dotenv/config'
import { setLogLevel, AzureLogLevel } from "@azure/logger";
import ResourceGroup from './features/resource-group';
import StaticSiteFreeTier from './features/static-site-free-tier';
import { SimpleTagBudget } from './features/simple-tag-budget';
import FunctionApp from './features/function-app';

const GROUP_NAME = 'rappenspalter';
const APP_NAME = 'rappenspalter';
const SWITZERLANDNORTH = 'switzerlandnorth';
const WESTEUROPE = 'westeurope';

async function main() {
    const logLevel = process.env["AZURE_LOG_LEVEL"] as AzureLogLevel;
    logLevel && setLogLevel(logLevel);

    const group = new ResourceGroup(GROUP_NAME, GROUP_NAME, SWITZERLANDNORTH, undefined, 50);
    const web = new StaticSiteFreeTier("rappenspalter-web", GROUP_NAME, WESTEUROPE, undefined, 10);

    const functions = new FunctionApp("rappenspalter-functions", GROUP_NAME, SWITZERLANDNORTH, undefined, 10);

    group.children.push(web);
    group.children.push(functions);

    await group.apply();
}

main()