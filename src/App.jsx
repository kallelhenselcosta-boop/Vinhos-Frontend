import 'bootstrap/dist/css/bootstrap.min.css'
import '@popperjs/core/dist/cjs/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from './componentes/Menu'
import Home from './componentes/Home'
import Vinho from './componentes/Vinho'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />, 
    children: [
      {
        index: true,
        element: <Home />, 
      },
      {
        path : "/vinhos",
        element : <Vinho /> 
      }   
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;