import React from 'react'
import { Route,Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import Player from './pages/student/Player'
import MyEnrollments from './pages/student/MyEnrollments'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import EnrolledStudents from './pages/educator/EnrolledStudents'
import MyCourses from './pages/educator/MyCourses'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css";



const App = () => {
  const isEducator = useMatch('/educator/*')
  return (
    <div className='min-h-screen select-none text-default bg-white'>
      {!isEducator && <Navbar></Navbar> }
      
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/course-list' element={<CoursesList/>}></Route>
        <Route path='/course-list/:input' element={<CoursesList/>}></Route>
        <Route path='/course/:id' element={<CourseDetails/>}></Route>
        <Route path='/player/:courseId' element={<Player/>}></Route>
        <Route path='/my-enrollments' element={<MyEnrollments/>}></Route>
        <Route path='/loading/:path' element={<Loading/>}></Route>
        <Route path='/educator' element={<Educator/>}>
            <Route path='/educator' element={<Dashboard/>}></Route>
            <Route path='add-course' element={<AddCourse/>}></Route>
            <Route path='enrolled-students' element={<EnrolledStudents/>}></Route>
            <Route path='my-courses' element={<MyCourses/>}></Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App