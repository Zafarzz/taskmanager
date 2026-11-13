import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Projects from "./views/Projects";
import Project from "./views/Project";
import Mytasks from "./views/Mytasks";
import GroupSettings from "./views/GroupSettings";
import CreateTaskFromGroup from "./views/creteTask/CreateTaskFromGroup";
import Task from "./views/Task";
import Events from "./views/Events";
import Onboarding from "./views/onboarding/Onboarding";
import HowToAdd from "./views/onboarding/HowToAdd";
import SettingsProjects from "./views/SettingsProjects";
import Archive from "./views/Archive";
import Notification from "./views/Notification";
import Language from "./views/Language";
import Profile from "./views/Profile";
import Settings from "./views/Settings";
import TimeZone from "./views/TimeZone";
import { ToastContainer } from "react-toastify";
import "./index.css";

const AppRoutes = () => {
  return (
    <div className="max-w-[700px] bg-[#F2F2F7] h-[100vh] mx-auto w-full relative select-none scrollbar-hidden">
      <ToastContainer stacked />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/groups/:id" element={<Projects />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/projects/:id/settings" element={<GroupSettings />} />
        <Route path="/mytasks" element={<Mytasks />} />
        <Route
          path="/task/create/:project_id"
          element={<CreateTaskFromGroup />}
        />
        <Route path="/tasks/:id" element={<Task />} />
        <Route path="/event" element={<Events />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboardingcrate" element={<HowToAdd />} />
        <Route path="/settingsprojects" element={<SettingsProjects />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/project/:id/archive" element={<Archive />} />
        <Route path="/project/:id/archive/tasks/:id" element={<Task />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/language" element={<Language />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/timezone" element={<TimeZone />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
