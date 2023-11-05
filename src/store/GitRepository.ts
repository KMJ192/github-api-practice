import { create } from 'zustand';

type State = {
  hasNextPage: boolean;
  lastCursor?: string;
  data: Array<{
    node: {
      name: string;
      description: string;
      stargazerCount: number;
      id: string;
      viewerHasStarred: boolean;
      owner: {
        login: string;
      };
    };
  }>;
};

type Action = {
  setState: (newState: State) => void;
};

export const useGitRepositoryState = create<State & Action>((set) => ({
  hasNextPage: false,
  data: [],
  setState: (newState: State) => set(newState),
}));

export type { State as GitRepositoryState };
