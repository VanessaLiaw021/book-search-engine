import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

function App() {

  //Construct the main GraphQL API endpoint 
  const httpLink = createHttpLink({ uri: '/graphql' });

  //Construct request middleware that will attach the JWT token to every reqyest as an authorize user 
  const authLink = setContext((_, { headers }) => {

    //Get authentication token from local storage if exist 
    const token = localStorage.getItem("id_token");

    //Return headers to the context so httpLink can read them 
    return {
      headers: {...headers, authorization: token ? `Bearer ${token}` : ''}
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route 
              path='/' 
              element={<SearchBooks />} 
            />
            <Route 
              path='/saved' 
              element={<SavedBooks />} 
            />
            <Route 
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
