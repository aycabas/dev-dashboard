import { createMicrosoftGraphClientWithCredential, TeamsUserCredential } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { TaskModel } from "../models/plannerTaskModel";
import { TeamsUserCredentialContext } from "../internal/singletonContext";

export async function getTasks(): Promise<TaskModel[]> {
    let credential: TeamsUserCredential;
    try {
        credential = TeamsUserCredentialContext.getInstance().getCredential();
        const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
            "Tasks.ReadWrite",
            "Group.ReadWrite.All",
        ]);
        const resp = await graphClient
            .api(`/planner/plans/wIfl13Xg6UCD_d5irDOTWJgAHcUy/tasks?$top=4`)
            .get();
        const tasksInfo = resp["value"];
        let tasks: TaskModel[] = [];
        for (const obj of tasksInfo) {
            const tmp: TaskModel = {
                id: obj["id"],
                name: obj["title"],
                priority: obj["priority"],
                percentComplete: obj["percentComplete"],
            };
            tasks.push(tmp);
            let plannerTaskDetails = await graphClient
                .api("/planner/tasks/" + tmp.id + "/details")
                .get();
        }
        return tasks;
    } catch (e) {
        throw e;
    }
}

export async function addTask(title: string): Promise<TaskModel[]> {
    try {
        let credential: TeamsUserCredential;
        credential = TeamsUserCredentialContext.getInstance().getCredential();

        const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
            "Tasks.ReadWrite",
            "Group.ReadWrite.All",
        ]);
        const plannerTask = {
            planId: "wIfl13Xg6UCD_d5irDOTWJgAHcUy",
            bucketId: "JH1nQBAMqUSDWcSZapZ745gALtiv",
            title: title,
        };
        await graphClient.api("/planner/tasks").post(plannerTask);
        const tasks = await graphClient
            .api("/planner/plans/wIfl13Xg6UCD_d5irDOTWJgAHcUy/tasks?$top=4")
            .get();
        const tasksInfo = tasks["value"];
        let taskResult: TaskModel[] = [];
        for (const obj of tasksInfo) {
            const tmp: TaskModel = {
                id: obj["id"],
                name: obj["title"],
                priority: obj["priority"],
                percentComplete: obj["percentComplete"],
            };
            taskResult.push(tmp);
        }
        return taskResult;
    } catch (e) {
        throw e;
    }
}

export function openTaskApp() {
    window.open(
        "https://teams.microsoft.com/l/app/0d5c91ee-5be2-4b79-81ed-23e6c4580427?source=app-details-dialog",
        "_blank"
    );
}
