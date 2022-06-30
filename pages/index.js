import React from 'react';
import Head from 'next/head';
import Card from '@mui/material/Card';
import FollowSupervisorForm from '../components/FollowSupervisorForm';
import {
  AppContext,
  defaultAppState,
  appStateReducer,
} from '../components/AppContext';

export default function Home() {
  const [state, dispatch] = React.useReducer(appStateReducer, defaultAppState);
  const memoState = React.useMemo(() => [state, dispatch], [state]);
  return (
    <AppContext.Provider value={memoState}>
      <div
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#cfffff',
        }}
      >
        <Head>
          <title>LightFeather Demo: Follow Supervisor</title>
          <meta
            name="description"
            content="This page enables LightFeather users to subscribe to notifications from their supervisor"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Card
            sx={{
              m: 'auto',
              marginTop: 2,
              marginBottom: 2,
              paddingBottom: 2,
              maxWidth: 320,
            }}
          >
            <FollowSupervisorForm />
          </Card>
        </main>
      </div>
    </AppContext.Provider>
  );
}
