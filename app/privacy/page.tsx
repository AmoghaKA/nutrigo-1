"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-lg">
          Last updated: February 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-8 sm:p-10 backdrop-blur-xl space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Introduction
            </h2>
            <p className="text-slate-300 leading-relaxed">
              NutriGo ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          {/* Section: Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Information We Collect
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We collect information in various ways, including information you provide directly and information collected automatically through your use of our Service.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">1. Information You Provide Directly</h3>
                <ul className="text-slate-300 space-y-2 ml-6 list-disc">
                  <li><span className="font-medium">Account Registration:</span> When you create an account, we collect your name, email address, password, date of birth, gender, dietary preferences, and health goals.</li>
                  <li><span className="font-medium">Food Scans:</span> When you scan packaged foods, we collect images of product barcodes, product information, and your scan history.</li>
                  <li><span className="font-medium">Health Data:</span> Information about your dietary restrictions, allergies, health conditions, weight, height, activity level, and fitness goals.</li>
                  <li><span className="font-medium">Communications:</span> When you contact us, we collect your messages, feedback, and correspondence.</li>
                  <li><span className="font-medium">Payment Information:</span> If you make purchases, we collect billing name, address, payment method details (processed securely through third-party providers).</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">2. Information Collected Automatically</h3>
                <ul className="text-slate-300 space-y-2 ml-6 list-disc">
                  <li><span className="font-medium">Device Information:</span> Device type, operating system, unique device identifiers, IP address, and browser information.</li>
                  <li><span className="font-medium">Usage Data:</span> Features used, scan history, time spent in the app, pages visited, and user interactions.</li>
                  <li><span className="font-medium">Location Data:</span> Approximate location derived from IP address (we do not access precise GPS location without consent).</li>
                  <li><span className="font-medium">Cookies & Tracking:</span> We use cookies, pixel tags, and similar tracking technologies to enhance user experience.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              How We Use Your Information
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use the information collected for purposes including but not limited to:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Providing, maintaining, and improving our Service</li>
              <li>Creating and managing your account</li>
              <li>Delivering personalized nutrition recommendations and health insights</li>
              <li>Processing transactions and sending billing information</li>
              <li>Responding to inquiries, requests, and customer support</li>
              <li>Sending promotional emails and marketing communications (with opt-out option)</li>
              <li>Analyzing usage patterns to improve user experience</li>
              <li>Detecting and preventing fraud, abuse, and security incidents</li>
              <li>Complying with legal obligations and enforcing our Terms of Service</li>
              <li>Conducting research and analytics</li>
            </ul>
          </section>

          {/* Section: Legal Basis for Processing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Legal Basis for Processing (GDPR)
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              For users in the EU, we process your data based on:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Your explicit consent</li>
              <li>Performance of our contract with you</li>
              <li>Compliance with legal obligations</li>
              <li>Protection of vital interests</li>
              <li>Our legitimate business interests</li>
            </ul>
          </section>

          {/* Section: Sharing Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Sharing Your Information
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We do not sell your personal information. However, we may share your information in the following circumstances:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li><span className="font-medium">Service Providers:</span> With third-party vendors who perform services on our behalf (hosting, analytics, payment processing, customer support).</li>
              <li><span className="font-medium">Business Partners:</span> With partners to provide integrated services or features you request.</li>
              <li><span className="font-medium">Legal Requirements:</span> When required by law, court order, or government request.</li>
              <li><span className="font-medium">Business Transfers:</span> In the event of merger, acquisition, bankruptcy, or sale of assets.</li>
              <li><span className="font-medium">With Your Consent:</span> When you explicitly agree to share information.</li>
              <li><span className="font-medium">Aggregated Data:</span> We may share anonymized, aggregated statistics for research and marketing purposes.</li>
            </ul>
          </section>

          {/* Section: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Data Security
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We implement comprehensive security measures to protect your information:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>End-to-end encryption for sensitive data transmission</li>
              <li>Secure password hashing and salting</li>
              <li>SSL/TLS encryption for data in transit</li>
              <li>Access controls and role-based permissions</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Secure data storage with encryption at rest</li>
              <li>Employee training on data privacy and security</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              <span className="text-emerald-300">However,</span> no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section: Your Rights and Choices */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Your Rights and Choices
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Depending on your location, you may have rights regarding your personal information:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li><span className="font-medium">Access:</span> Right to request and obtain a copy of your personal data.</li>
              <li><span className="font-medium">Correction:</span> Right to request correction of inaccurate information.</li>
              <li><span className="font-medium">Deletion:</span> Right to request deletion of your data (subject to legal retention requirements).</li>
              <li><span className="font-medium">Portability:</span> Right to receive your data in a portable format.</li>
              <li><span className="font-medium">Opt-Out:</span> Right to opt-out of marketing communications and data processing for non-essential purposes.</li>
              <li><span className="font-medium">Objection:</span> Right to object to certain types of data processing.</li>
              <li><span className="font-medium">Withdraw Consent:</span> Right to withdraw consent at any time.</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@nutrigo.ai with proof of identity.
            </p>
          </section>

          {/* Section: Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Cookies and Tracking Technologies
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Maintain user sessions and remember preferences</li>
              <li>Analyze usage patterns and improve the Service</li>
              <li>Deliver personalized content and advertisements</li>
              <li>Detect and prevent fraud</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              You can control cookie preferences through your browser settings. Note that disabling cookies may affect functionality.
            </p>
          </section>

          {/* Section: Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Third-Party Links and Services
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Our Service may contain links to third-party websites and services not operated by us. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review their privacy policies before providing personal information.
            </p>
          </section>

          {/* Section: Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Children's Privacy
            </h2>
            <p className="text-slate-300 leading-relaxed">
              NutriGo is not intended for children under 13 (or the applicable legal age in your jurisdiction). We do not knowingly collect personal information from children. If we discover we have collected information from a child, we will delete it promptly. Parents or guardians concerned about their child's information should contact us immediately.
            </p>
          </section>

          {/* Section: Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Data Retention
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide services and fulfill the purposes outlined in this policy. Retention periods vary by data type:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li><span className="font-medium">Account Data:</span> Retained while account is active, deleted within 30 days of closure (unless required by law).</li>
              <li><span className="font-medium">Health Data:</span> Retained for 3 years to provide historical insights.</li>
              <li><span className="font-medium">Scan History:</span> Retained per user preference or 2 years from last scan.</li>
              <li><span className="font-medium">Marketing Data:</span> Retained until you unsubscribe.</li>
              <li><span className="font-medium">Legal/Compliance Data:</span> Retained as required by law.</li>
            </ul>
          </section>

          {/* Section: International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              International Data Transfers
            </h2>
            <p className="text-slate-300 leading-relaxed">
              NutriGo is based in India. Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have different data protection laws than your home country. By using NutriGo, you consent to the transfer of your information to countries outside your country of residence.
            </p>
          </section>

          {/* Section: California Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              California Consumer Privacy Act (CCPA)
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you are a California resident, you have rights under the CCPA:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Right to know what personal information is collected, used, and shared</li>
              <li>Right to delete personal information (with exceptions)</li>
              <li>Right to opt-out of personal information sales or sharing</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              To submit CCPA requests, contact privacy@nutrigo.ai and verify your identity.
            </p>
          </section>

          {/* Section: Updates to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Updates to This Privacy Policy
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by updating the "Last Updated" date or sending you a notification. Your continued use of NutriGo constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section: Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Contact Us
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-emerald-500/20 space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-medium">privacy@nutrigo.ai</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Support Email</p>
                <p className="text-white font-medium">support@nutrigo.ai</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Mailing Address</p>
                <p className="text-white font-medium">NutriGo<br />India</p>
              </div>
            </div>
          </section>

          {/* Section: Data Protection Officer */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Data Protection Officer
            </h2>
            <p className="text-slate-300 leading-relaxed">
              For privacy-related inquiries, you can also contact our Data Protection Officer directly at dpo@nutrigo.ai for assistance with your privacy concerns.
            </p>
          </section>

          {/* Effective Date */}
          <div className="pt-8 border-t border-emerald-500/20">
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-slate-300">Effective Date:</span> February 10, 2026
            </p>
            <p className="text-slate-400 text-sm mt-2">
              <span className="font-semibold text-slate-300">Last Updated:</span> February 24, 2026
            </p>
            <p className="text-slate-400 text-sm mt-4">
              <span className="font-semibold text-slate-300">Version:</span> 1.0
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-slate-400">
            Have privacy questions?{" "}
            <Link href="/#contact" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Contact our DPO
            </Link>
          </p>
          <Link href="/" className="inline-block">
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
