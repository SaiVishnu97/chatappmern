import './App.css';
import { Route,Routes } from 'react-router-dom';
import { HomePage,ChatPage } from 'Pages/index';
import axios from 'axios';

if(process.env.REACT_APP_ENVTYPE==='dev')
    axios.defaults.baseURL = 'http://localhost:5000';
function App() {
  return (
    <div className="App">
   <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/chats' element={<ChatPage/>}/>
   </Routes>
    </div>
  );
}

export default App;
