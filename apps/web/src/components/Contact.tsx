"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import { Send, MapPin, Mail, Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { socialsData } from "@/data/socials";
import { api } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(4, "Subject must be at least 4 characters long"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await api.submitContact(data);
      setSubmitSuccess(true);
      
      // Success Confetti celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      reset();
    } catch (error: any) {
      setSubmitError(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-slate-50 dark:bg-bg-dark border-t border-slate-200 dark:border-slate-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-850 inline-block uppercase tracking-wider">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Let's Collaborate
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Have a project or opportunity? Send a message and let's construct something premium together.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold">Contact Details</h3>
            <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
              Feel free to send a message here, email directly, or check my calendar availability windows.
            </p>

            <div className="space-y-4">
              {/* Location Card */}
              <div className="flex gap-4 p-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Location</h4>
                  <p className="text-sm font-semibold">{socialsData.location}</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex gap-4 p-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Direct Email</h4>
                  <p className="text-sm font-semibold">
                    <a href={`mailto:${socialsData.email}`} className="hover:text-violet-500 transition-colors">
                      {socialsData.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours / Schedule Card */}
              <div className="flex gap-4 p-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Working Hours</h4>
                  <p className="text-sm font-semibold">{socialsData.workingHours} ({socialsData.timezone})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-sm">
            {submitSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 border border-emerald-100 dark:border-emerald-900/60 shadow">
                  <CheckCircle2 size={42} />
                </div>
                <h3 className="text-2xl font-bold">Message Transmitted!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Thank you for reaching out. I have received your details and will follow up in 24 hours.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-350 dark:border-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-450">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      {...register("name")}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/60 border ${
                        errors.name ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 focus:border-violet-500"
                      } text-slate-900 dark:text-white placeholder-slate-450 outline-none transition-colors`}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-450">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="jane@company.com"
                      {...register("email")}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/60 border ${
                        errors.email ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 focus:border-violet-500"
                      } text-slate-900 dark:text-white placeholder-slate-455 outline-none transition-colors`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-450">
                    Subject / Project type
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="SaaS Dashboard bootstrapping proposal"
                    {...register("subject")}
                    className={`w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/60 border ${
                      errors.subject ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 focus:border-violet-500"
                    } text-slate-900 dark:text-white placeholder-slate-450 outline-none transition-colors`}
                  />
                  {errors.subject && (
                    <p className="text-xs text-rose-500 font-medium">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-450">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Detailed explanation of your goals..."
                    {...register("message")}
                    className={`w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/60 border ${
                      errors.message ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-slate-800 focus:border-violet-500"
                    } text-slate-900 dark:text-white placeholder-slate-450 outline-none transition-colors resize-none`}
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-500 font-medium">{errors.message.message}</p>
                  )}
                </div>

                {/* Error display */}
                {submitError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <p>{submitError}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all cursor-pointer active:scale-[0.98]"
                >
                  {isSubmitting ? "Transmitting..." : "Send Message"}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
