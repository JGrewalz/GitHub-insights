import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
//import GitInsightsDatastore from "../datastores/git_insights_datastore.ts";
//import { GithubStats } from "../functions/fetch_git_downloads.ts";
//import { getBasicAuthGitHub } from "./get_github_auth.ts";

export const FetchGitMetricsDefinition = DefineFunction({
  callback_id: "fetch_git_metrics",
  title: "Fetch Git Metrics",
  description: "Fetches Git insight metrics for a repository from GitHub",
  source_file: "functions/fetch_git_metrics.ts",
  input_parameters: {
    properties: {
      owner: {
        type: Schema.types.string,
        description: "Owner of the GitHub repository",
      },
      repo: {
        type: Schema.types.string,
        description: "Name of the GitHub repository",
      },
    },
    required: ["owner", "repo"],
  },
  output_parameters: {
    properties: {
      pageViewStatsCount: {
        type: Schema.types.number,
        description: "Number of Page views for the repository",
      },
      cloneCount: {
        type: Schema.types.number,
        description: "Number of clones for the repository",
      },
      lastUpdated: {
        type: Schema.types.string,
        description: "Date and time of the last update",
      },
    },
    required: ["pageViewStatsCount", "cloneCount", "lastUpdated"],
  },
});

export default SlackFunction(
  FetchGitMetricsDefinition,
  async ({ inputs, env }) => {
    const { owner, repo } = inputs;
    const headers = {
      Accept: "application/vnd.github+json",
      //Authorization: "Bearer " + env.GITHUB_TOKEN,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Get the current date and time
    const lastUpdated = new Date().toISOString();

    // Get clone stats
    const cloneStatsUrl =
      `https://api.github.com/repos/${owner}/${repo}/traffic/clones`;
    const cloneStatsResponse = await fetch(cloneStatsUrl, { headers });
    const cloneStatsData = await cloneStatsResponse.json();
    const cloneCount = cloneStatsData.count;
    console.log(
      "Clone Count for repo" + repo + "on" + lastUpdated + " is " + cloneCount,
    );

    //Get page views stats
    const pageViewsStatsUrl =
      `https://api.github.com/repos/${owner}/${repo}/traffic/views`;
    const pageViewsStatsResponse = await fetch(pageViewsStatsUrl, { headers });
    const pageViewsStatsData = await pageViewsStatsResponse.json();
    const pageViewStatsCount = pageViewsStatsData.count;
    console.log(
      "Page views for repo" + repo + "on" + lastUpdated + " is " +
        pageViewStatsCount,
    );

    return {
      outputs: {
        // downloadCount,
        //totalDownloads,
        cloneCount,
        pageViewStatsCount,
        lastUpdated,
      },
    };
  },
);
