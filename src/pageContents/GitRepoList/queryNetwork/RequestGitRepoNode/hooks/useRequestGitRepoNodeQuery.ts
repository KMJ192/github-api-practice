import { RequestGitRepoNodeQuery } from '@src/__generated__/RequestGitRepoNodeQuery.graphql';
import { useQueryLoader } from 'react-relay';
import { getGitRepoNodeQuery } from '../RequestGitRepoNode';

function useRequestGitRepoNodeQuery() {
  const [queryRef, loadQuery] =
    useQueryLoader<RequestGitRepoNodeQuery>(getGitRepoNodeQuery);

  const loadNode = (owner: string, name: string) => {
    loadQuery(
      {
        owner,
        name,
      },
      {
        fetchPolicy: 'network-only',
      },
    );
  };

  return {
    gitRepoNodeQueryRef: queryRef,
    gitRepoNodeQueryLoad: loadNode,
  };
}

export default useRequestGitRepoNodeQuery;
