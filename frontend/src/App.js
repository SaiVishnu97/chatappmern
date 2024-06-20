import logo from './logo.svg';
import './App.css';
import { Route,Routes } from 'react-router-dom';
import { HomePage,ChatPage } from 'Pages/index';

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
