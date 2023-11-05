import { useEffect } from 'react';
import { type PreloadedQuery, usePreloadedQuery, graphql } from 'react-relay';

import {
  useGitRepositoryState,
  type GitRepositoryState,
} from '@src/store/GitRepository';
import { RequestGitRepoListQuery } from '@src/__generated__/RequestGitRepoListQuery.graphql';

export const getGitRepoListQuery = graphql`
  query RequestGitRepoListQuery($query: String!, $after: String) {
    search(query: $query, type: REPOSITORY, after: $after, first: 10) {
      edges {
        cursor
        node {
          ... on Repository {
            name
            description
            stargazerCount
            id
            viewerHasStarred
            owner {
              login
            }
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
  queryRef: PreloadedQuery<RequestGitRepoListQuery>;
  clickType: 'init' | 'more';
};

function RequestGitRepoList({ queryRef, clickType }: Props) {
  const data = usePreloadedQuery(getGitRepoListQuery, queryRef);
  const { setState, ...state } = useGitRepositoryState();

  useEffect(() => {
    if (Array.isArray(data.search.edges)) {
      const { hasNextPage } = data.search.pageInfo;
      let newState: GitRepositoryState = {
        hasNextPage,
        data:
          clickType === 'init'
            ? data.search.edges
            : state.data.concat(data.search.edges),
      };

      if (hasNextPage) {
        newState.lastCursor =
          data.search.edges[data.search.edges.length - 1].cursor;
      }
      setState(newState);
    }
  }, [data]);

  return <></>;
}

export default RequestGitRepoList;
