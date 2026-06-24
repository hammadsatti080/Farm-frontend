
import About from "./Homescreen/About";
import Hero from "./Homescreen/Hero";
import Review from "./Homescreen/Review";

{/*import { QRCode } from '@/components/shared-assets/qr-code';

<QRCode value="https://www.untitledui.com/" size="lg" />
*/}


export default function Home() {
  return (
    <div >
      <Hero />
      <About />
      <Review />
    </div>
  );
}
