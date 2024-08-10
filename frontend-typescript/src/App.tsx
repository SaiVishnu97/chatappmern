import HomePage from 'Pages/HomePage';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import ChatPage from 'Pages/ChatPage';
import axios from 'axios';

  axios.defaults.baseURL = process.env.REACT_APP_BACKENDURL
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
