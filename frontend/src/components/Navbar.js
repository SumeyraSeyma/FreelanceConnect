import {
  LogOut,
  User,
  Megaphone,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { users } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="border-b fixed w-full top-0 z-40 backdrop-blur-lg bg-transparent">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Megaphone className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center" />
              </div>
              <h1 className="text-lg font-bold">TalentHub</h1>
            </Link>
            {/* Search Bar for users */}
            <div className="relative">
              <label className="cursor-pointer flex p-2 items-center gap-2">
                <input
                  type="text"
                  placeholder="Search for users..."
                  className="font-thin italic rounded p-2 bg-base-200 focus:outline-none focus:ring-2 "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "200px", height: "33px" }}
                />
              </label>
              {/* Dropdown for filtered users */}
              {searchQuery && filteredUsers.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-base-200 border rounded-lg shadow-lg mt-2">
                  <ul>
                    {searchQuery && filteredUsers.length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-base-200 border rounded-lg shadow-lg mt-2">
                        <ul>
                          {filteredUsers.slice(0, 3).map((user) => (
                            <li
                              key={user.id}
                              className="flex items-center p-3 hover:bg-base-100 transition-all"
                            >
                              <Link to={`/profile/${user._id}`} className="flex items-center gap-2">
                              <img
                                src={
                                  user.iamge ||
                                  "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"
                                }
                                alt={user.fullName}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold text-base">
                                  {user.fullName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {user.skills.join(", ")}
                                </span>
                              </div>
                            </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {filteredUsers.length === 0 && (
                      <li className="p-2">No users found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            {authUser && (
              <>
                {/* Navigation Links */}
                <Link to={"/jobs"} className="btn btn-sm gap-2">
                  <Briefcase className="size-5" />
                  <span className="hidden sm:inline">My Jobs</span>
                </Link>
                <Link to={"/messages"} className="btn btn-sm gap-2">
                  <MessageSquare className="size-5" />
                  <span className="hidden sm:inline">Messages</span>
                </Link>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button onClick={logout} className="flex gap-2 items-center">
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
