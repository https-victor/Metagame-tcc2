import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../hooks/contexts';
import { getImgSrc } from '../../utils/functions';
import { Avatar } from 'antd';
import { useRequest } from '../../hooks/providers/useRequest';
import { Link } from 'react-router-dom';

export const MyProfile = () => {
  const { auth, history } = useContext<any>(AppContext);
  const { user } = auth;
  const fullUser = useRequest({});
  useEffect(() => {
    fullUser.onSync({ path: `users/${user._id}`, method: 'GET' });
  }, [user]);
  return (
    <div>
      <Avatar
        icon={user.img ? undefined : 'user'}
        src={user.img ? getImgSrc(user.img) : undefined}
      />
      <span>
        {user.name}
      </span>
      <div><span>Usuário desde:</span><span>{user.registerDate}</span></div>
      <div><span>Campanhas mestradas:</span>{fullUser.data.myGames&&fullUser.data.myGames.map((game:any)=><Link to={`/campanhas/${game._id}`}>{game.name}</Link>)}</div>
      <div><span>Campanhas inscritas:</span>{fullUser.data.otherGames&&fullUser.data.otherGames.map((game:any)=>game._id)}</div>
    </div>
  );
};
