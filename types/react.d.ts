/// <reference types="react/next" />
/// <reference types="react-dom/next" />

import React from 'react';
declare global {
  namespace React {
    // Add proper type for ReactNode
    type ReactNode = React.ReactNode;
  }
}
