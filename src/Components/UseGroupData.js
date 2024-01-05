// UseGroupData.js Selecting groupdata and storing it

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const useGroupData = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [updatedGroupData, setUpdatedGroupData] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:8000');

    socket.on('selectedGroupUpdate', (updatedGroupData) => {
      const parsedData = JSON.parse(updatedGroupData);
      setSelectedGroup(parsedData);
      setUpdatedGroupData(parsedData);
      localStorage.setItem('selectedGroup', JSON.stringify(parsedData));
    });

    socket.on('groupDataUpdate', (updatedGroupData) => {
      const parsedData = JSON.parse(updatedGroupData);
      setSelectedGroup(parsedData);
      setUpdatedGroupData(parsedData);
      localStorage.setItem('selectedGroup', JSON.stringify(parsedData));
    });

    const storedSelectedGroup = localStorage.getItem('selectedGroup');
    if (storedSelectedGroup) {
      const parsedData = JSON.parse(storedSelectedGroup);
      setSelectedGroup(parsedData);
      setUpdatedGroupData(parsedData);
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return { selectedGroup, updatedGroupData };
};

export default useGroupData;
