import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import Product from './Pages/Product';

const router = createBrowserRouter([
  {
    element: <Header />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/product',
        element: <Product />,
      },
    ],
  },
]);

const Routing = () => <RouterProvider router={router} />;

export default Routing;
