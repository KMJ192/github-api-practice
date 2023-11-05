import React from 'react';
import RemoveStar from './RemoveStar/RemoveStar';
import AddStar from './AddStar/AddStar';

type Props = {
  id: string;
  children: React.ReactNode;
  viewerHasStarred: boolean;
  onLoad: () => void;
};

function GitStarBtn({ id, viewerHasStarred, onLoad, children }: Props) {
  return viewerHasStarred ? (
    <RemoveStar id={id} onLoad={onLoad}>
      {children}
    </RemoveStar>
  ) : (
    <AddStar id={id} onLoad={onLoad}>
      {children}
    </AddStar>
  );
}

export default GitStarBtn;
