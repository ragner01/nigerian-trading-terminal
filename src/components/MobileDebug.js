import React from 'react';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #00d4aa;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 9999;
  
  @media (max-width: 768px) {
    top: 5px;
    right: 5px;
    font-size: 10px;
    padding: 5px;
  }
`;

const MobileDebug = () => {
  const isMobile = window.innerWidth <= 768;
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  return (
    <DebugContainer>
      <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
      <div>iOS: {isIOS ? 'Yes' : 'No'}</div>
      <div>Android: {isAndroid ? 'Yes' : 'No'}</div>
      <div>Width: {window.innerWidth}px</div>
      <div>Height: {window.innerHeight}px</div>
    </DebugContainer>
  );
};

export default MobileDebug; 