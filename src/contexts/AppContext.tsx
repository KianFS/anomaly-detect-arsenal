import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Detection, FileStatus } from '../types';
import { createBaseline, scanDirectory } from '../services/fileSystemService';

interface AppContextType {
  detections: Detection[];
  fileStatus: FileStatus;
  isMonitoring: boolean;
  toggleMonitoring: () => void;
  createNewBaseline: (path: string) => Promise<void>;
  performScan: (path: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fileStatus, setFileStatus] = useState<FileStatus>({
    isMonitoring: false,
    baselinePath: '',
    lastScan: new Date().toISOString()
  });
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const createNewBaseline = async (path: string) => {
    try {
      await createBaseline(path);
      setFileStatus(prev => ({
        ...prev,
        baselinePath: path,
        lastScan: new Date().toISOString()
      }));
      alert('Baseline created successfully');
    } catch (error) {
      console.error('Error creating baseline:', error);
      throw error;
    }
  };

  const performScan = async (path: string) => {
    try {
      const newDetections = await scanDirectory(path);
      setDetections(newDetections);
      setFileStatus(prev => ({
        ...prev,
        lastScan: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error scanning directory:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        detections,
        fileStatus,
        isMonitoring,
        toggleMonitoring,
        createNewBaseline,
        performScan
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};