//will be updated Microsoft Graph Search API
import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { DevOpsModel } from "../models/devOpsModel";
import { FxContext } from "../internal/singletonContext";

export async function DevOpsSearch(prompt: string): Promise<DevOpsModel[]> {

    try {
        let teamsfx: TeamsFx;
        teamsfx = FxContext.getInstance().getTeamsFx();
        const graphClient: Client = createMicrosoftGraphClient(teamsfx, ["ExternalItem.Read.All", "Files.Read.All", "Sites.Read.All", "Files.ReadWrite.All", "Sites.ReadWrite.All"]);

        const searchResponse = {
            requests:
                [{
                    entityTypes: ['externalItem'],
                    contentSources: ['/external/connections/AzureDevOpsConnectionID'],
                    query: { queryString: prompt },
                    from: 0,
                    size: 15,
                    fields: [
                        "title",
                        "URL",
                        "WorkItemType"
                    ]
                }]
        };

        const resp = await graphClient.api('/search/query').post(searchResponse);
        const devopsValue = resp["resource"];
        let devopsItems: DevOpsModel[] = [];
        for (const obj of devopsValue) {
            const tmp: DevOpsModel = {
                properties: [
                    {
                        Title: obj["Title"],
                        URL: obj["URL"],
                        WorkItemType: obj["WorkItemType"]
                    }
                ]

            };
            devopsItems.push(tmp);


        }
        return devopsItems;
    } catch (e) {
        throw e;
    }
}

