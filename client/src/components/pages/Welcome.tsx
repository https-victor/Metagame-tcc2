import React from 'react'
import { Button } from 'antd';
import pigeonMage from '../../assets/png/pigeon-mage-orange.png';
import pigeonBard from '../../assets/png/pigeon-bard-purple.png';

export const Welcome = ({push}:any) => {
    return (
        <div className="landing-page-container page-container">
    <div className="hero-image">
      <img src={pigeonMage} alt="" width={250} />
      <div className="hero-text-container">
        <div className="hero-text signup">
          <p>Ready to begin your new adventure?</p>
          <h1>Roll the Dice!</h1>
        </div>
        <Button type="primary" onClick={() => push('/signup')}>
          Create your free account
        </Button>
      </div>
    </div>
    <div className="hero-image">
      <div className="hero-text info">
        <h2>Discover the magical world of role-playing!</h2>
        <p>
          <em className="strong">Metagame </em>
          is a new experience in tabletop gaming. Gather your friends or meet
          new ones and start a campaign, it’s free!
        </p>
      </div>
      <img src={pigeonBard} alt="" width={250} />
    </div>
  </div>
    )
};
