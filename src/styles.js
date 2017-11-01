import styled from "styled-components";

export const Page = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: ${props => (props.column ? "column" : "row")};
  justify-content: center;
  min-width: 100%;
  border: ${props => (props.bordered ? "1px solid #d9d9d9" : "none")};
  border-radius: 5px;
  padding: 1em;
  min-height: ${props => (props.svg ? "450px" : "70px")};
  flex: 1;
`;
