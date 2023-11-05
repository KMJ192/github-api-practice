import React from 'react';
import { graphql, useMutation } from 'react-relay';
import { AddStarMutation } from '@src/__generated__/AddStarMutation.graphql';

import Button from '@src/components/Button/Button';

import classNames from 'classnames/bind';
import style from './style.module.scss';
import StarIcon from '../StarIcon/StarIcon';
const cx = classNames.bind(style);

type Props = {
  id: string;
  children: React.ReactNode;
  onLoad: () => void;
};

export const requestAddStarMutation = graphql`
  mutation AddStarMutation($starrableId: ID!) {
    addStar(input: { starrableId: $starrableId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

function AddStar({ id, children, onLoad }: Props) {
  const [commit, isInFlight] = useMutation<AddStarMutation>(
    requestAddStarMutation,
  );

  const onClick = () => {
    if (isInFlight) return;
    commit({
      variables: {
        starrableId: id,
      },
      onCompleted: () => {
        onLoad();
      },
    });
  };

  return (
    <Button className={cx('add-star')} onClick={onClick} loading={isInFlight}>
      <StarIcon />
      {children}
    </Button>
  );
}

export default AddStar;
