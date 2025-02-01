import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated on 01-02-2025 15:58:27</p>
          
          <div className="prose prose-sm max-w-none">
            <p>These Terms and Conditions, along with privacy policy or other terms ("Terms") constitute a binding
            agreement by and between ARYANEEL SHIVAM, ( "Website Owner" or "we" or "us" or "our") and
            you ("you" or "your") and relate to your use of our website, goods (as applicable) or services (as
            applicable) (collectively, "Services").</p>

            <p>By using our website and availing the Services, you agree that you have read and accepted these Terms
            (including the Privacy Policy). We reserve the right to modify these Terms at any time and without
            assigning any reason. It is your responsibility to periodically review these Terms to stay informed of
            updates.</p>

            <p>The use of this website or availing of our Services is subject to the following terms of use:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>To access and use the Services, you agree to provide true, accurate and complete information to us
              during and after registration, and you shall be responsible for all acts done through the use of your
              registered account.</li>
              <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness,
              performance, completeness or suitability of the information and materials offered on this website
              or through the Services, for any specific purpose.</li>
              <li>Your use of our Services and the website is solely at your own risk and discretion.</li>
              <li>The contents of the Website and the Services are proprietary to Us and you will not have any
              authority to claim any intellectual property rights, title, or interest in its contents.</li>
            </ul>

            <p>All disputes arising out of or in connection with these Terms shall be subject to the exclusive
            jurisdiction of the courts in Khanapara, Assam.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;