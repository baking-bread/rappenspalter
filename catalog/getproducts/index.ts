import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const getproducts: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    var documents = context.bindings.productDocuments || [];

    context.res = {
        status: 200,
        body: documents
    };
};

export default getproducts;