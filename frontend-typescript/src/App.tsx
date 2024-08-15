import axios from 'axios';
import HomePage from 'Pages/HomePage';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import ChatPage from 'Pages/ChatPage';

if(process.env.REACT_APP_BACKENDURL)
  axios.defaults.baseURL = 'http://localhost:5000'
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
