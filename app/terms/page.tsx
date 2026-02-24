"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-slate-400 text-lg">
          Last updated: February 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-8 sm:p-10 backdrop-blur-xl space-y-8">
          {/* Section: Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Acceptance of Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Welcome to NutriGo ("Service"). By accessing or using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must discontinue use of our Service immediately.
            </p>
          </section>

          {/* Section: Description of Service */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Description of Service
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              NutriGo is an AI-powered food scanning and nutrition analysis platform that helps users understand the nutritional content, ingredients, and health impacts of packaged foods. Our Service includes:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Food scanning and nutritional analysis</li>
              <li>Personalized health recommendations</li>
              <li>Product alternatives and comparisons</li>
              <li>Dietary tracking and insights</li>
              <li>Educational content about nutrition</li>
            </ul>
          </section>

          {/* Section: User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              User Accounts
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              To access certain features of NutriGo, you may be required to create an account. When creating an account, you agree to:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the confidentiality of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be at least 13 years of age (or legal age in your jurisdiction)</li>
            </ul>
          </section>

          {/* Section: User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              User Responsibilities
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              You agree not to use NutriGo for any unlawful purposes or in any way that could damage, disable, or impair our Service. Specifically, you will not:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Violate any applicable laws or regulations</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Create multiple accounts to circumvent limitations</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Upload malware or harmful content</li>
              <li>Reverse engineer, decompile, or disassemble our Service</li>
              <li>Use automated tools to scrape or collect data</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          {/* Section: Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Intellectual Property Rights
            </h2>
            <p className="text-slate-300 leading-relaxed">
              All content, features, and functionality of NutriGo, including but not limited to text, graphics, logos, images, and software, are the exclusive property of NutriGo or its licensors. You are granted a non-exclusive, non-transferable, revocable license to use our Service for personal, non-commercial purposes only. You may not reproduce, modify, distribute, transmit, or display any content without our prior written permission.
            </p>
          </section>

          {/* Section: Medical Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Medical Disclaimer
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              <span className="font-semibold text-emerald-300">Important:</span> NutriGo is designed for informational and educational purposes only. Our Service is NOT a substitute for professional medical advice, diagnosis, or treatment. Please note:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Always consult with a qualified healthcare professional before making significant dietary changes</li>
              <li>Information provided is based on product labeling and may not account for individual health conditions</li>
              <li>Nutritional recommendations are general and may not be suitable for everyone</li>
              <li>We are not liable for any adverse health effects or allergic reactions</li>
              <li>If you have medical concerns, please seek professional medical advice</li>
            </ul>
          </section>

          {/* Section: Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Disclaimer of Warranties
            </h2>
            <p className="text-slate-300 leading-relaxed">
              NutriGo is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We disclaim all warranties including, but not limited to, merchantability, fitness for a particular purpose, and non-infringement. While we strive for accuracy, we do not warrant that:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc mt-4">
              <li>The Service will be error-free or uninterrupted</li>
              <li>Nutritional data will be 100% accurate</li>
              <li>The Service will meet your specific requirements</li>
              <li>Results will be accurate or reliable</li>
            </ul>
          </section>

          {/* Section: Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Limitation of Liability
            </h2>
            <p className="text-slate-300 leading-relaxed">
              To the maximum extent permitted by law, NutriGo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or use, even if we have been advised of the possibility of such damages. Our liability is limited to the amount you paid for the Service in the past 12 months, or $100, whichever is less.
            </p>
          </section>

          {/* Section: Third-Party Content */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Third-Party Content and Links
            </h2>
            <p className="text-slate-300 leading-relaxed">
              NutriGo may contain links to third-party websites and services that are not operated by us. We are not responsible for the content, accuracy, or practices of third-party sites. Your use of third-party sites is subject to their terms and policies. We do not endorse any third-party products or services.
            </p>
          </section>

          {/* Section: User-Generated Content */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              User-Generated Content
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you submit feedback, comments, or suggestions about NutriGo, you grant us a non-exclusive, perpetual license to use such content without compensation or attribution. You represent that you own or have the right to use any content you submit.
            </p>
          </section>

          {/* Section: Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Privacy
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information. By using NutriGo, you consent to our collection and use of information as described in our Privacy Policy.
            </p>
          </section>

          {/* Section: Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Indemnification
            </h2>
            <p className="text-slate-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless NutriGo and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Section: Modification of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Modification of Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              NutriGo reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of the Service constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically to stay informed of any changes.
            </p>
          </section>

          {/* Section: Termination */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Termination
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may terminate or suspend your account and access to NutriGo immediately, without prior notice or liability, for any reason including if you violate these Terms. Upon termination:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>Your right to use the Service will cease immediately</li>
              <li>We may delete your account data</li>
              <li>You remain liable for all obligations under these Terms</li>
            </ul>
          </section>

          {/* Section: Severability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Severability
            </h2>
            <p className="text-slate-300 leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, such provision will be modified to the minimum extent necessary to make it valid, or if that is not possible, severed. The remaining Terms will continue in full force and effect.
            </p>
          </section>

          {/* Section: Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Governing Law
            </h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of laws principles. You agree to submit to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          {/* Section: Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Contact Us
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-emerald-500/20 space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-medium">support@nutrigo.ai</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Mailing Address</p>
                <p className="text-white font-medium">NutriGo<br />India</p>
              </div>
            </div>
          </section>

          {/* Section: Entire Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Entire Agreement
            </h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms of Service, together with our Privacy Policy and any other policies we publish, constitute the entire agreement between you and NutriGo regarding your use of the Service. These Terms supersede all prior agreements, whether written or oral.
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
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-slate-400">
            Have more questions?{" "}
            <Link href="/#contact" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Get in touch with us
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
