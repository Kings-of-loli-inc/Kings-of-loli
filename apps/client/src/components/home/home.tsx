import React, { FC } from 'react';

import type { RouterOutputs } from '../../trpc';

type HomeProperties = {
  users?: RouterOutputs['users']['getAllUsers'];
};

export const Home: FC<HomeProperties> = ({ users }) => {
  return (
    <>
      <div>{users?.map((user) => user.id)}</div>
    </>
  );
};
