
import About from "./Homescreen/About";
import Categories from "./Homescreen/Categories";
import Hero from "./Homescreen/Hero";
import Review from "./Homescreen/Review";
import Stock from "./Homescreen/Stock";

{/*import { QRCode } from '@/components/shared-assets/qr-code';

<QRCode value="https://www.untitledui.com/" size="lg" />
*/}


export default function Home() {
  return (
    <div >
      <Hero />
      <About />
      <Categories />
      <Stock />
      <Review />

    </div>
  );
}
