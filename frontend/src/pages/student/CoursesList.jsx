import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { navigate,allCourse } = useContext(AppContext);
  const {input} = useParams()
  const [filteredcourses, setfilteredcourses]= useState([]);

   useEffect(()=>{
    
    if(allCourse && allCourse.length >0 ){
      const tempCourses = allCourse.slice();
      input?
       setfilteredcourses(tempCourses.filter((item)=>item.courseTitle.toLowerCase().includes(input.toLowerCase())))     
      :setfilteredcourses(tempCourses);
    }
   

   },[allCourse,input])


  return (
    <>
      <div className="px-8 md:px-36 relative text-left pt-20">
        <div className="flex flex-col md:flex-row gap-6 item-start justify-between w-full">
          <div>
            {" "}
            <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
            <p className="text-gray-500">
              <span
                onClick={() => navigate("/")}
                className=" cursor-pointer text-blue-500"
              >
                Home
              </span>{" "}
              /<span>Course List</span>
            </p>
          </div>
          <SearchBar data={input}/>
        </div>
        {
          input && <div className="inline-flex gap-4 items-center px-4 py-2 border mt-8 -mb-8 text-gray-600">
            <p>{input}</p>
            <img className="cursor-pointer" src={assets.cross_icon} onClick={()=>navigate('/course-list')} alt="cross_icon" />
          </div>
        }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  my-16 gap-3 px-2 md:px-0">
          {filteredcourses.map((course, index )=><CourseCard key={index} course={course} />)}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CoursesList;
