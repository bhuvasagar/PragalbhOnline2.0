import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import { Service } from '../types';

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, isDarkMode }) => {
    const { addService } = useServices();
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        documents: '',
        category: 'OTHER'
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const documentsArray = formData.documents
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const newService: Omit<Service, 'id'> = {
            iconName: 'FileText',
            title: {
                EN: language === 'EN' ? formData.title : formData.title,
                GU: language === 'GU' ? formData.title : formData.title,
                HI: language === 'HI' ? formData.title : formData.title
            },
            description: {
                EN: language === 'EN' ? formData.description : formData.description,
                GU: language === 'GU' ? formData.description : formData.description,
                HI: language === 'HI' ? formData.description : formData.description
            },
            category: formData.category as any,
            documents: {
                EN: language === 'EN' ? documentsArray : documentsArray,
                GU: language === 'GU' ? documentsArray : documentsArray,
                HI: language === 'HI' ? documentsArray : documentsArray
            }
        };

        addService(newService);

        // Reset and close
        setFormData({
            title: '',
            description: '',
            documents: '',
            category: 'OTHER'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className={`p-4 sm:p-6 border-b flex justify-between items-center gap-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Add New Service</h2>
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-4">
                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Service Title</label>
                        <input
                            type="text"
                            required
                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                            placeholder="e.g. New Ration Card"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                        <textarea
                            required
                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                            placeholder="Brief description of the service"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
                        <select
                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="CERTIFICATE">Certificate</option>
                            <option value="ASSISTANCE">Assistance</option>
                            <option value="ONLINE">Online</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Required Documents (One per line)</label>
                        <textarea
                            required
                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                            placeholder="e.g. Aadhaar Card&#10;Pan Card&#10;Photo"
                            rows={5}
                            value={formData.documents}
                            onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                        />
                    </div>

                    <div className="pt-2 sm:pt-4">
                        <button
                            type="submit"
                            className="w-full py-2 sm:py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-shadow shadow-md hover:shadow-lg text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <Upload size={18} /> Add Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceModal;
