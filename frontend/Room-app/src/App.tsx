import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const LoginPage = React.lazy(() => import("./pages/login/index.tsx"));
const SingUppage = React.lazy(() => import("./pages/singup/index.tsx"));
const CreateRoom = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/CreateRoom.tsx")
);
const Ownerhome = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/Home.tsx")
);
const Olistroom = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/Myrooms.tsx")
);
const Editroom = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/Editroom.tsx")
);
const UserBookingpage = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/Bookingpage.tsx")
);
const Userhome = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/Searchhome.tsx")
);
const Mybooking = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/Mybbooking.tsx")
);
const Details = React.lazy(
  () => import("./pages/Userspages/Ownercomponents/Details.tsx")
);
const App = () => {
  return (
    <Suspense
      fallback={
        <div className="house-loading-container">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="house-loading"
          >
            <path
              d="M10 50 L50 10 L90 50 L90 90 L10 90 Z"
              stroke="white"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          <style>{`
            .house-loading-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: black;
            }

            .house-loading {
              width: 100px;
              height: 100px;
              animation: pulse 2s ease-in-out infinite;
            }

            .house-loading path {
              stroke-dasharray: 400;
              stroke-dashoffset: 400;
              animation: draw 4s linear infinite;
            }

            @keyframes draw {
              0% {
                stroke-dashoffset: 400;
              }
              50% {
                stroke-dashoffset: 0;
              }
              100% {
                stroke-dashoffset: 400;
              }
            }

            @keyframes pulse {
              0%,
              100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(0.9);
                opacity: 0.7;
              }
            }
          `}</style>
        </div>
      }
    >
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
        <Route path="/Mybooking" element={<Mybooking />} />
        <Route path="/Mybooking/:id" element={<Details />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default App;
