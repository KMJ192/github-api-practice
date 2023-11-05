import { useEffect } from 'react';
import { type PreloadedQuery, graphql, usePreloadedQuery } from 'react-relay';
import { RequestGitRepoNodeQuery } from '@src/__generated__/RequestGitRepoNodeQuery.graphql';
import { useGitRepositoryState } from '@src/store/GitRepository';
import { deepCopy } from '@src/utils/utils';

type Props = {
  queryRef: PreloadedQuery<RequestGitRepoNodeQuery>;
  curClickIdx: number;
};

export const getGitRepoNodeQuery = graphql`
  query RequestGitRepoNodeQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazerCount
      viewerHasStarred
    }
  }
`;

function RequestGitRepoNode({ queryRef, curClickIdx }: Props) {
  const data = usePreloadedQuery<RequestGitRepoNodeQuery>(
    getGitRepoNodeQuery,
    queryRef,
  );
  const { data: prevData, setState, ...state } = useGitRepositoryState();

  useEffect(() => {
    if (
      curClickIdx === -1 ||
      typeof data.repository?.viewerHasStarred !== 'boolean' ||
      typeof data.repository.stargazerCount !== 'number'
    ) {
      return;
    }

    const newData = deepCopy(prevData);
    newData[curClickIdx].node.viewerHasStarred =
      data.repository.viewerHasStarred;
    newData[curClickIdx].node.stargazerCount = data.repository.stargazerCount;

    setState({
      ...state,
      data: newData,
    });
  }, [data]);

  return <></>;
}

export default RequestGitRepoNode;
