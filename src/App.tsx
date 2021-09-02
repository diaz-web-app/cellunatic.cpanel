import React from 'react';
import './App.css';
import { AppProvider } from './context/app/app_state';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Cpanel from './pages/cpanel';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NewPost from './pages/posts/new_post';
import Posts from './pages/posts';
import Paginas from './pages/paginas';
import Accesorios from './pages/accesorios';
import ThePost from './pages/post';

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
          <Route path="/post" component={Posts} />
          <Route path="/new_post" component={NewPost} />
          <Route path="/the_post" component={ThePost} />
          <Route path="/pagina" component={Paginas} />
          <Route path="/accesorio" component={Accesorios} />
        </Switch>
        </main>
      </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
