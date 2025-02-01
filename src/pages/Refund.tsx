import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Cancellation & Refund Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated on 01-02-2025 15:59:59</p>
          
          <div className="prose prose-sm max-w-none">
            <p>ARYANEEL SHIVAM believes in helping its customers as far as possible, and has therefore a liberal
            cancellation policy. Under this policy:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations will be considered only if the request is made immediately after placing the order.
              However, the cancellation request may not be entertained if the orders have been communicated to the
              vendors/merchants and they have initiated the process of shipping them.</li>
              
              <li>ARYANEEL SHIVAM does not accept cancellation requests for perishable items like flowers, eatables
              etc. However, refund/replacement can be made if the customer establishes that the quality of product
              delivered is not good.</li>
              
              <li>In case of receipt of damaged or defective items please report the same to our Customer Service team.
              The request will, however, be entertained once the merchant has checked and determined the same at his
              own end. This should be reported within Only same day days of receipt of the products.</li>
              
              <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer
              the issue to them.</li>
              
              <li>In case of any Refunds approved by the ARYANEEL SHIVAM, it'll take 6-8 Days days for the refund to
              be processed to the end customer.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;