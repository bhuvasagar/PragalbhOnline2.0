import React, { useState, useEffect, useRef } from "react";
import { Star, MessageSquare, X, Send, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import api from "../lib/client";
import StarRating from "./StarRating";
import { useToast } from "../context/ToastContext";

const Testimonials: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure we have enough items for a smooth marquee (at least 6 or more)
  const [displayReviews, setDisplayReviews] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    content: "",
    language: "EN",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/reviews");
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    if (reviews.length > 0) {
      let repeated = [...reviews];
      // Repeat until we have enough items for smoother scrolling on wide screens
      while (repeated.length < 6) {
        repeated = [...repeated, ...reviews];
      }
      // Double the final set to ensure perfect 50% loop
      setDisplayReviews([...repeated, ...repeated]);
    }
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/reviews", formData);
      showToast("Review submitted successfully!", "success");
      setIsModalOpen(false);
      setFormData({
        name: "",
        rating: 5,
        content: "",
        language: "EN",
      });
      fetchReviews(); // Refresh list immediately
    } catch (error) {
      console.error("Failed to submit review", error);
      showToast("Failed to submit review. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden"
    >
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">
            {t("section.testimonials") || "What Our Clients Say"}
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg hover:shadow-primary-500/30"
          >
            <MessageSquare size={18} />
            <span className="font-medium">Write a Review</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            {/* Slide Container */}
            <div className="flex animate-scroll w-fit">
              {displayReviews.map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className="w-[85vw] md:w-[33.33vw] lg:w-[25vw] flex-shrink-0 px-2 md:px-4"
                >
                  <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 relative shadow-md h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="text-slate-200 dark:text-slate-700 mb-4 absolute top-4 right-6">
                      <MessageSquare size={32} className="opacity-20" />
                    </div>

                    <div className="mb-4">
                      <StarRating rating={item.rating} readOnly size={18} />
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed flex-grow">
                      "{item.content}"
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Write a Review
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Rating
                </label>
                <div className="flex gap-2 p-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(r) =>
                      setFormData({ ...formData, rating: r })
                    }
                    size={28}
                  />
                </div>
                <p className="text-xs text-slate-500">Click to rate</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Review
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white resize-none"
                  placeholder="Share your experience..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Review
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
