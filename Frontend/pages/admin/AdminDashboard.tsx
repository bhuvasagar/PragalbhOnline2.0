import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { useLanguage } from "../../context/LanguageContext";
import { useServices } from "../../context/ServiceContext";
import { Eye, Trash2, CheckCircle, Clock, FileText } from "lucide-react";
import ApplicationDetailsModal from "../../components/admin/ApplicationDetailsModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../context/ToastContext";

const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const { applications, deleteApplication, deleteApplications, updateStatus } =
    useAdmin();
  const { services } = useServices();
  const [selectedApplication, setSelectedApplication] = React.useState<
    any | null
  >(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

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

  const handleViewDetails = (app: any) => {
    setSelectedApplication(app);
    setIsDetailsModalOpen(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(applications.map((app) => app.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleBulkDelete = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Applications",
      message: `Are you sure you want to delete ${selectedIds.size} applications? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteApplications(Array.from(selectedIds));
          setSelectedIds(new Set());
          showToast("Applications deleted successfully", "success");
        } catch (error) {
          console.error("Bulk delete failed", error);
          showToast("Failed to delete applications", "error");
        }
      },
    });
  };

  const handleSingleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Application",
      message:
        "Are you sure you want to delete this record? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteApplication(id);
          showToast("Application deleted successfully", "success");
        } catch (error) {
          console.error("Delete failed", error);
          showToast("Failed to delete application", "error");
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                Total Applications
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {applications.length}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex-shrink-0">
              <FileText size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                Pending
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-500 mt-1">
                {applications.filter((app) => app.status === "pending").length}
              </h3>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-lg flex-shrink-0">
              <Clock size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                {t("admin.completed") || "Completed"}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-500 mt-1">
                {
                  applications.filter((app) => app.status === "completed")
                    .length
                }
              </h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-lg flex-shrink-0">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
              {t("admin.recent_applications") || "Recent Applications"}
            </h2>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 size={16} />
                Delete ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="p-6 sm:p-12 text-center text-slate-500 dark:text-slate-400">
            {t("admin.no_applications") || "No applications recorded yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="pl-4 sm:pl-6 py-3 sm:py-4 w-4">
                    <input
                      type="checkbox"
                      checked={
                        applications.length > 0 &&
                        selectedIds.size === applications.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {t("admin.date_time") || "Date & Time"}
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {t("admin.customer") || "Customer"}
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                    {t("admin.service") || "Service"}
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {t("admin.status") || "Status"}
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right whitespace-nowrap">
                    {t("admin.actions") || "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="pl-4 sm:pl-6 py-3 sm:py-4 w-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(app.id)}
                        onChange={() => handleSelect(app.id)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                      <div className="hidden sm:block">
                        {formatDate(app.date)}
                      </div>
                      <div className="sm:hidden text-xs">
                        {new Date(app.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 min-w-0">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {app.customerName || "N/A"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {app.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hidden sm:table-cell truncate">
                      {(() => {
                        const service = services.find(
                          (s) => s.id === app.serviceId
                        );
                        return service
                          ? service.title[language] ||
                              service.title["EN"] ||
                              app.serviceName
                          : app.serviceName;
                      })()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}
                      >
                        {app.status === "completed" ? "Done" : "Pending"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        {/* Toggle Status */}
                        <button
                          title={`Mark as ${
                            app.status === "pending" ? "Completed" : "Pending"
                          }`}
                          onClick={() =>
                            updateStatus(
                              app.id,
                              app.status === "pending" ? "completed" : "pending"
                            )
                          }
                          className={`p-2 sm:p-1.5 rounded-md transition-colors ${
                            app.status === "completed"
                              ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                        >
                          {app.status === "pending" ? (
                            <CheckCircle
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          ) : (
                            <Clock
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          )}
                        </button>

                        {/* View Details */}
                        <button
                          title="View Details"
                          className="p-2 sm:p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          onClick={() => handleViewDetails(app)}
                        >
                          <Eye size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          title="Delete Record"
                          onClick={() => handleSingleDelete(app.id)}
                          className="p-2 sm:p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                          <Trash2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplicationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        application={selectedApplication}
      />

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

export default AdminDashboard;
