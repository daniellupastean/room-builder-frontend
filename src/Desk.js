import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from './utils/colors';

const meter = 100;

const colorOf = colors.desk;

const DeskContainer = styled.g`
  cursor: ${({ isClicked }) => (isClicked ? 'grabbing' : 'grab')};

  rect {
    stroke-width: 1;
    stroke: #c2c2c2;
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.1));
  }

  .deskName {
    fill: #292929;
  }

  .assigneeName {
    font-size: 12px;
    fill: #292929;
  }
`;

const Desk = ({
  width,
  height,
  roomWidth,
  roomHeight,
  x,
  y,
  id,
  status,
  isSelected,
  assigneeName,
  // functions
  rotateDesk,
  setSelectedDesk,
}) => {
  const [position, setPosition] = useState({
    x: x,
    y: y,
    active: false,
    offset: {},
  });

  const handlePointerDown = (e) => {
    setSelectedDesk();
    const el = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    el.setPointerCapture(e.pointerId);
    setPosition({
      ...position,
      active: true,
      offset: {
        x,
        y,
      },
    });
  };
  const handlePointerMove = (e) => {
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    if (position.active && position.x >= 0 && position.y >= 0) {
      setPosition({
        ...position,
        x:
          position.x - (position.offset.x - x) >= 1 &&
          position.x - (position.offset.x - x) <=
            roomWidth * 100 - width * 100 - 1
            ? position.x - (position.offset.x - x)
            : position.x,
        y:
          position.y - (position.offset.y - y) >= 1 &&
          position.y - (position.offset.y - y) <=
            roomHeight * 100 - height * 100 - 1
            ? position.y - (position.offset.y - y)
            : position.y,
      });
    }
  };
  const handlePointerUp = (e) => {
    setPosition({
      ...position,
      active: false,
    });
  };

  return (
    <DeskContainer isClicked={position.active}>
      <rect
        id={id}
        x={position.x}
        y={position.y}
        width={`${width * meter}`}
        height={`${height * meter}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        fill={colorOf[status]}
        style={{ fillOpacity: `${isSelected ? '0.5' : '1'}` }}
        onDoubleClick={rotateDesk}
        rx='8'
        ry='8'
      ></rect>
      <text
        className='deskName'
        id={id}
        fontFamily='Arial'
        fontSize='16'
        x={position.x + (width * 100) / 2}
        y={position.y + (height * 100) / 2 - (assigneeName ? 10 : 0)}
        width={`${width * meter}`}
        height={`${height * meter}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onDoubleClick={rotateDesk}
        fill='black'
        textAnchor='middle'
      >
        D-{id}
      </text>
      <text
        className='assigneeName'
        id={id}
        fontFamily='Arial'
        fontSize='16'
        x={position.x + (width * 100) / 2}
        y={position.y + (height * 100) / 2 + (assigneeName ? 10 : 0)}
        width={`${width * meter}`}
        height={`${height * meter}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        fill='black'
        textAnchor='middle'
      >
        {assigneeName}
      </text>
    </DeskContainer>
  );
};

export default Desk;
