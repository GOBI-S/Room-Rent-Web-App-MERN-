import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login/index.tsx';
import {SingUppage} from  './pages/singup/index.tsx';
import CreateRoom from './pages/Owner/Ownercomponents/CreateRoom.tsx';
import Ownerhome from './pages/Owner/Ownercomponents/OwnerHome.tsx';
import Olistroom from './pages/Owner/Ownercomponents/Olistroom.tsx';
import Editroom from './pages/Owner/Ownercomponents/Editroom.tsx';
import Userhome from './pages/User/Userhome.tsx';
import UserBookingpage from './pages/User/UserBookingpage.tsx';
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
      <Route path="/Userhome" element={<Userhome/>}/>
      <Route path="/Userhome/:id" element={<UserBookingpage/>}/>
      {/* <Route path="*" element={<NotFoundPage />} /> Catch-all for 404 */}
    </Routes>
  );
};

export default App;
