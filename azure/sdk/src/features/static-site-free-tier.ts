import { WebSiteManagementClient, StaticSiteARMResource } from "@azure/arm-appservice";
import { getClient } from "../clients/credentials";
import ConsumptionBasedFeature from "./consumption-based-feature";

const STATIC_SITE_ENVELOPE: StaticSiteARMResource = {
    location: 'westeurope',
    sku: { name: 'Free', tier: 'Free' },
    repositoryUrl: 'https://github.com/baking-bread/rappenspalter',
    branch: 'main',
    stagingEnvironmentPolicy: 'Enabled',
    allowConfigFileUpdates: true,
    provider: 'GitHub',
    enterpriseGradeCdnStatus: 'Disabled',
}

export default class StaticSiteFreeTier extends ConsumptionBasedFeature {

    public readonly client: WebSiteManagementClient = getClient(WebSiteManagementClient);

    configure(): Promise<any> {
        return this.client.staticSites.beginCreateOrUpdateStaticSiteAndWait(this.group, this.name, {
            ...STATIC_SITE_ENVELOPE,
            location: this.location,
            tags: this.tags,
        }).then(() => {
            console.log(`Static site ${this.name} created. Waiting for deployment to finish...`);
        });
    }

    ready(): Promise<boolean> {
        return this.client.staticSites.getStaticSite(this.group, this.name).then(() => true).catch(() => false);
    }

    destroy(): Promise<any> {
        return this.client.staticSites.beginDeleteStaticSiteAndWait(this.group, this.name);
    }
}