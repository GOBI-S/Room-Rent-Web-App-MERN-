import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = React.lazy(() => import('./pages/login/index.tsx'));
const SingUppage = React.lazy(() => import('./pages/singup/index.tsx'));
const CreateRoom = React.lazy(() => import('./pages/Userspages/Ownercomponents/CreateRoom.tsx'));
const Ownerhome = React.lazy(() => import('./pages/Userspages/Ownercomponents/Home.tsx'));
const Olistroom = React.lazy(() => import('./pages/Userspages/Ownercomponents/Myrooms.tsx'));
const Editroom = React.lazy(() => import('./pages/Userspages/Ownercomponents/Editroom.tsx'));
const UserBookingpage = React.lazy(() => import('./pages/Userspages/Ownercomponents/Bookingpage.tsx'));
const Userhome = React.lazy(() => import('./pages/Userspages/Ownercomponents/Searchhome.tsx'));
const Mybooking = React.lazy(() => import('./pages/Userspages/Ownercomponents/Mybbooking.tsx'));
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SingUppage />} />
      <Route path="/home" element={<Ownerhome />} />
      <Route path="/createroom" element={<CreateRoom />} />
      <Route path="/myrooms" element={<Olistroom />} />
      <Route path="/myrooms/:id" element={<Editroom />} />
      <Route path="/searchrooms" element={<Userhome />} />
      <Route path="/searchrooms/:id" element={<UserBookingpage />} />
      <Route path="/Mybooking" element={<Mybooking />}/>
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </Suspense>
  );
};

export default App;
