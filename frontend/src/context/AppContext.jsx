import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth, useUser} from '@clerk/clerk-react'
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const {getToken} = useAuth();
  const {user} = useUser()
  const navigate = useNavigate();

  const [allCourse, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourse, setEnrolledCourse] = useState([]);

  const fetchCourses = async () => {
    setAllCourses(dummyCourses);
  };

  const courseRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => (totalRating += rating.rating));
    return totalRating / course.courseRatings.length;
  };

  //  Function to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { time: ["h", "m"] });
  };

  //Function to calculate total course time
  const courseTime = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { time: ["h", "m"] });
  };
  
  //Function to calculate no.of lectures in this course
  const totalLectures = (course )=>{
    let noOfLectures=0;
      course.courseContent.forEach(chapter=> {
        if(Array.isArray(chapter.chapterContent)){
          noOfLectures += chapter.chapterContent.length
        }
      }
        
      )
      return noOfLectures;


  }

  //Fetch enrolled courses
  const fetchEnrolledCourse =async()=>{
     setEnrolledCourse(dummyCourses)
  }


  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourse();
  }, []);

  const logToken = async()=>{
    console.log(await getToken());
  }

  useEffect(()=>{
    if(user){
         logToken();
    }
  },[user])

  const value = {
    currency,
    allCourse,
    navigate,
    courseRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    courseTime,
    totalLectures,
    enrolledCourse,
    fetchEnrolledCourse,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
