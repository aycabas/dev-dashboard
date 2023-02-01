//will be updated Microsoft Graph Search API
import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { TaskModel } from "../models/plannerTaskModel";
import { FxContext } from "../internal/singletonContext";

export async function getTasks(): Promise<TaskModel[]> {
    let teamsfx: TeamsFx;
    try {
        teamsfx = FxContext.getInstance().getTeamsFx();
        const graphClient: Client = createMicrosoftGraphClient(teamsfx, ["Tasks.ReadWrite", "Group.ReadWrite.All"]);
        const resp = await graphClient.api(`/planner/plans/wIfl13Xg6UCD_d5irDOTWJgAHcUy/tasks`).get();
        const tasksInfo = resp["value"];
        let tasks: TaskModel[] = [];
        for (const obj of tasksInfo) {
            const tmp: TaskModel = {
                id: obj["id"],
                name: obj["title"],
                priority: obj["priority"],
                percentComplete: obj["percentComplete"]
            };
            tasks.push(tmp);
            let plannerTaskDetails = await graphClient.api('/planner/tasks/' + tmp.id + '/details').get();

        }
        return tasks;
    } catch (e) {
        throw e;
    }
}

