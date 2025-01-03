import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login/index.tsx';
import {SingUppage} from  './pages/singup/index.tsx';
import CreateRoom from './pages/Ownerhome/Ownercomponents/CreateRoom.tsx';
import Ownerhome from './pages/Ownerhome/Ownercomponents/OwnerHome.tsx';
import Olistroom from './pages/Ownerhome/Ownercomponents/Olistroom.tsx';
import Editroom from './pages/Ownerhome/Ownercomponents/Editroom.tsx';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={< LoginPage/>} />
      <Route path="/singup" element={< SingUppage/>}/>
      <Route path='/ownerhome' element={< Ownerhome />}/>
      <Route path='/Createroom'element={<CreateRoom/>}/>
      <Route path='/Roomlist' element={<Olistroom/>}/>
      <Route path='/Roomlist/:id' element={<Editroom/>}/>
      {/* <Route path="*" element={<NotFoundPage />} /> Catch-all for 404 */}
    </Routes>
  );
};

export default App;
