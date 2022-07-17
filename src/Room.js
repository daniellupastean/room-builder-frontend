import styled from 'styled-components';
import Desk from './Desk';
import { useRef, useState } from 'react';
import * as svgToPngConverter from 'save-svg-as-png';
import { colors } from './utils/colors.js';

const meter = '100px';

export default function Room() {
  // refs
  const deskWidthInput = useRef(null);
  const deskHeightInput = useRef(null);

  const roomWidthInput = useRef(null);
  const roomHeightInput = useRef(null);

  // states
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [roomSize, setRoomSize] = useState({
    width: 4,
    height: 4,
  });
  const [desks, setDesks] = useState([]); /// if a layout already exists get the desks data from DB

  // event handlers
  const handleSetRoomSize = () => {
    if (desks.length === 0)
      setRoomSize({
        width: roomWidthInput?.current?.valueAsNumber || 8,
        height: roomHeightInput?.current?.valueAsNumber || 6,
      });
  };
  const handleGenerate = () => {
    const nextId = desks[desks.length - 1]?.id + 1 || 1;
    const deskWidth = deskWidthInput?.current?.valueAsNumber || 1;
    const deskHeight = deskHeightInput?.current?.valueAsNumber || 1;
    if (
      isAnySpaceLeftFor(deskWidth * deskHeight) &&
      itFitsInTheRoom(deskWidth, deskHeight)
    )
      setDesks((desks) => [
        ...desks,
        {
          width: deskWidth,
          height: deskHeight,
          id: nextId,
          x: (roomSize.width * 100) / 2 - (deskWidth * 100) / 2,
          y: (roomSize.height * 100) / 2 - (deskHeight * 100) / 2,
          status: 'free', // unusable, occupied,
          isSelected: false,
          assigneeName: null,
        },
      ]);
  };
  const handleDeleteDesk = (id) => {
    const newDesks = desks.filter((item) => item.id !== id);
    setDesks(newDesks);
    setSelectedDesk(null);
  };
  const handleRotateDesk = (id) => {
    desks.forEach((desk) => {
      if (desk.id === id)
        if (itFitsInTheRoom(desk.height, desk.width)) {
          const aux = desk.width;
          desk.width = desk.height;
          desk.height = aux;
        }
      setDesks([...desks]);
    });
  };
  const handleDeleteAll = () => {
    setDesks([]);
    setSelectedDesk(null);
  };
  const handleSelectDesk = (id) => {
    desks.forEach((desk) => {
      if (desk.isSelected && desk.id !== id) {
        desk.isSelected = false;
      }
      if (desk.id === id) {
        desk.isSelected = true;
        setSelectedDesk({ ...desk });
      }
    });

    setDesks([...desks]);
  };
  const handleOutsideClick = (e) => {
    if (e?.target?.id === 'svg-room' && selectedDesk !== null) {
      setSelectedDesk(null);

      desks.forEach((desk) => {
        if (desk.isSelected) {
          desk.isSelected = false;
        }
      });
      setDesks([...desks]);
    }
  };
  const handleSetStatus = (status) => {
    desks.forEach((desk) => {
      if (desk.id === selectedDesk.id) {
        desk.status = status;
      }
      setDesks([...desks]);
    });
  };
  const handleSaveImage = () => {
    const imageOptions = {
      scale: 5,
      encoderOptions: 1,
      backgroundColor: 'white',
    };
    svgToPngConverter.saveSvgAsPng(
      document.getElementById('svg-room'),
      'room.png',
      imageOptions
    );
  };

  // utility functions
  const isAnySpaceLeftFor = (deskSurface) => {
    const totalSpace = roomSize.width * roomSize.height;
    const currentDesksSurface = desks.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.width * currentValue.height,
      0
    );

    return totalSpace - currentDesksSurface - deskSurface >= totalSpace / 2
      ? true
      : false;
  };
  const itFitsInTheRoom = (deskWidth, deskHeight) => {
    if (roomSize.width < deskWidth || roomSize.height < deskHeight)
      return false;
    return true;
  };

  return (
    <>
      <Controllers>
        <Label>Room Length / Width</Label>
        <SizeWrapper>
          <NumberInput type='number' ref={roomWidthInput} />
          <NumberInput type='number' ref={roomHeightInput} />
        </SizeWrapper>
        <Button
          disabled={!desks.length ? false : true}
          onClick={handleSetRoomSize}
          color={colors.button.primary}
        >
          Set Room Size
        </Button>
        <Label>Desk Length / Width</Label>
        <SizeWrapper>
          <NumberInput type='number' ref={deskWidthInput} />
          <NumberInput type='number' ref={deskHeightInput} />
        </SizeWrapper>
        <Button onClick={handleGenerate} color={colors.button.primary}>
          Generate
        </Button>
        <Button
          disabled={!selectedDesk || selectedDesk.assigneeName ? true : false}
          onClick={() => handleDeleteDesk(selectedDesk.id)}
          color={colors.button.delete}
        >
          Delete
        </Button>
        <Button
          disabled={desks.length ? false : true}
          onClick={handleDeleteAll}
          color={colors.button.delete}
        >
          Delete All
        </Button>
        <Button
          disabled={!selectedDesk || selectedDesk.assigneeName ? true : false}
          onClick={() =>
            handleSetStatus(
              selectedDesk?.status === 'unusable' ? 'free' : 'unusable'
            )
          }
          color={colors.button.primary}
        >
          Make {selectedDesk?.status === 'unusable' ? 'Usable' : 'Unusable'}
        </Button>
        <Button onClick={handleSaveImage} color={colors.button.primary}>
          Download
        </Button>
      </Controllers>
      <RoomContainer width={roomSize.width} height={roomSize.height}>
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${roomSize.width * 100} ${roomSize.height * 100}`}
          onClick={handleOutsideClick}
          id='svg-room'
        >
          {desks.map((desk, index) => (
            <Desk
              width={desk.width}
              height={desk.height}
              roomWidth={roomSize.width}
              roomHeight={roomSize.height}
              x={desk.x}
              y={desk.y}
              key={desk.id}
              id={desk.id}
              deleteDesk={() => handleDeleteDesk(desk.id)}
              rotateDesk={() => handleRotateDesk(desk.id)}
              setSelectedDesk={() => handleSelectDesk(desk.id)}
              status={desk.status}
              isSelected={desk.isSelected}
              assigneeName={desk.assigneeName}
            ></Desk>
          ))}
        </svg>
      </RoomContainer>
    </>
  );
}

const RoomContainer = styled.div`
  width: calc(${meter} * ${({ width }) => width});
  aspect-ratio: ${({ width }) => width} / ${({ height }) => height};
  background: white;
  border-radius: 8px;
  box-sizing: content-box;
  padding: 10px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  margin-left: 20px;
`;

const Button = styled.button`
  background: ${(props) => props.color};
  border: none;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  width: 130px;
  color: white;
  cursor: pointer;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.8;
  }
  &:disabled,
  &[disabled] {
    opacity: 0.5;
    color: white;
    cursor: default;
    &:hover {
      background: ${(props) => props.color};
    }
  }
`;

const Controllers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
  width: 200px;
  user-select: none;

  border-radius: 8px;
  padding: 20px;
  /* box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1); */
`;

const NumberInput = styled.input`
  width: 60px;
  padding: 5px 10px;
  border-radius: 8px;
  border: none;
  height: 30px;
  margin-bottom: 10px;
  background: white;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: #292929 solid 1px;
    /* border: 1px solid #292929; */
  }
`;

const SizeWrapper = styled.div`
  display: flex;
  width: 130px;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 13px;
  color: #292929;
  font-weight: 500;
  padding: 2px 0 10px 0;
`;
