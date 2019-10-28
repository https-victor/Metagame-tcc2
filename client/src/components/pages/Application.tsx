import React, { useState, useEffect, useContext } from 'react';
import { Stage } from '@inlet/react-pixi';
import { Button } from 'antd';
import { Archer } from '../old/Archer';
import { Grid } from '../old/Grid';
import Icosahedron from '../../assets/svg/icosahedron.svg';
import './style/application.css';
import { GameContext } from '../../hooks/contexts/GameContext';

export type TokenProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
};

export const initialTokenProps = {
  x: 40,
  y: 40,
  width: 80,
  height: 80,
  alpha: 1,
};

export const Application = () => {
  const { game } = useContext<any>(GameContext);
  const { closeGame } = game;
  console.log(game);
  console.log(window.innerWidth);
  const [teste, setTeste] = useState(false);

  const [drawer, setDrawer] = useState(false);
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight - 80;

  const [tokenProps, setTokenProps] = useState<TokenProps>(
    initialTokenProps as TokenProps,
  );
  const [tokenProps2, setTokenProps2] = useState<TokenProps>(
    initialTokenProps as TokenProps,
  );
  useEffect(() => {
    setTimeout(() => setTeste(true), 3000);
  }, []);

  function toggleDrawer() {
    setDrawer((oldState: any) => !oldState);
  }

  return (
    <div className={`app-layout ${drawer ? '' : 'hidden'}`}>
      <div className="vt-container">
        <Stage
          className="app"
          width={stageWidth}
          height={stageHeight}
          options={{ backgroundColor: 0xffffff }}
        >
          <Grid
            x={0}
            y={0}
            cellSize={80}
            parentWidth={stageWidth}
            parentHeight={stageHeight}
          />
          <Archer
            {...tokenProps}
            setTokenProps={setTokenProps}
            parentWidth={stageWidth}
            parentHeight={stageHeight}
            cellSize={80}
          />
          {teste && (
            <Archer
              {...tokenProps2}
              setTokenProps={setTokenProps2}
              parentWidth={stageWidth}
              parentHeight={stageHeight}
              cellSize={80}
            />
          )}
        </Stage>
      </div>
      <div className="app-footer">
        <img
          className="menu-btn"
          width={100}
          src={Icosahedron}
          alt="Icosahedron"
        />
        <div className="drawer-btn-container">
          <Button
            type="primary"
            shape="circle"
            icon="logout"
            onClick={closeGame}
          />
          <Button
            type="primary"
            shape="circle"
            icon={drawer ? 'menu-unfold' : 'menu-fold'}
            onClick={toggleDrawer}
          />
        </div>
      </div>
      <div className="app-drawer" />
    </div>
  );
};
