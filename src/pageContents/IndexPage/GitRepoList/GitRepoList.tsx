import React, { useRef, useState } from 'react';

import Button from '@src/components/Button/Button';
import { useGitRepositoryState } from '@src/store/GitRepository';

import RemoveStar from './RemoveStar/RemoveStar';
import AddStar from './AddStar/AddStar';

// Request API
import RequestGitRepoList from './queryComponents/RequestGitRepoList/RequestGitRepoList';
import useRequestGitRepoListQuery from './queryComponents/RequestGitRepoList/hooks/useRequestGitRepoListQuery';
import RequestGitRepoNode from './queryComponents/RequestGitRepoNode/RequestGitRepoNode';
import useRequestGitRepoNodeQuery from './queryComponents/RequestGitRepoNode/hooks/useRequestGitRepoNodeQuery';

import { formatNumberToK } from '@src/utils/utils';

import classNames from 'classnames/bind';
import style from './style.module.scss';
const cx = classNames.bind(style);

function GitRepoList() {
  const {
    gitRepoListQueryRef,
    initGitRepoListLoadPending,
    initGitRepoListLoadQuery,
    moreGitRepoListLoadPending,
    moreGitRepoListLoadQuery,
  } = useRequestGitRepoListQuery();

  const { gitRepoNodeQueryRef, gitRepoNodeQueryLoad } =
    useRequestGitRepoNodeQuery();

  const currSearch = useRef<string>('');
  const clickType = useRef<'init' | 'more'>('init');
  const searchRef = useRef<HTMLInputElement>(null);

  const { data, hasNextPage } = useGitRepositoryState();
  const [curClickIdx, setCurClickIdx] = useState(-1);

  const onClickSearch = () => {
    if (!searchRef.current || searchRef.current.value === '') {
      return;
    }
    clickType.current = 'init';
    const search = searchRef.current;
    currSearch.current = search.value;
    search.value = '';
    initGitRepoListLoadQuery(currSearch.current);
    setCurClickIdx(-1);
  };

  const onClickMore = () => {
    clickType.current = 'more';
    moreGitRepoListLoadQuery(currSearch.current);
  };

  return (
    <>
      <div className={cx('container')}>
        <div className={cx('input-box')}>
          <input ref={searchRef}></input>
          <Button onClick={onClickSearch}>검색</Button>
        </div>
        <div className={cx('repo-list')}>
          {!initGitRepoListLoadPending &&
            data.map((edges, idx) => {
              return (
                <div
                  key={`${edges.node.name}-${idx}`}
                  className={cx('repo-info')}
                >
                  <div>이름 : {edges.node.name}</div>
                  <div className={cx('desc')}>
                    설명 : {edges.node.description}
                  </div>
                  {edges.node.viewerHasStarred ? (
                    <RemoveStar
                      id={edges.node.id}
                      owner={edges.node.owner.login}
                      onLoad={() => {
                        gitRepoNodeQueryLoad(
                          edges.node.owner.login,
                          edges.node.name,
                        );
                        setCurClickIdx(idx);
                      }}
                    >
                      Star: {formatNumberToK(edges.node.stargazerCount)}
                    </RemoveStar>
                  ) : (
                    <AddStar
                      id={edges.node.id}
                      onLoad={() => {
                        gitRepoNodeQueryLoad(
                          edges.node.owner.login,
                          edges.node.name,
                        );
                        setCurClickIdx(idx);
                      }}
                    >
                      Star: {formatNumberToK(edges.node.stargazerCount)}
                    </AddStar>
                  )}
                </div>
              );
            })}
        </div>
        {(initGitRepoListLoadPending || moreGitRepoListLoadPending) && (
          <div className={cx('loading')}>Loading...</div>
        )}
        {hasNextPage &&
          !initGitRepoListLoadPending &&
          !moreGitRepoListLoadPending && (
            <Button onClick={onClickMore}>더보기</Button>
          )}
      </div>
      {gitRepoListQueryRef && (
        <RequestGitRepoList
          queryRef={gitRepoListQueryRef}
          clickType={clickType.current}
        />
      )}
      {gitRepoNodeQueryRef && (
        <RequestGitRepoNode
          queryRef={gitRepoNodeQueryRef}
          curClickIdx={curClickIdx}
        />
      )}
    </>
  );
}

export default GitRepoList;
