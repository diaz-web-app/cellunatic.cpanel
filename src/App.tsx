import React from 'react';
import './App.css';
import { AppProvider } from './context/app/app_state';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Cpanel from './pages/cpanel';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NewPost from './components/new_post';
import Posts from './pages/posts';
import UpdatePost from './components/update_post';

const Home = ()=>{
  return <h1>Home</h1>
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
      <div className="App" >
        <Header/>
        <main>
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cpanel" component={Cpanel} />
          <Route path="/posttype/:type" component={Posts} />
          <Route path="/new_post/:type" component={NewPost} />
          <Route path="/update_post/:url" component={UpdatePost} />
        </Switch>
        </main>
      </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
