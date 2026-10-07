import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

function ProtectedRoute({ user }) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;


/* the location tracks the user; if in the wrong place or does not have an account return back to login ...... but if 

user has acct, want page to  return <Outlet />; or 
 load in the Outlet: AppLayout:  

import { NavLink, Outlet } from 'react-router-dom';
  */