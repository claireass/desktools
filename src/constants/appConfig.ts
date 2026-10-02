export const updateChannels = ["stable"] as const;

export type UpdateChannel = (typeof updateChannels)[number];

export const appConfig = {
  name: "DeskTools",
  version: __APP_VERSION__,
  repositoryOwner: "claireass",
  repositoryName: "desktools",
  updateChannel: "stable",
} as const satisfies {
  name: string;
  version: string;
  repositoryOwner: string;
  repositoryName: string;
  updateChannel: UpdateChannel;
};
