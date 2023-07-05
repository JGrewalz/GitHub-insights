import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FetchGitMetricsDefinition } from "../functions/fetch_git_metrics.ts";

const GitInsightsWorkflow = DefineWorkflow({
  callback_id: "get_gitinsights",
  title: "Get GitInsight",
  description: "Get past 24hrs Git Insight metrics",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      /*  owner: {
        type: Schema.types.string,
        description: "Owner of the GitHub repository",
      },
      repo: {
        type: Schema.types.string,
        description: "Name of the GitHub repository",
      },*/
    },
    required: ["interactivity"],
  },
});

const inputForm = GitInsightsWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Repo details",
    interactivity: GitInsightsWorkflow.inputs.interactivity,
    submit_label: "Submit Info",
    fields: {
      elements: [{
        name: "owner",
        title: "Owner of the repo",
        type: Schema.types.string,
      }, {
        name: "repo",
        title: "Repo name",
        type: Schema.types.string,
        long: true,
      }],
      required: ["owner", "repo"],
    },
  },
);

const gitInsights = GitInsightsWorkflow.addStep(FetchGitMetricsDefinition, {
  owner: inputForm.outputs.fields.owner,
  repo: inputForm.outputs.fields.repo,
});

console.log(gitInsights.outputs.pageViewStatsCount);
console.log(gitInsights.outputs.cloneCount);
console.log(gitInsights.outputs.lastUpdated);

export default GitInsightsWorkflow;
