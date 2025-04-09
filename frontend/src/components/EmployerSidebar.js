import React, { useEffect } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { users, getUsers } = useChatStore();
  const [randomUsers, setRandomUsers] = React.useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    if (users.length > 0) {
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
      setRandomUsers(shuffledUsers.slice(0, 5));
    }
  }, [users]);

  return (
    <aside className="h-full w-20 lg:w-72 flex flex-col transition-all duration-200">
      <div className="w-full p-5">
        <div className="flex w-72 items-end gap-2 shadow-sm shadow-white p-4 rounded-lg">
          <BriefcaseBusiness className="size-6" />
          <span className="font-medium hidden lg:block italic">Open to work</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 p-4">
        <ul className="space-y-4">
          {randomUsers.map((user) => (
            <li
              key={user.id}
              className="p-2 shadow-cyan-600 shadow-sm w-72 h-20 flex rounded-lg text-white transition"
            >
              <img
                className="w-10 h-10 rounded-full"
                src={user.image || "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg" }
                alt={user.fullName}
              />
              <div className="flex flex-col justify-center">
                <span className="min-w-56 ml-2 block items-center text-white font-normal text-center">
                  <Link to={`/profile/${user._id}`}>{user.fullName}</Link>
                </span>
                <span className="ml-2 italic block items-center text-white font-light text-center">
                  {truncateText(user.bio || "", 40)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
