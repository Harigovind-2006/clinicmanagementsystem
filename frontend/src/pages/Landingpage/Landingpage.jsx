import React from 'react';
import SplitText from "./SplitText";




const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};
const Landingpage = () => {
  return (
    <>
        <section aria-labelledby="main-box" className='flex h-screen w-full '>
            <div className='flex flex-col items-center justify-start border-2 border-black rounded-xl mx-auto my-auto w-128 h-128 p-10'>
              {/* flex flex-col items-center justify-start border-2 border-black rounded-xl w-64 h-64 */}
                    <SplitText
                        text="Hello, you!"
                        className="text-2xl font-semibold "
                        delay={50}
                        duration={1.25}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        onLetterAnimationComplete={handleAnimationComplete}
                        showCallback
                    />        
            </div>
        </section>
    </>
  );
};

export default Landingpage;