import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import {
  Check,
  X,
  Trash2,
  Star,
  MessageSquare,
  Plus,
  Edit2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import StarRating from "../../components/StarRating";
import { Review } from "../../context/AdminTypes";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../context/ToastContext";

const AdminReviews: React.FC = () => {
  const { reviews, approveReview, deleteReview, addReview, updateReview } =
    useAdmin();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    content: "",
    language: "EN" as "EN" | "GU" | "HI",
  });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOpenModal = () => {
    setEditingReview(null);
    setFormData({
      name: "",
      rating: 5,
      content: "",
      language: "EN",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await updateReview(editingReview._id, { ...formData });
        showToast("Review updated successfully", "success");
      } else {
        await addReview(formData);
        showToast("Review added successfully", "success");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save review", error);
      showToast("Failed to save review", "error");
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Review",
      message: "Are you sure you want to delete this review?",
      onConfirm: async () => {
        try {
          await deleteReview(reviewId);
          showToast("Review deleted successfully", "success");
        } catch (error) {
          console.log("Failed to delete review", error);
          showToast("Failed to delete review", "error");
        }
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Reviews Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage, approve, and edit reviews
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          <span>Add Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <MessageSquare
              size={48}
              className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
            />
            <p className="text-slate-500 dark:text-slate-400">
              No reviews found
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                      {review.name}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                      {review.language}
                    </span>
                    {!review.approved && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <StarRating rating={review.rating} readOnly size={16} />
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">
                    {review.content}
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Submitted on {formatDate(review.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {!review.approved ? (
                    <button
                      onClick={() => approveReview(review._id, true)}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors flex items-center gap-2"
                      title="Approve Review"
                    >
                      <Check size={20} />
                      <span className="hidden sm:inline text-sm font-medium">
                        Show
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => approveReview(review._id, false)}
                      className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors flex items-center gap-2"
                      title="Unapprove Review"
                    >
                      <X size={20} />
                      <span className="hidden sm:inline text-sm font-medium">
                        Hide
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteClick(review._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                    title="Delete Review"
                  >
                    <Trash2 size={20} />
                    <span className="hidden sm:inline text-sm font-medium">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Add New Review
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Reviewer Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Rating
                </label>
                <div className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg flex justify-start bg-slate-50 dark:bg-slate-700/50">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(r) =>
                      setFormData({ ...formData, rating: r })
                    }
                    size={28}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Click to rate (half stars supported)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  placeholder="Review content..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-md shadow-primary-500/20 transition-all"
                >
                  Add Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default AdminReviews;
