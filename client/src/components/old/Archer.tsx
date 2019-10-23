import React, { useRef, useState } from 'react';
import {
  useApp, Sprite, 
} from '@inlet/react-pixi';
import ArcherImg from '../../assets/png/archer.png';

export const Archer = ({
  setTokenProps,
  parentWidth,
  parentHeight,
  cellSize,
  ...props
}: any) => {
    
    const [dragging, setDragging] = useState(false);
  const archer = useRef();

  function snapToGrid(
    position: any,
    minLength: any,
    maxLength: any,
    cellSize: any,
  ) {
    const fractionalPosition = position / 40;
    const roundedPosition = Math.round(fractionalPosition);
    const decimalPosition = parseFloat((fractionalPosition % 1).toFixed(2));
    const snappedPosition = roundedPosition % 2 === 0
      ? decimalPosition > 0.5
        ? roundedPosition * 40 - 40
        : roundedPosition * 40 + 40
      : roundedPosition * 40;
    if (snappedPosition < minLength) {
      return snappedPosition + Math.abs(snappedPosition) + cellSize / 2;
    }
    if (snappedPosition > maxLength) {
      return maxLength - cellSize / 2;
    }
    return snappedPosition;
  }

  function onDragStart() {
    setDragging(true); 
    setTokenProps({
      ...setTokenProps,
      alpha: 0.5,
    });
  }

  function onDragEnd(archer: any) {
    return (e: any) => {
      const { x, y } = e.data.getLocalPosition(archer.parent);
      const snappedX = snapToGrid(x, 0, parentWidth, cellSize);
      const snappedY = snapToGrid(y, 0, parentHeight, cellSize);
      setDragging(false);
      setTokenProps({
        ...setTokenProps,
        x: snappedX,
        y: snappedY,
        alpha: 1,
      });
    };
  }

  function onDragMove(archer: any) {
    return (e: any) => {
      if (dragging) {
        const { x, y } = e.data.getLocalPosition(archer.parent);
        const snappedX = x;
        const snappedY = y;
        console.log(snappedX, snappedY);
        archer.x = snappedX;
        archer.y = snappedY;
      }
    };
  }

  return (
    <Sprite
      {...props}
      ref={archer}
      interactive
      buttonMode
      mousedown={onDragStart}
      mouseup={onDragEnd(archer.current)}
      mouseupoutside={onDragEnd(archer.current)}
      anchor={0.5}
      mousemove={onDragMove(archer.current)}
      image={ArcherImg}
    />
  );
};
