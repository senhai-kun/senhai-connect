import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import JoinRoom from './components/JoinRoom/JoinRoom'
import Room from './components/Room/Room'

function App() {
  return (
    <div >
      <Router>
        <Switch>
            <Route exact path='/'>
              <JoinRoom />
            </Route>
            
            <Route path='/room/:roomname' >
              <Room />
            </Route>
        </Switch>
    </Router>
    </div>
  );
}

export default App;
