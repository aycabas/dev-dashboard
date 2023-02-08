import { Dashboard } from '../lib/Dashboard';
import { OneRow } from "../lib/Dashboard.styles";
import { OpenAI } from '../widgets/OpenAIWidget';
import { GithubIssues } from '../widgets/GitHubWidget';
import { PlannerTask } from '../widgets/PlannerTask';
import { DevOps } from '../widgets/DevOpsWidget';

export default class SampleDashboard extends Dashboard {
  protected rowHeights(): string | undefined {
    return "1fr";
  }

  protected columnWidths(): string | undefined {
    return "6fr 4fr";
  }

  protected dashboardLayout(): undefined | JSX.Element {
    return (
      <>

        <DevOps />
        <GithubIssues />

        <div style={OneRow()}>
          <OpenAI />
          <PlannerTask />
        </div>

      </>
    );
  }
}
