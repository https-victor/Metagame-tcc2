import React, { useRef, useState, Fragment } from 'react';
import { Sprite, Text, Container, Graphics } from '@inlet/react-pixi';
import { TextStyle } from 'pixi.js';


export const Token = ({
  onTokenChange,
  tokenProps,
  parentWidth,
  parentHeight,
  ...props
}: any) => {
  const [dragging, setDragging] = useState(false);
  const tokenRef = useRef();
  const hpRef = useRef<any>();
  const backgroundTextRef = useRef<any>();
  const hpTextRef = useRef<any>();
  const nameRef = useRef<any>();
  const { scale, _id, idx, img,name, hp, ...restProps } = tokenProps;
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
    onTokenChange(_id, idx, {
      ...tokenProps,
      alpha: 0.5,
    },'state');
  }

  function onDragEnd(tokenRef: any) {
    return (e: any) => {
      const { x, y } = e.data.getLocalPosition(tokenRef.parent);
      const snappedX = snapToGrid(x, 0, parentWidth, cellSize);
      const snappedY = snapToGrid(y, 0, parentHeight, cellSize);
      setDragging(false);
      onTokenChange(_id, idx, {
        ...tokenProps,
        x: snappedX,
        y: snappedY,
        alpha: 1,
      });
    };
  }

  function onDragMove(tokenRef: any,nameRef: any, hpRef:any, backgroundTextRef:any,hpTextRef:any) {
    return (e: any) => {
      if (dragging) {
        // console.log(e)
        const { x, y } = e.data.getLocalPosition(tokenRef.parent);
        // onTokenChange(_id, idx, {
        //   ...tokenProps,
        //   x: x,
        //   y: y,
        //   alpha: 1,
        // },'socket');
        tokenRef.x = x;
        tokenRef.y = y;
        hpTextRef.x = x;
        hpTextRef.y = y-50;
        hpRef.alpha = 0;
        backgroundTextRef.alpha = 0;
        nameRef.x = x;
        nameRef.y = y+50;
      }
    };
  }

  return (
    <Container
      // {...restProps}
      alpha={restProps.alpha}
    >
      <Graphics
        ref={hpRef}
        x={0}
        y={0}
        alpha={restProps.alpha}
        draw={g => {
          g.clear();

          g.beginFill(0xffffff, 0.3);
          g.moveTo(restProps.x - 38, restProps.y - 54);
          g.lineStyle(0, 0x0, 1);
          g.drawRect(restProps.x - 38, restProps.y - 53, 78, 8);
          g.endFill();

          g.lineStyle(1, 0x000000, restProps.alpha);
          g.moveTo(restProps.x - 40, restProps.y - 54);
          g.lineTo(restProps.x + 39, restProps.y - 54);
          g.lineTo(restProps.x + 39, restProps.y - 44);
          g.lineTo(restProps.x - 39, restProps.y - 44);
          g.lineTo(restProps.x - 39, restProps.y - 54);

          g.beginFill(0xff3300);
          g.moveTo(restProps.x - 38, restProps.y - 54);
          g.lineStyle(0, 0x0, 1);
          g.drawRect(
            restProps.x - 38,
            restProps.y - 53,
            Math.round((76 * hp) / 100),
            8
          );
          g.endFill();
        }}
      />
      <Text
        ref={hpTextRef}
        text={hp}
        anchor={0.5}
        style={
          new TextStyle({
            align: 'center',
            fontFamily: 'Helvetica, sans-serif',
            fontSize: 12,
            fontWeight: '600'
          })
        }
        x={restProps.x}
        y={restProps.y - 50}
      />
      <Sprite
        {...props}
        {...restProps}
        width={80 * scale}
        height={80 * scale}
        cellSize={cellSize}
        ref={tokenRef}
        interactive
        buttonMode
        mousedown={onDragStart}
        mouseup={onDragEnd(tokenRef.current)}
        mouseupoutside={onDragEnd(tokenRef.current)}
        anchor={0.5}
        mousemove={onDragMove(
          tokenRef.current,
          nameRef.current,
          hpRef.current,
          backgroundTextRef.current,
          hpTextRef.current
        )}
        image={img}
      />
      <Graphics
        ref={backgroundTextRef}
        x={0}
        y={0}
        alpha={0.33}
        draw={g => {
          g.clear();

          g.beginFill(0xffffff);
          g.moveTo(restProps.x - 40, restProps.y + 40);
          g.lineStyle(0, 0x0, 1);
          g.drawRect(restProps.x - 40, restProps.y + 40, 80, 18);
          g.endFill();
        }}
      />
      <Text
        ref={nameRef}
        text={name}
        anchor={0.5}
        style={
          new TextStyle({
            align: 'center',
            fontFamily: 'Helvetica, sans-serif',
            fontSize: 18,
            fontWeight: '520'
          })
        }
        x={restProps.x}
        y={restProps.y + 50}
      />
    </Container>
  );
};
