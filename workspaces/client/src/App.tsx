import React, { FC } from 'react';
import Background from './components/Background/Background';

const App: FC = () => {
  return (
    <>
      <Background>
        <div className="p-4">
          <h1 className="text-3xl">Hello World!</h1>
        </div>
      </Background>
    </>
  );
};

export default App;
