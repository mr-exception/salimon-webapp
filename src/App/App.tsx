import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import MenuItem from "./Components/MenuItem/MenuItem";
import Contacts from "./Images/Contacts";
import Hosts from "./Images/Hosts";
import Profile from "./Images/Profile";
import Setting from "./Images/Setting";
import Styles from "./styles.module.css";
import { ModalsContextProvider } from "Modals/ModalsContextProvider";
import ModalContainer from "Modals/ModalContainer";
import { HostsContextProvider } from "Hosts/HostsContextProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IProps {
  children: any;
}
const App: React.FC<IProps> = ({ children }: IProps) => {
  const history = useHistory();
  const href = useLocation().pathname;
  let activeSection: "chats" | "hosts" | "profile" | "setting" = "chats";
  switch (href) {
    case "/":
      activeSection = "chats";
      break;
    case "/hosts":
      activeSection = "hosts";
      break;
    case "/profile":
      activeSection = "profile";
      break;
    case "/setting":
      activeSection = "setting";
      break;
  }
  return (
    <div className={Styles.app}>
      <div className={Styles.container}>
        <div className={Styles.toolbar}>
          <MenuItem
            IconComponent={Contacts}
            caption="chats"
            onClick={() => {
              history.push("/");
            }}
            isActive={activeSection === "chats"}
          />
          <MenuItem
            IconComponent={Hosts}
            caption="hosts"
            onClick={() => {
              history.push("/hosts");
            }}
            isActive={activeSection === "hosts"}
          />
          <MenuItem
            IconComponent={Profile}
            caption="profile"
            onClick={() => {
              history.push("/profile");
            }}
            isActive={activeSection === "profile"}
          />
          <MenuItem
            IconComponent={Setting}
            caption="setting"
            onClick={() => {
              history.push("/setting");
            }}
            isActive={activeSection === "setting"}
          />
        </div>
        <HostsContextProvider>
          <ModalsContextProvider>
            <div className={Styles.children}>{children}</div>
            <ModalContainer />
          </ModalsContextProvider>
        </HostsContextProvider>
      </div>
      <ToastContainer
        bodyStyle={{ maxWidth: "90%", wordBreak: "break-all" }}
        position="top-center"
        autoClose={3500}
        limit={3}
        newestOnTop={true}
        theme="colored"
        draggable={false}
        closeOnClick={false}
      />
    </div>
  );
};

export default App;
