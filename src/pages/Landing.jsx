import { Sparkles } from "lucide-react";

const Landing = () => {
  const handleRoleSelection = (role) => {
    if (role === "student") {
      window.location.href = "/student";
    } else if (role === "teacher") {
      window.location.href = "/teacher";
    }
  };
  return (
    <div className="w-full h-full md:flex md:flex-col md:items-center md:justify-center">
      <div className="flex flex-col items-center justify-center text-center p-4 md:p-8 w-full">
        <p className="bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] px-4 py-1 rounded-full text-white flex gap-2 font-bold items-center justify-center w-fit text-sm md:text-lg">
          <Sparkles color="white" />
          Intervue Poll
        </p>

        <h1 className="md:text-5xl font-normal mt-8 w-1/2">
          Welcome to the
          <span className="font-bold"> Live Polling System</span>
        </h1>

        <h2 className="md:text-3xl font-normal text-gray-500  mt-4 w-1/2">
          Please select the role that best describes you to begin using the live
          polling system
        </h2>
      </div>

      <div className="w-full md:flex md:items-center md:justify-center mt-2 w-1/2 gap-8">
        <button className="flex flex-col text-left rounded-md p-4 border border-2 border-gray-200 w-1/5 hover:border-[#7765DA] transition-all duration-300 h-[150px]" onClick={() => handleRoleSelection("student")}>
          <span className="font-bold text-2xl">I'm a Student</span>
          <span className="font-normal text-lg">
            Submit answers and view live poll results in real-time
          </span>
        </button>

        <button className="flex flex-col text-left rounded-md p-4 border border-2 border-gray-200 w-1/5 hover:border-[#7765DA] transition-all duration-300 h-[150px]"  onClick={() => handleRoleSelection("teacher")}>
          <span className="font-bold text-2xl">I'm a Teacher</span>
          <span className="font-normal text-lg">
            Create and host live polls for your classroom
          </span>
        </button>
      </div>

      <div className="mt-4">``
        <button className="bg-gradient-to-r from-[#7765DA] to-[#4F0DCE] rounded-full text-white flex gap-2 font-bold items-center justify-center text-sm md:text-lg mt-8 px-4 py-2 w-[200px]">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Landing;
