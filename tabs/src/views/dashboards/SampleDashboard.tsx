import { Dashboard } from '../lib/Dashboard';
import { oneColumn } from "../lib/Dashboard.styles";
import { OpenAI } from '../widgets/OpenAIWidget';
import { GithubIssues } from '../widgets/GitHubWidget';
import { PlannerTask } from '../widgets/PlannerTask';
import { DevOps } from '../widgets/DevOpsWidget';

export default class SampleDashboard extends Dashboard {
  protected rowHeights(): string | undefined {
    return "1fr";
  }

  protected columnWidths(): string | undefined {
    return "4fr 6fr";
  }

  protected dashboardLayout(): undefined | JSX.Element {
    return (
      <>
        <OpenAI />
        <div style={oneColumn()}>
          <DevOps />
          <GithubIssues />
          <PlannerTask />
        </div>

      </>
    );
  }
}
