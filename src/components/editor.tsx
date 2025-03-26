import { useState, useEffect } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Workspace } from 'polotno/canvas/workspace';
import createStore, { Store } from 'polotno/model/store';
type StoreType = ReturnType<typeof createStore>;
import { PagesTimeline } from 'polotno/pages-timeline';
import { modifyJsonData } from '@/tools/makeJSON';
import { SidePanel } from 'polotno/side-panel';
import { json as exampleInputJson } from './exampleinput';
import { initJSON as initJSON} from './store (1)';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import styled, { keyframes } from 'styled-components';

// Loading animation component
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

// Type for API response
interface ApiResponse {
  status: 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

export const Editor = () => {
  const [apiState, setApiState] = useState<ApiResponse>({ status: 'loading' });
  const [store, setStore] = useState<StoreType | null>(null);

  useEffect(() => {
    const fetchDataAndInitializeStore = async () => {
      try {
        // 1. Fetch API data
        const apiData = await modifyJsonData(initJSON, exampleInputJson);
        
        // 2. Validate and parse response
        if (!apiData) throw new Error('No data returned from API');
        
        const parsedData = typeof apiData === 'string' 
          ? JSON.parse(apiData) 
          : apiData;

        // 3. Create store only after successful data fetch
        const newStore = createStore({
          key: 'bMKRa2LQNcHLQklRsAoU',
          showCredit: true,
        });

        console.log('Parsed data:', parsedData);
        newStore.loadJSON(parsedData);
        
        // 4. Update state
        setStore(newStore);
        setApiState({ status: 'success', data: parsedData });
      } catch (error) {
        console.error('Initialization error:', error);
        setApiState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    };

    fetchDataAndInitializeStore();
  }, []);

  const exportJSON = () => {
    if (!store) return;
    const json = store.toJSON();
    // Export logic...
  };

  // Render loading state
  if (apiState.status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
        <div>Generating your design...</div>
      </div>
    );
  }

  // Render error state
  if (apiState.status === 'error') {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>Error loading editor</h3>
        <p>{apiState.error}</p>
      </div>
    );
  }

  // Render editor only when store is ready
  return (
    <div style={{ position: 'absolute', width: '71vw', height: '100vh' }}>
      <button onClick={exportJSON} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        Export JSON
      </button>
      <PolotnoContainer>
        <SidePanelWrap>
          <SidePanel store={store!} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store!} downloadButtonEnabled />
          <Workspace store={store!} />
          <ZoomButtons store={store!} />
          <PagesTimeline store={store!} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default Editor;