import React from 'react';
import { Container, Graphics, useApp } from '@inlet/react-pixi';

export const Grid = ({
  x, y, cellSize, parentWidth, parentHeight, 
}: any) => {

  console.log(parentWidth,parentHeight, cellSize)
  const numberOfCols = Math.floor(parentWidth / cellSize);
  const numberOfRows = Math.floor(parentHeight / cellSize);
  function drawGrid(g: any) {
    g.lineStyle(1, 0x000000, 0.5);
    let currentWidth = 0;
    let currentHeight = 0;
    // console.log('teste')
    for (let columns = 0; columns < numberOfCols; columns++) {
      g.moveTo(currentWidth + cellSize, currentHeight);
      g.lineTo(currentWidth + cellSize, parentHeight);
      currentWidth += cellSize;
    }
    currentWidth = 0;
    for (let rows = 0; rows < numberOfRows; rows++) {
      g.moveTo(currentWidth, currentHeight + cellSize);
      g.lineTo(parentWidth, currentHeight + cellSize);
      currentHeight += cellSize;
    }
  }
  return (
    <Container
      interactiveChildren
      x={x}
      y={y}
      width={parentWidth}
      height={parentHeight}
    >
      <Graphics draw={(g: any) => drawGrid(g)} />
    </Container>
  );
};
