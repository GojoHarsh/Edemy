import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center  w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7  text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto">
        Empower your future with the courses designed to{" "}
        <span className="text-blue-600">fit your choice </span>{" "}
        <img
          className="md:block hidden absolute -bottom-7 right-0"
          src={assets.sketch}
          alt="sketch"
        />
      </h1>
      <p className="md:block  max-w-2xl mx-auto text-lg text-gray-500">
       Bhai ne bola upskill karne ka to karne ka 🤙{" "}
      </p>
      <p className="md:block hidden max-w-2xl mx-auto text-gray-500">
        We bring together world class instructors, interactive content and a
        supportive community to help you achieve your personal and professional
        goals.{" "}
      </p>
      <p className="text-gray-500 mx-auto md:hidden max-w-sm">We bring together world class instructors to achieve your professional goals</p>
      <SearchBar/>
    </div>
  );
};

export default Hero;
