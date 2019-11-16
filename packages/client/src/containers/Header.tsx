import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';

const HeaderContainer = styled.div`
  background: #272844;
  color: #fff;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Typography.Title style={{ marginBottom: 0, color: '#fff' }}>
        Formable
      </Typography.Title>
    </HeaderContainer>
  );
};

export default Header;
