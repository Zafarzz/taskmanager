import { useEffect, useState } from "react";
import HowToAdd from "./HowToAdd";
import HowToCreate from "./HowToCreate";
import UsefullCommand from "./UsefullCommand";
import WebApp from "@twa-dev/sdk";
import ForQuestion from "./ForQuestion";

const Onboarding = () => {
  useEffect(() => {
    const BackButton = WebApp.BackButton;
    BackButton.show();
    const bg = "#007AFF";
    WebApp.setHeaderColor(bg);
  }, []);
  const [page, setPage] = useState(1);
  return (
    <>
      {(page === 1 && <HowToAdd setPage={setPage} />) ||
        (page === 2 && <HowToCreate setPage={setPage} />) ||
        (page === 3 && <UsefullCommand setPage={setPage} />) ||
        (page === 4 && <ForQuestion />)}
    </>
  );
};

export default Onboarding;
