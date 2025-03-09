import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from "humanize-duration";
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Ratings from '../../components/student/Ratings';

const Player = () => {
  const {enrolledCourse ,calculateChapterTime  }= useContext(AppContext)
  const {courseId} = useParams();
  const [courseData,setCourseData]= useState(null);
   const [openSection,setOpenSection]=useState({});
    const [playerData, setPlayerData ]= useState(null);

    const fetchCourseData =()=>{
      enrolledCourse.map(course=>{
        if(course._id === courseId){
          setCourseData(course)
        }
      })
    }  

    const toggleSection = (index )=>{
      setOpenSection((prev )=>(
        {...prev, [index]:!prev[index]}
      ))
    }


    useEffect(()=>{
       fetchCourseData();
    },[enrolledCourse])

  return (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
      {/* left Section */}
    <div className='text-gray-800'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>
     <div className="pt-5">
             { courseData && courseData.courseContent.map((chapter, index )=>(
                      <div key={index} className="border border-gray-300 mb-2 rounded bg-white">
                        <div onClick={()=>(toggleSection(index))} className="flex items-center justify-between px-4 py-3 select-none cursor-pointer">
                          <div className="flex items-center gap-2">
                            <img className={`transform transition-transform ${openSection[index]?"rotate-180":"rotate-0"}`} src={assets.down_arrow_icon} alt="arrow icon" />
                           <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                          </div>
                          <p className="text-sm md:text-default">{chapter.chapterTitle.length} {chapter.chapterTitle.length>1?"lectures":lecture}  - {calculateChapterTime(chapter)}</p>
                        </div>
                        <div className={`overflow-hidden ${openSection[index]?"max-h-96":"max-h-0"} transition-all duration-300`}>
                          <ul className="list-disc pl-4 md:pl-10 pr-2 py-2 text-gray-600 border-t border-gray-300">
                            {chapter.chapterContent.map((lecture,i )=>(<li className="flex items-start py-1 gap-2" key={i}>
                              <img className="w-4 h-4 mt-1 " src={false?assets.blue_tick_icon:assets.play_icon} alt="play icon" />
                              <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default  ">
                                <p>{lecture.lectureTitle}</p>
                                <div className="flex gap-2">
                                  {lecture.lectureUrl && <p
                                  onClick={()=>setPlayerData({
                                    ...lecture, chapter: index + 1, lecture: i + 1
                                  })}
                                  className="text-blue-500 cursor-pointer">Watch</p>}
                                  <p>{humanizeDuration(lecture.lectureDuration *60 *1000,{units:['h','m']})}</p>
                                </div>
                              </div>
                            </li>))}
                          </ul>
                        </div>
                      </div>
                    ))}
        
      </div>
      <div className='flex items-center mt-10 py-3 gap-2'>
        <h1 className='text-xl font-semibold'>Rate this Course:</h1>
        <Ratings initialRating={0}/>
      </div>
    </div>
      
     

      {/* right section */}
      <div>
        {playerData?(
           <div>
            <YouTube iframeClassName="w-full aspect-video" videoId={playerData.lectureUrl.split('/').pop() }  ></YouTube>
            <div className='flex justify-between mt-1 items-center'>
              <p> {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle} </p>
              <button className='text-blue-600'> {false? "Completed":"Mark Complete"} </button>               
            </div>
           </div>
        ):
        <img src={courseData? courseData.courseThumbnail: " "} alt="" />
        }
      </div>

    </div>
    
    <Footer/>
    </>
  )
}

export default Player