import styled from "styled-components";

export const Page = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  padding: 1rem;
  align-items: center;
  flex: 1;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center
  align-items: center;
  border: ${props => (props.bordered ? "1px solid #d9d9d9" : "none")};
  border-radius: 5px;
  flex: 1;
`;

export const VBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center
  align-items: center;
`;
