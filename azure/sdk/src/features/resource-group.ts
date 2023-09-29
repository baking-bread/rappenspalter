import { getClient } from "../clients/credentials";
import ConsumptionBasedFeature from "./consumption-based-feature";
import { ResourceManagementClient } from "@azure/arm-resources";

export default class ResourceGroup extends ConsumptionBasedFeature {

    public readonly client: ResourceManagementClient = getClient(ResourceManagementClient);

    configure(): Promise<any> {
        return this.client.resourceGroups.createOrUpdate(this.name, {
            location: this.location,
            tags: this.tags, 
        }).then(() => {
            console.log(`Resource group ${this.name} created.`);
        });
    }

    ready(): Promise<boolean> {
        return this.client.resourceGroups.get(this.group).then(() => true).catch(() => false);
    }

    destroy(): Promise<any> {
        return this.client.resourceGroups.beginDeleteAndWait(this.group);
    }
}