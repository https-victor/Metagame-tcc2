import React, { useRef, useState } from 'react';
import { Sprite } from '@inlet/react-pixi';
import ArcherImg from '../../assets/png/archer.png';

export const Token = ({
  onTokenChange,
  tokenProps,
  parentWidth,
  parentHeight,
  ...props
}: any) => {
  const [dragging, setDragging] = useState(false);
  const archer = useRef();
  const { scale, _id, ...restProps } = tokenProps;
  const cellSize = 80 * scale;
  
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
    onTokenChange(_id, {
      ...tokenProps,
      alpha: 0.5,
    });
  }

  function onDragEnd(archer: any) {
    return (e: any) => {
      const { x, y } = e.data.getLocalPosition(archer.parent);
      const snappedX = snapToGrid(x, 0, parentWidth, cellSize);
      const snappedY = snapToGrid(y, 0, parentHeight, cellSize);
      setDragging(false);
      onTokenChange(_id, {
        ...tokenProps,
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
        archer.x = x;
        archer.y = y;
      }
    };
  }

  return (
    <Sprite
      {...props}
      {...restProps}
      width={80 * scale}
      height={80 * scale}
      cellSize={cellSize}
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
