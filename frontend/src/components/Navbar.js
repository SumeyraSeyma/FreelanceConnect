import { LogOut, User, Megaphone, Briefcase, MessageSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="border-b fixed w-full top-0 z-40 backdrop-blur-lg bg-transparent ">
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
          </div>
          <div className="flex items-center gap-2">
            {authUser && (
              <>
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
