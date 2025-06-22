import { Input } from "../ui/input";
import { Sparkles } from "lucide-react";

const TeacherStart = ({ name, handleNameChange,startSession }) => {
  return (
    <div className="absolute w-full flex flex-col items-center md:w-1/2 p-4 md:top-[15%] top-[10%]">
      <div className="flex flex-col items-center justify-center text-center p-4 md:p-8 w-full mt-4">
        <p className="bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] px-4 py-1 rounded-full text-white flex gap-2 font-bold items-center justify-center w-fit text-sm md:text-lg ">
          <Sparkles color="white" />
          Intervue Poll
        </p>
        <h1 className="md:text-4xl font-normal mt-8 md:w-1/2 text-xl">
          Let's
          <span className="font-bold"> Get Started</span>
        </h1>

        <h2 className="md:text-2xl font-normal text-gray-500  mt-4 text-lg">
          As a teacher, you can create and host live polls for your classroom.
          Please enter your name to begin.
        </h2>
      </div>
      <div className="w-3/4 md:w-1/2 flex flex-col justify-center">
        <p className="text-md md:text-lg font-normal">Enter your name</p>
        <Input
          value={name}
          onChange={handleNameChange}
          className={"mt-2 bg-gray-100 rounded-full text-sm md:text-lg font-semibold px-8 py-2 text-center"}
        />
        <div className="md:flex items-center justify-center md:mt-8 mt-4">
          <button className="bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] rounded-full text-white flex gap-2 font-bold items-center justify-center text-sm md:text-lg px-4 py-2 md:w-[200px]  w-full"
            onClick={startSession}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherStart;
crypto.randomUUID()
