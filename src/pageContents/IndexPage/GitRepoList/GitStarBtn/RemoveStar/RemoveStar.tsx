import React from 'react';
import { graphql, useMutation } from 'react-relay';
import { RemoveStarMutation } from '@src/__generated__/RemoveStarMutation.graphql';
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

const mutation = graphql`
  mutation RemoveStarMutation($starrableId: ID!) {
    removeStar(input: { starrableId: $starrableId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

function RemoveStar({ id, children, onLoad }: Props) {
  const [commit, isInFlight] = useMutation<RemoveStarMutation>(mutation);

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
    <Button
      className={cx('remove-star')}
      onClick={onClick}
      loading={isInFlight}
    >
      <StarIcon selected />
      {children}
    </Button>
  );
}

export default RemoveStar;
