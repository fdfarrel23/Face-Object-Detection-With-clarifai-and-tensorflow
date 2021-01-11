import './App.css';
import React,{Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import login from './login/Login';
import main from './main/Main';


class App extends Component{
  render(){
    return(
      <div>
        <BrowserRouter>
          <div>
            <main>
                <Route path='/' exact component={login}/>
                <Route path='/main' exact component={main}/>
            </main>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}


export default App;
