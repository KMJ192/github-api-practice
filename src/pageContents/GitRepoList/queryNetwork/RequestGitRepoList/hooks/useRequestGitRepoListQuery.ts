import { useTransition } from 'react';
import { useQueryLoader, UseQueryLoaderLoadQueryOptions } from 'react-relay';
import { getGitRepoListQuery } from '../RequestGitRepoList';
import {
  RequestGitRepoListQuery,
  RequestGitRepoListQuery$variables,
} from '@src/__generated__/RequestGitRepoListQuery.graphql';
import { useGitRepositoryState } from '@src/store/GitRepository';

function useRequestGitRepoListQuery() {
  const [queryRef, loadQuery] =
    useQueryLoader<RequestGitRepoListQuery>(getGitRepoListQuery);

  const { lastCursor } = useGitRepositoryState();

  const [initLoadPending, startInitLoadPending] = useTransition();
  const [moreLoadPending, startMoreLoadPending] = useTransition();

  const initLoadQuery = (query: string) => {
    const variable: RequestGitRepoListQuery$variables = {
      query,
    };

    startInitLoadPending(() => {
      loadQuery(variable, {
        fetchPolicy: 'network-only',
      });
    });
  };

  const moreLoadQuery = (query: string) => {
    const variable: RequestGitRepoListQuery$variables = {
      query,
      after: lastCursor,
    };
    startMoreLoadPending(() => {
      loadQuery(variable, {
        fetchPolicy: 'network-only',
      });
    });
  };

  return {
    gitRepoListQueryRef: queryRef,
    initGitRepoListLoadPending: initLoadPending,
    moreGitRepoListLoadPending: moreLoadPending,
    initGitRepoListLoadQuery: initLoadQuery,
    moreGitRepoListLoadQuery: moreLoadQuery,
  };
}

export default useRequestGitRepoListQuery;
