"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CookiesPolicy() {
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
          Cookies Policy
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
              This Cookies Policy ("Policy") explains how NutriGo uses cookies and similar tracking technologies on our website and mobile application. Cookies are small text files stored on your device that help us provide a better experience. We encourage you to read this policy to understand our cookie practices.
            </p>
          </section>

          {/* Section: What Are Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              What Are Cookies?
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Cookies are small files placed on your device when you visit websites. They contain information about your browsing activity and preferences. Types of cookies include:
            </p>
            <ul className="text-slate-300 space-y-3 ml-6 list-disc">
              <li><span className="font-medium">Session Cookies:</span> Created for the duration of your visit and deleted when you close your browser.</li>
              <li><span className="font-medium">Persistent Cookies:</span> Remain on your device for a specified period or until you delete them manually.</li>
              <li><span className="font-medium">First-Party Cookies:</span> Set directly by NutriGo.</li>
              <li><span className="font-medium">Third-Party Cookies:</span> Set by third-party services integrated with our platform.</li>
            </ul>
          </section>

          {/* Section: How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              How We Use Cookies
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use cookies for various purposes to enhance your experience:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2 text-emerald-300">Essential Cookies</h3>
                <p className="text-slate-300 ml-2">
                  These cookies are necessary for core functionality:
                </p>
                <ul className="text-slate-300 space-y-1 ml-6 list-disc mt-2">
                  <li>User authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Basic website functionality</li>
                  <li>Remembering user preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2 text-emerald-300">Performance & Analytics Cookies</h3>
                <p className="text-slate-300 ml-2">
                  These cookies help us understand how you use NutriGo:
                </p>
                <ul className="text-slate-300 space-y-1 ml-6 list-disc mt-2">
                  <li>Analyzing page visits and user behavior</li>
                  <li>Measuring feature performance</li>
                  <li>Identifying technical issues</li>
                  <li>Gathering usage statistics</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2 text-emerald-300">Functional Cookies</h3>
                <p className="text-slate-300 ml-2">
                  These cookies enhance user experience:
                </p>
                <ul className="text-slate-300 space-y-1 ml-6 list-disc mt-2">
                  <li>Remembering login information and preferences</li>
                  <li>Personalizing content and recommendations</li>
                  <li>Saving user settings</li>
                  <li>Enabling chat and communication features</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2 text-emerald-300">Marketing & Advertising Cookies</h3>
                <p className="text-slate-300 ml-2">
                  These cookies support our marketing efforts:
                </p>
                <ul className="text-slate-300 space-y-1 ml-6 list-disc mt-2">
                  <li>Displaying targeted advertisements</li>
                  <li>Tracking conversion and campaign performance</li>
                  <li>Measuring advertising effectiveness</li>
                  <li>Retargeting users based on interests</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Third-Party Cookies
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We partner with third-party services that place cookies on your device:
            </p>
            <ul className="text-slate-300 space-y-3 ml-6 list-disc">
              <li><span className="font-medium">Google Analytics:</span> For understanding user behavior and website performance.</li>
              <li><span className="font-medium">Payment Providers:</span> For secure payment processing.</li>
              <li><span className="font-medium">Social Media Platforms:</span> For integration with social features.</li>
              <li><span className="font-medium">Advertising Networks:</span> For targeted advertising and retargeting.</li>
              <li><span className="font-medium">Customer Support Tools:</span> For chat and support services.</li>
              <li><span className="font-medium">CDNs and Hosting:</span> For content delivery and performance optimization.</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              These third parties have their own privacy policies. We encourage you to review their policies for more information.
            </p>
          </section>

          {/* Section: Specific Cookies We Use */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Specific Cookies We Use
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Here's a table of common cookies we use:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-slate-300 text-sm">
                <thead className="border-b border-emerald-500/30">
                  <tr>
                    <th className="text-left py-3 px-3 font-semibold text-white">Cookie Name</th>
                    <th className="text-left py-3 px-3 font-semibold text-white">Type</th>
                    <th className="text-left py-3 px-3 font-semibold text-white">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  <tr>
                    <td className="py-3 px-3">nutrigo_session</td>
                    <td className="py-3 px-3">Session</td>
                    <td className="py-3 px-3">User authentication</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3">nutrigo_preferences</td>
                    <td className="py-3 px-3">Persistent</td>
                    <td className="py-3 px-3">User preferences & theme</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3">_ga</td>
                    <td className="py-3 px-3">Third-Party</td>
                    <td className="py-3 px-3">Google Analytics tracking</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3">csrf_token</td>
                    <td className="py-3 px-3">Session</td>
                    <td className="py-3 px-3">Security protection</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3">nutrigo_marketing</td>
                    <td className="py-3 px-3">Persistent</td>
                    <td className="py-3 px-3">Marketing analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Tracking Technologies Beyond Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Other Tracking Technologies
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We also use technologies similar to cookies:
            </p>
            <ul className="text-slate-300 space-y-3 ml-6 list-disc">
              <li><span className="font-medium">Pixel Tags:</span> Invisible images that track page visits and user actions.</li>
              <li><span className="font-medium">Web Beacons:</span> Used in emails to track open rates and click-through rates.</li>
              <li><span className="font-medium">Local Storage:</span> Browser storage for user preferences and data.</li>
              <li><span className="font-medium">Device Identifiers:</span> Unique identifiers for mobile app tracking.</li>
            </ul>
          </section>

          {/* Section: Your Cookie Choices */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Your Cookie Choices
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              You have several options to control cookies:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Browser Settings</h3>
                <p className="text-slate-300">
                  Most browsers allow you to control cookie preferences. You can:
                </p>
                <ul className="text-slate-300 space-y-1 ml-6 list-disc mt-2">
                  <li>Accept or reject all cookies</li>
                  <li>Accept only essential cookies</li>
                  <li>Delete existing cookies</li>
                  <li>Set specific sites to allow or block cookies</li>
                </ul>
                <p className="text-slate-300 text-sm mt-3 text-emerald-300">
                  Note: Disabling cookies may affect website functionality and your user experience.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Cookie Consent Banner</h3>
                <p className="text-slate-300">
                  When you first visit NutriGo, we display a cookie consent banner. You can adjust your preferences including acceptance of non-essential cookies.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Do Not Track (DNT)</h3>
                <p className="text-slate-300">
                  Some browsers include a "Do Not Track" feature. While we aim to respect DNT signals, we cannot guarantee all tracking will be disabled as this depends on third-party services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Opt-Out Options</h3>
                <p className="text-slate-300">
                  You can opt-out of targeted advertising by:
                </p>
                <ul className="text-slate-300 space-y-1 ml-6 list-disc mt-2">
                  <li>Adjusting your account privacy settings</li>
                  <li>Using Google Ads Settings or Network Advertising Initiative</li>
                  <li>Contacting us directly at privacy@nutrigo.ai</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Cookie Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Cookie Retention
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We retain cookies for different periods based on type:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li><span className="font-medium">Essential Cookies:</span> For the duration of your session or as needed for security</li>
              <li><span className="font-medium">Functional Cookies:</span> Up to 1 year from last use</li>
              <li><span className="font-medium">Analytics Cookies:</span> Up to 2 years</li>
              <li><span className="font-medium">Marketing Cookies:</span> Up to 1 year or until opt-out</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              You can delete cookies manually through your browser at any time.
            </p>
          </section>

          {/* Section: EU/UK Specific Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              EU and UK Users
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Under the ePrivacy Directive and GDPR:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>We obtain your explicit consent for non-essential cookies before placing them</li>
              <li>You have the right to withdraw consent at any time</li>
              <li>Essential cookies are placed without consent</li>
              <li>You can reject non-essential cookies and still use basic features</li>
            </ul>
          </section>

          {/* Section: California Users */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              California Users (CCPA)
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Under the California Consumer Privacy Act:
            </p>
            <ul className="text-slate-300 space-y-2 ml-6 list-disc">
              <li>You have the right to know what cookies are being used</li>
              <li>You can opt-out of non-essential cookie usage</li>
              <li>You have the right to delete cookie data</li>
              <li>We do not sell cookie-based data</li>
            </ul>
          </section>

          {/* Section: Security of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Security of Cookies
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We take cookie security seriously. Cookies containing sensitive information are encrypted using HTTPS, and we implement security measures to protect against unauthorized access. However, no method of transmission is entirely risk-free. Please report any security concerns to security@nutrigo.ai.
            </p>
          </section>

          {/* Section: Updating This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Updates to This Policy
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Cookies Policy periodically. Material changes will be communicated via email or a prominent notice on our website. Your continued use of NutriGo indicates acceptance of updates.
            </p>
          </section>

          {/* Section: Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Contact Us
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Questions about our cookie practices? Contact us:
            </p>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-emerald-500/20 space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Privacy Email</p>
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
            Questions about cookies?{" "}
            <Link href="/#contact" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Get in touch
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
