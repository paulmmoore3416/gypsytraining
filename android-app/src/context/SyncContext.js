import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncAPI, trainingAPI, journalAPI, photoAPI, nutritionAPI } from '../services/api';
import * as Device from 'expo-device';

const SyncContext = createContext({});

export const useSync = () => useContext(SyncContext);

export const SyncProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    loadLastSyncTime();
  }, []);

  const loadLastSyncTime = async () => {
    try {
      const lastSync = await AsyncStorage.getItem('lastSyncTime');
      if (lastSync) {
        setLastSyncTime(new Date(lastSync));
      }
    } catch (error) {
      console.error('Error loading last sync time:', error);
    }
  };

  const performFullSync = async () => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      // Get all data from server
      const response = await syncAPI.fullSync();
      const serverData = response.data.data;

      // Store data locally
      await AsyncStorage.setItem('trainingSessions', JSON.stringify(serverData.trainingSessions || []));
      await AsyncStorage.setItem('trainingProgress', JSON.stringify(serverData.trainingProgress || []));
      await AsyncStorage.setItem('journalEntries', JSON.stringify(serverData.journalEntries || []));
      await AsyncStorage.setItem('photoAlbums', JSON.stringify(serverData.photoAlbums || []));
      await AsyncStorage.setItem('nutritionLogs', JSON.stringify(serverData.nutritionLogs || []));

      const now = new Date().toISOString();
      await AsyncStorage.setItem('lastSyncTime', now);
      setLastSyncTime(new Date(now));

      // Record sync metadata
      const deviceId = Device.modelName || 'unknown';
      await syncAPI.recordMetadata(deviceId, 'full');

      return { success: true };
    } catch (error) {
      console.error('Full sync error:', error);
      setSyncError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const performIncrementalSync = async () => {
    if (!lastSyncTime) {
      return performFullSync();
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const response = await syncAPI.incrementalSync(lastSyncTime.toISOString());
      const serverData = response.data.data;

      // Merge server data with local data
      await mergeData('trainingSessions', serverData.trainingSessions);
      await mergeData('trainingProgress', serverData.trainingProgress);
      await mergeData('journalEntries', serverData.journalEntries);
      await mergeData('photoAlbums', serverData.photoAlbums);
      await mergeData('nutritionLogs', serverData.nutritionLogs);

      const now = new Date().toISOString();
      await AsyncStorage.setItem('lastSyncTime', now);
      setLastSyncTime(new Date(now));

      const deviceId = Device.modelName || 'unknown';
      await syncAPI.recordMetadata(deviceId, 'incremental');

      return { success: true };
    } catch (error) {
      console.error('Incremental sync error:', error);
      setSyncError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const mergeData = async (key, newData) => {
    const existingDataStr = await AsyncStorage.getItem(key);
    const existingData = existingDataStr ? JSON.parse(existingDataStr) : [];

    const mergedData = [...existingData];

    newData.forEach((newItem) => {
      const index = mergedData.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        mergedData[index] = newItem;
      } else {
        mergedData.push(newItem);
      }
    });

    await AsyncStorage.setItem(key, JSON.stringify(mergedData));
  };

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        lastSyncTime,
        syncError,
        performFullSync,
        performIncrementalSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};
