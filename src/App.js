import { lazy } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AdminLayout from "./layouts/Admin";
// const Languages = lazy(() => import("./containers/Admin/Languages"));
// const Difficulties = lazy(() => import("./containers/Admin/Difficulties"));

import Languages from "./containers/Admin/Courses";
import Difficulties from "./containers/Admin/Difficulties";
import Questions from "./containers/Admin/Questions";
import Tests from "./containers/Admin/Tests";
import Users from "./containers/Admin/Users";
import MyTests from "./containers/Admin/MyTests";
import MyTestDetail from "./containers/Admin/MyTestDetail";

function App() {
  return (
    <div>
      <Router>
        <AdminLayout>
          <Routes>
            <Route path={"/difficulty-levels"} element={<Difficulties />} />
            <Route path={"/courses"} element={<Languages />} />
            <Route path={"/questions"} element={<Questions />} />
            <Route path={"/tests"} element={<Tests />} />
            <Route path={"/users"} element={<Users />} />
            <Route path={"/my-tests"} element={<MyTests />} />
            <Route path={"/my-tests/:id"} element={<MyTestDetail />} />
          </Routes>
        </AdminLayout>
      </Router>
    </div>
  );
}

export default App;
