import 'dotenv/config'
import { setLogLevel, AzureLogLevel } from "@azure/logger";
import createResourceGroup from "./resources/group";
import { ResourceGroup } from "@azure/arm-resources";
import createBudget from "./resources/budget";

function main() {
    const logLevel = process.env["AZURE_LOG_LEVEL"] as AzureLogLevel;
    logLevel && setLogLevel(logLevel);

    createResourceGroup().then((resourceGroup: ResourceGroup) => {
        createBudget(resourceGroup);
    });
}

main()