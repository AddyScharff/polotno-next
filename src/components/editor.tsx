import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Workspace } from 'polotno/canvas/workspace';
import createStore from 'polotno/model/store';
import { PagesTimeline } from 'polotno/pages-timeline';
import { SidePanel } from 'polotno/side-panel';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { initJSON } from './store (1)';
import { json as exampleInputJson } from "./exampleinput";
import { modifyJsonData } from '@/tools/makeJSON';
import { useState } from 'react';
import Modal from 'react-modal';

const store = createStore({
  key: 'bMKRa2LQNcHLQklRsAoU', // you can create it here: https://polotno.com/cabinet/
  showCredit: true,
});

store.addPage();

// const modifiedJson = modifyJsonData(predefinedJson, exampleInputJson);
// console.log(modifiedJson);
console.log(modifyJsonData(initJSON, exampleInputJson));
store.loadJSON(modifyJsonData(initJSON, exampleInputJson));

export const Editor = () => {
  const exportJSON = () => {
    const json = store.toJSON();
    const jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'store.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: 'absolute', width: '71vw', height: '100vh' }}>
      <button onClick={exportJSON} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        Export JSON
      </button>
      <PolotnoContainer>
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} downloadButtonEnabled />
          <Workspace store={store} />
          <ZoomButtons store={store} />
          <PagesTimeline store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default Editor;
