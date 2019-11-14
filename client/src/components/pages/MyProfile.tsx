import React, { useContext } from 'react';
import { AppContext } from '../../hooks/contexts';

export const MyProfile = () => {
  const { auth, history } = useContext<any>(AppContext);
  const { user } = auth;
  return (
    <div>
      My profile
      {user.name}
    </div>
  );
};
