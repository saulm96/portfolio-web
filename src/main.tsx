import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {RouterProvider} from "react-router-dom";
import router from "./pages/router";

import LanguageProvider from './context/LanguageContextObject';

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
    <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
)
