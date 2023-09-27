import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const createProduct: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    context.bindings.productDocument = JSON.stringify(req?.body);

    context.res = {
        status: 200,
        body: "Ok"
    };
};

export default createProduct;