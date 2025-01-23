import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import 'ipmc-ui/style.css';

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
