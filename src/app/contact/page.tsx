import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="font-serif text-5xl font-bold tracking-tight text-gray-900">Get in Touch</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">We'd love to hear from you. Please reach out with any questions about artworks, artists, or your account.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    <div className="bg-gray-50 p-8 rounded-3xl text-center space-y-4 border border-gray-100">
                        <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Mail className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <p className="text-gray-500 text-sm">support@artbook.com</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-3xl text-center space-y-4 border border-gray-100">
                        <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Phone className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Phone</h3>
                        <p className="text-gray-500 text-sm">Mon-Fri from 8am to 5pm.</p>
                        <p className="text-purple-600 font-medium">+1 (555) 000-0000</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-3xl text-center space-y-4 border border-gray-100">
                        <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <MapPin className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Office</h3>
                        <p className="text-gray-500 text-sm">123 Art Avenue<br />New York, NY 10012</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
