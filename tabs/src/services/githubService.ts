import { githubIssuesModel } from "../models/githubIssuesModel";
import { Octokit } from "octokit";

export async function getIssues(): Promise<githubIssuesModel[]> {

    const octokit = new Octokit({
        //github personal access token
        auth: ''

    })

    try {
        const resp = await octokit.request('GET /repos/{owner}/{repo}/issues', {
            owner: 'aycabasDemo',
            repo: 'ContosoProject'
        })

        let issues: githubIssuesModel[] = [];
        for (const obj of resp.data) {
            const tmp: githubIssuesModel = {
                state: obj["state"],
                url: obj["html_url"],
                title: obj["title"],
                body: obj["body"]
            };
            issues.push(tmp);
        }
        return issues;
    } catch (e) {
        throw e;
    }
}

export async function createIssue(title: string): Promise<githubIssuesModel[]> {
    const octokit = new Octokit({
        //github personal access token
        auth: ''

    })

    try {

        await octokit.request('POST /repos/{owner}/{repo}/issues', {
            owner: 'aycabasDemo',
            repo: 'ContosoProject',
            title: title
        })

        const resp = await octokit.request('GET /repos/{owner}/{repo}/issues', {
            owner: 'aycabasDemo',
            repo: 'ContosoProject'
        })

        let issues: githubIssuesModel[] = [];
        for (const obj of resp.data) {
            const tmp: githubIssuesModel = {
                state: obj["state"],
                url: obj["html_url"],
                title: obj["title"],
                body: obj["body"]
            };
            issues.push(tmp);
        }
        return issues;
    } catch (e) {
        throw e;
    }
}

