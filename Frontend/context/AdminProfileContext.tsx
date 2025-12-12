import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AdminProfile {
    id: string;
    name: string;
    phone: string;
    profileImage: string; // URL or base64
}

interface AdminProfileContextType {
    profile: AdminProfile;
    updateProfile: (profile: AdminProfile) => void;
}

const AdminProfileContext = createContext<AdminProfileContextType | undefined>(undefined);

const DEFAULT_PROFILE: AdminProfile = {
    id: 'admin-001',
    name: 'Sagar Bhuva',
    phone: '+91 98983 29056',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sagar',
};

export const AdminProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<AdminProfile>(DEFAULT_PROFILE);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('pragalbh_admin_profile');
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse admin profile", e);
                setProfile(DEFAULT_PROFILE);
            }
        }
    }, []);

    // Save to local storage whenever profile changes
    useEffect(() => {
        localStorage.setItem('pragalbh_admin_profile', JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (newProfile: AdminProfile) => {
        setProfile(newProfile);
    };

    return (
        <AdminProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </AdminProfileContext.Provider>
    );
};

export const useAdminProfile = () => {
    const context = useContext(AdminProfileContext);
    if (context === undefined) {
        throw new Error('useAdminProfile must be used within an AdminProfileProvider');
    }
    return context;
};
