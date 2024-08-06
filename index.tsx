import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';


const canvas: HTMLElement|null = document.getElementById('canvas');
if (canvas === null)
  throw new Error("Uh oh! HTML is missing 'main' element");

const root: Root = createRoot(canvas);
root.render(<App/>);
