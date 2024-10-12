import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Home from "./pages/Home.tsx";
import LoginWrapper from "./components/LoginWrapper.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginWrapper />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
