import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function WebsiteLayout() {

  return   <>
      <Navbar/>
      <Outlet />
      </>

}
