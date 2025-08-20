
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ModeToggle } from '@/components/layout/ThemeToggle/theme-toggle';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (

    <div className="min-h-screen w-full bg-white dark:bg-zinc-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-zinc-800 shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-green-700 dark:text-green-400">DENR Chainsaw Registry</h1>
              <ModeToggle />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center mt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <Card className="mb-8 bg-white dark:bg-zinc-800 border dark:border-zinc-700">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 text-center">Chainsaw Registration Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-4">
                Register your chainsaw for legal use, compliance, and responsible forest management. Powered by the Department of Environment and Natural Resources (DENR).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800" asChild>
                  <Link href="/equipments/registration">Start Registration</Link>
                </Button>
                <Button size="lg" variant="outline" className="dark:border-green-700 dark:text-green-400" asChild>
                  <a href="mailto:cenroalaminos@denr.gov.ph">Contact DENR</a>
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">For inquiries: cenroalaminos@denr.gov.ph | 09852390811</p>
            </CardContent>
          </Card>

          {/* Requirements Accordion */}
          <Accordion type="multiple" className="mb-8">
            <AccordionItem value="requirements">
              <AccordionTrigger>General Requirements</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
                  <li>Duly accomplished application form</li>
                  <li>Detailed chainsaw info (brand, model, engine capacity, serial number, etc.)</li>
                  <li>Purpose, location, owner, date of purchase, dealer</li>
                  <li>Sales invoice, deed of sale, official receipt</li>
                  <li>Registration fee (Php 500 + Documentary stamp Php 30)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tenurial">
              <AccordionTrigger>Additional for Tenurial Instrument Holders</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
                  <li>Copy of the tenurial instrument</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="farmers">
              <AccordionTrigger>Additional for Orchard/Fruit Tree Farmers</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
                  <li>Certificate of tree plantation ownership</li>
                  <li>Certification from Barangay Captain (applicant is orchard/tree farmer)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="processors">
              <AccordionTrigger>Additional for Licensed Wood Processors</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
                  <li>Copy of approved Wood Processing Plant Permit</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="agencies">
              <AccordionTrigger>Additional for Government Agencies/GOCCs</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
                  <li>Certification from Head of Office/authorized rep (chainsaw is for legal use)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="business">
              <AccordionTrigger>Additional for Business/Legal Purpose</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
                  <li>Business Permit from LGU or Affidavit (chainsaw needed for work/legal purpose)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-white dark:bg-zinc-800 border dark:border-zinc-700">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Who Should Register?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 text-sm">
                  <li>Tenurial instrument holders</li>
                  <li>Orchard/fruit tree farmers</li>
                  <li>Industrial tree farmers</li>
                  <li>Licensed wood processors</li>
                  <li>Government agencies/GOCCs</li>
                  <li>Anyone needing chainsaw for legal purpose</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-zinc-800 border dark:border-zinc-700">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200 text-sm">
                  <li>Only chainsaws bought from legitimate business owners with DENR Permit to Sell are accepted</li>
                  <li>Applications are filed online via <a href="https://denr1.gov.ph" className="text-green-600 dark:text-green-400 underline" target="_blank" rel="noopener noreferrer">denr1.gov.ph</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 dark:bg-black text-white mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Department of Environment and Natural Resources - Chainsaw Registry Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
