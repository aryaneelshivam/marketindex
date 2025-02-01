import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-sm text-muted-foreground">Last updated on 01-02-2025 15:57:24</p>
          
          <div className="space-y-4">
            <p>You may contact us using the information below:</p>
            
            <div className="space-y-2">
              <p><strong>Merchant Legal entity name:</strong> ARYANEEL SHIVAM</p>
              <p><strong>Registered Address:</strong> 3,Padmapani Path, Khanapara, Assam, PIN: 781022</p>
              <p><strong>Operational Address:</strong> 3,Padmapani Path, Khanapara, Assam, PIN: 781022</p>
              <p><strong>Telephone No:</strong> 7099152511</p>
              <p><strong>E-Mail ID:</strong> aryaneelshivam1234@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;