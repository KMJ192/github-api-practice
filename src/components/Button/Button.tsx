import React from 'react';

import classNames from 'classnames/bind';
import style from './style.module.scss';
const cx = classNames.bind(style);

type Props = {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function Button({ loading, children, className, onClick }: Props) {
  return (
    <button className={cx('button', { loading }, className)} onClick={onClick}>
      {loading ? 'Loading...' : children}
    </button>
  );
}

export default Button;
