import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const {navigate, isEducator} = useContext(AppContext)

  const isCourseDetails = location.pathname.includes("/course-list");
  return (
    <div
      className={`flex justify-between gap-5 lg:px-24 py-2 md:px-14 sm:px-10 px-4 items-center border-b border-gray-500 select-none ${
        isCourseDetails ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img src={assets.logo} onClick={()=>navigate('/')} className="w-28 lg:w-32 cursor-pointer" alt="" />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-4">
          {user && (
            <>
              <button onClick={()=> navigate('/educator')} >{isEducator?"Educator Dashboard":"Become Educator"} </button>|{" "}
              <Link to="/my-enrollments"> My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton></UserButton>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="px-5 py-2 bg-blue-500 rounded-full text-white"
          >
            {" "}
            Create Account
          </button>
        )}
      </div>
      {/*For mobile screen */}
      <div className="md:hidden text-gray-500 flex items-center sm:gap-5">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
        {user && (
            <>
              <button onClick={()=> navigate('/educator')} >{isEducator?"Educator Dashboard":"Become Educator"} </button>|{" "}
              <Link to="/my-enrollments"> My Enrollments</Link>
            </>
          )}
        </div>
        {user? <UserButton/> :  <button onClick={()=>openSignIn()}>
          <img src={assets.user_icon} alt="" />
        </button>}
       
      </div>
    </div>
  );
};

export default Navbar;
