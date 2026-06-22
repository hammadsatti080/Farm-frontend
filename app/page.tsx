import Attendance from "./Attendence/Attendance";
import About from "./Homescreen/About";
import Hero from "./Homescreen/Hero";
import Review from "./Homescreen/Review";




export default function Home() {
  return (
    <div >
      <Hero />
      <About />
      <Review />
 <Attendance />
    </div>
  );
}
