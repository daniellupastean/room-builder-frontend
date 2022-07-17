import styled, { createGlobalStyle } from 'styled-components';
import Room from './Room';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #f8f8f8;
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }
  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  svg text{
    user-select: none;
  }

  button{
    user-select: none;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
    text-align: center;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Room />
      </AppContainer>
    </>
  );
}

export default App;
