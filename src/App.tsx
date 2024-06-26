import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import { ask } from '@tauri-apps/plugin-dialog';
import { locale, platform } from '@tauri-apps/plugin-os';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { checkForAppUpdates } from './updater';

function App() {
  const [store, setStore] = useState({
    platform: null,
    locale: null,
  });
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }));
  }

  useEffect(() => {
    const tryAsk = async () => {
      const response = await ask('lubita tauri', {
        title: 'Tauri',
        okLabel: 'Yes',
        cancelLabel: 'Not yet',
      });

      console.log(response);
    };

    const getPlatform = async () => {
      const platform2: any = await platform();
      const locale2: any = await locale();

      setStore({ platform: platform2, locale: locale2 });
    };

    const getNotifications = async () => {
      const hasPermission = await isPermissionGranted();

      if (!hasPermission) {
        const permission = await requestPermission();

        if (permission === 'granted') {
          console.log('Permission granted');
          sendNotification({
            title: 'Hello from Rust!',
            body: 'This is a notification from JavaScript and Rust',
          });
        } else {
          console.log('Permission denied');
        }
      } else {
        console.log('Already has permission');
        console.log('sendNotification ');
        sendNotification({
          title: 'Hello from Rust!',
          body: 'This is a notification from JavaScript and Rust',
        });
      }
    };

    tryAsk();
    getPlatform();
    getNotifications();
    checkForAppUpdates();
  }, []);

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <>{store.platform && JSON.stringify(store.platform)}</>

      <>{store.locale && JSON.stringify(store.locale)}</>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
