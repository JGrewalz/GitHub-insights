import { Manifest } from "deno-slack-sdk/mod.ts";
import GitInsightsWorkflow from "./workflows/git_insights_workflow.ts";
import { FetchGitMetricsDefinition } from "./functions/fetch_git_metrics.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "heuristic-bat-775",
  description: "A workflow to get GitHib insights for Slack samples",
  icon: "assets/default_new_app_icon.png",
  workflows: [GitInsightsWorkflow],
  functions: [FetchGitMetricsDefinition],
  outgoingDomains: ["api.github.com"],
  //datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
