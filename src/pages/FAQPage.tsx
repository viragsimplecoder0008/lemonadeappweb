import React from "react";
import Layout from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "What ingredients do you use in your lemonades?",
      answer: "We use only the finest natural ingredients including fresh lemons, pure water, organic cane sugar, and natural flavor extracts. All our products are made without artificial preservatives or colors."
    },
    {
      question: "How long do your lemonades stay fresh?",
      answer: "Our lemonades are best consumed within 3-5 days of delivery when refrigerated. Each bottle has a freshness date printed on the label."
    },
    {
      question: "Do you offer delivery?",
      answer: "Yes! We deliver to most areas within 24-48 hours of order placement. Delivery fees vary by location and order size."
    },
    {
      question: "Can I customize my order?",
      answer: "Absolutely! You can adjust sweetness levels, add extra flavors, or create custom blends. Contact us during checkout to specify your preferences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards for online payments, and cash on delivery for local orders."
    },
    {
      question: "Do you offer bulk orders for events?",
      answer: "Yes! We offer special pricing for bulk orders and catering services. Please contact us at least 48 hours in advance for large orders."
    },
    {
      question: "Are your products suitable for people with dietary restrictions?",
      answer: "Most of our lemonades are naturally gluten-free and vegan. Please check individual product descriptions for specific dietary information or contact us for detailed ingredient lists."
    },
    {
      question: "What is your return policy?",
      answer: "We stand behind our quality. If you're not satisfied with your order, contact us within 24 hours of delivery for a full refund or replacement."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is placed, you'll receive a confirmation email with a tracking number. You can also check your order status on our Orders page."
    },
    {
      question: "Do you have a loyalty program?",
      answer: "Yes! Join our VIP program to earn points on every purchase, get exclusive discounts, and receive early access to new flavors."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our lemonades, ordering, and services.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? We're here to help!
            </p>
            <a 
              href="mailto:viraj.vmaster1@gmail.com"
              className="inline-block px-6 py-3 bg-lemonade-yellow hover:bg-lemonade-green text-black rounded-md font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;