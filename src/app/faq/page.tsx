export default function FAQPage() {
    const faqs = [
        {
            q: "How do I purchase artwork on ArtBook?",
            a: "You can purchase artwork either instantly at a fixed price, or by bidding in an active auction. Ensure your Stripe payment details are set up correctly upon checkout."
        },
        {
            q: "How do I become a verified artist?",
            a: "Navigate to the 'Apply for Shop' link in your profile dropdown when logged in. Our curation team will review your application and portfolio within 24 hours."
        },
        {
            q: "What is the return policy?",
            a: "We offer a strict 7-day authenticity guarantee. If the physical piece does not match the description or certification of authenticity, please contact support for a mediated return."
        },
        {
            q: "How does shipping work?",
            a: "Shipping is handled directly by the artists. When purchasing a piece, the shipping cost and estimated delivery time will be calculated based on the artist's studio location."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="font-serif text-5xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-500">Find answers to the most common questions about buying and selling on ArtBook.</p>
                </div>

                <div className="space-y-8 mt-12">
                    {faqs.map((faq, i) => (
                        <div key={i} className="pb-8 border-b border-gray-100 last:border-0">
                            <h3 className="text-xl font-medium text-gray-900 mb-3">{faq.q}</h3>
                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
