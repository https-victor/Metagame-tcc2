import React from 'react';
import './styles/gamecard.css';
import { getImgSrc } from '../../utils/functions';

export const GameCard = ({
  data,
  className = '',
  onClick,
  tabIndex = 0,
}: any) => {
  const { name, img } = data;
  return (
    <div
      tabIndex={tabIndex}
      role="button"
      onClick={onClick}
      onKeyDown={onClick}
      className={`card-wrapper ${className} ${img ? '' : 'new'}`}
    >
      <div
        className="card-content"
        style={{
          background: `url(${
            img
              ? getImgSrc(img)
              : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1'
          }) no-repeat center/cover`,
        }}
      />
      <div className="card-footer">
        <span>{name}</span>
      </div>
    </div>
  );
};
