import React, { useContext } from 'react';
import { Button } from 'antd';
import pigeonMage from '../../assets/png/pigeon-mage-orange.png';
import pigeonBard from '../../assets/png/pigeon-bard-purple.png';
import { AppContext } from '../../hooks/contexts';

export const Welcome = () => {
  const { history } = useContext<any>(AppContext);
  return (
    <div className="landing-page-container page-container">
      <div className="hero-image">
        <img src={pigeonMage} alt="" width={250} />
        <div className="hero-text-container">
          <div className="hero-text signup">
            <p>Pronto para começar sua nova aventura?</p>
            <h1>Role seus Dados!</h1>
          </div>
          <Button type="primary" onClick={() => history.push('/signup')}>
            Criar conta grátis
          </Button>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-text info">
          <h2>Descubra o mundo mágico de interpretação!</h2>
          <p>
            <em className="strong">Metagame </em>
            é uma nova experiência em jogos de tabuleiro. Reúna seus amigos ou faça novos e comece uma nova campanha, é grátis!
          </p>
        </div>
        <img src={pigeonBard} alt="" width={250} />
      </div>
    </div>
  );
};
