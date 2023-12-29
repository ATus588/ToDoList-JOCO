import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AuthProvider } from './context/auth';

const HASURA_ENDPOINT='https://true-perch-59.hasura.app/v1/graphql'
const HASURA_ADMIN_SECRET='cTRqsfb40nT3du2IKpX8PY4JQmTb7PEQVfAjIxd6sgXT39ynjiwlWZftjKABLt30'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new ApolloClient({
  uri: HASURA_ENDPOINT,
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET
  }
})

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);


