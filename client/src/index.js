import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App'



if (process.env.REACT_APP_ENV === 'development') {
    console.log('This is the developmenet environment')
    console.log('test')
} else {
    console.log('This is the production environment')
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,

);