import React, { useRef, useState } from 'react';

import Button from '@src/components/Button/Button';
import GitStarBtn from './GitStarBtn/GitStarBtn';

// Request API
import RequestGitRepoList from './queryNetwork/RequestGitRepoList/RequestGitRepoList';
import useRequestGitRepoListQuery from './queryNetwork/RequestGitRepoList/hooks/useRequestGitRepoListQuery';
import RequestGitRepoNode from './queryNetwork/RequestGitRepoNode/RequestGitRepoNode';
import useRequestGitRepoNodeQuery from './queryNetwork/RequestGitRepoNode/hooks/useRequestGitRepoNodeQuery';

import { useGitRepositoryState } from '@src/store/GitRepository';

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
  const [value, setValue] = useState('');

  const { data, hasNextPage } = useGitRepositoryState();
  const [curClickIdx, setCurClickIdx] = useState(-1);

  const onSearch = () => {
    if (value === '') {
      return;
    }
    clickType.current = 'init';
    currSearch.current = value;
    initGitRepoListLoadQuery(currSearch.current);
    setCurClickIdx(-1);
  };

  const onSearchMore = () => {
    clickType.current = 'more';
    moreGitRepoListLoadQuery(currSearch.current);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className={cx('container')}>
        <div className={cx('input-box')}>
          <input
            onChange={onChange}
            value={value}
            placeholder='검색할 저장소 이름을 입력해주세요.'
          ></input>
          <Button onClick={onSearch} disabled={value === ''}>
            검색
          </Button>
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
                  <GitStarBtn
                    id={edges.node.id}
                    viewerHasStarred={edges.node.viewerHasStarred}
                    onLoad={() => {
                      gitRepoNodeQueryLoad(
                        edges.node.owner.login,
                        edges.node.name,
                      );
                      setCurClickIdx(idx);
                    }}
                  >
                    {formatNumberToK(edges.node.stargazerCount)}
                  </GitStarBtn>
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
            <Button onClick={onSearchMore}>더보기</Button>
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
