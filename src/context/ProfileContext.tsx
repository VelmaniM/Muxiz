import React, { createContext, useContext, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { uploadToCloudinary } from '../config/cloudinary';

interface ProfileContextType {
  profileName: string;
  profileHandle: string;
  profileImage: string | null;
  isUploadingAvatar: boolean;
  updateProfileDetails: (name: string, handle: string) => void;
  pickAndUploadAvatar: () => Promise<string | null>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileName, setProfileName] = useState('Velmanikandan');
  const [profileHandle, setProfileHandle] = useState('@X_.stunner07');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const updateProfileDetails = (name: string, handle: string) => {
    if (name.trim()) setProfileName(name.trim());
    if (handle.trim()) setProfileHandle(handle.trim());
  };

  const pickAndUploadAvatar = async (): Promise<string | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      setIsUploadingAvatar(true);

      // Upload image to Cloudinary CDN
      const cloudinaryRes = await uploadToCloudinary(asset.uri, asset.name, 'image');
      const avatarUrl = cloudinaryRes.secure_url;

      setProfileImage(avatarUrl);
      setIsUploadingAvatar(false);
      return avatarUrl;
    } catch (err) {
      console.log('Avatar upload error:', err);
      setIsUploadingAvatar(false);
      return null;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profileName,
        profileHandle,
        profileImage,
        isUploadingAvatar,
        updateProfileDetails,
        pickAndUploadAvatar,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
