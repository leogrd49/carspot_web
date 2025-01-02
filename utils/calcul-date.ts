import { useState, useEffect } from 'react';
import { getHours, getMonth } from 'date-fns';

interface Request {
  id: number;
  created_at: string;
}

interface UseDataFilterResult {
  filteredData: Request[];
  setSelectedMonth: (month: string) => void;
  setSelectedTimeSlot: (timeSlot: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export const useDataFilter = (data: Request[]): UseDataFilterResult => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredData, setFilteredData] = useState<Request[]>(data);

  const filterByMonthAndTime = (items: Request[]) => {
    return items.filter(item => {
      const date = new Date(item.created_at);
      const hour = getHours(date);
      const month = getMonth(date);

      const monthMatch = selectedMonth === 'all' || month === parseInt(selectedMonth);
      
      let timeMatch = selectedTimeSlot === 'all';
      
      if (!timeMatch) {
        switch (selectedTimeSlot) {
          case 'morning':
            timeMatch = hour >= 6 && hour < 12;
            break;
          case 'afternoon':
            timeMatch = hour >= 12 && hour < 18;
            break;
          case 'evening':
            timeMatch = hour >= 18 && hour < 23;
            break;
          case 'night':
            timeMatch = hour >= 23 || hour < 6;
            break;
        }
      }

      return monthMatch && timeMatch;
    });
  };

  const sortData = (items: Request[]) => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  useEffect(() => {
    let result = filterByMonthAndTime(data);
    result = sortData(result);
    setFilteredData(result);
  }, [data, selectedMonth, selectedTimeSlot, sortOrder]);

  return {
    filteredData,
    setSelectedMonth,
    setSelectedTimeSlot,
    setSortOrder
  };
};