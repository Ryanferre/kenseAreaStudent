import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import ProtectedLayout from "../Layouts/layouts"
import Home from "../pages/homepage/home"
import Aplytest from "../pages/CERF/listTest"
import ReadingLevelTest from "../pages/CERF/reading"
import SpeakingTest from "../pages/CERF/speaking"
import ListeningTest from "../pages/CERF/Listening"
import WritingLevelTest from "../pages/CERF/writing"

export const router = createBrowserRouter([
  {
    element: <ProtectedLayout />, // auth
    children: [
      {
        element: <App />, // layout visual (Nav + Outlet)
        children: [
          {
            index: true,
            element: <Home />,
          },
          {path: 'aplytest', element: <Aplytest />},
          {path: 'reading', element: <ReadingLevelTest />},
          {path: 'speaking', element: <SpeakingTest />},
          {path: 'listening', element: <ListeningTest />},
          {path: 'writing', element: <WritingLevelTest />}
        ],
      },
    ],
  },
])