import { useParams } from "react-router-dom";
import { AddTaskButton } from "../components/AddTaskButton";
import { ProjectCarusel } from "../components/ProjectCarusel";
import { useEffect } from "react";
// import { useUserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";

const Project = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
    WebApp.setHeaderColor("#FFFFFF");
  }, []);

  const { id } = useParams();

  
  // const { updateUserState } = useUserContext();
  // useEffect(() => {
  //   updateUserState({ location: "project" });
  // }, [updateUserState]);

  return (
    <>
      <ProjectCarusel />
      <AddTaskButton id={Number(id)} />
    </>
  );
};

export default Project;
