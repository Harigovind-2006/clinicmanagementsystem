import React from "react";
import SplitText from "./SplitText";

const handleAnimationComplete = () => {
  console.log("Animation Complete");
};

const Landingpage = () => {
  return (
    <section
      className="h-screen w-full flex items-center justify-end pr-29 bg-[url('/loginbg.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="w-[500px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10">

        
        <div className="flex justify-center mb-6">
         <div className="w-15 h-15 rounded-full bg-blue-200 flex items-center justify-center shadow-md">
            <span className="text-4xl text-blue-500">+</span>
          </div>
        </div>

        
        <div className="text-center mb-8">
          <SplitText
            text="Welcome Back!"
            className="text-4xl font-bold text-slate-900"
            delay={40}
            duration={0.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            onLetterAnimationComplete={handleAnimationComplete}
            showCallback
          />

          <SplitText
            text="Sign in to continue to Clinic Management System"
            className="text-gray-500 mt-3"
            delay={15}
            duration={0.3}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 10 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>
        <form className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button type="submit"className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
};

export default Landingpage;
