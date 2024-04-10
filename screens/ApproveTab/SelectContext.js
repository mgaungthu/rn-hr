// YourContext.js
import React, {createContext, useContext, useState} from 'react';

const SelectContext = createContext();

export const SelectContextProvider = ({children}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState({
    atRequest: [],
    leaveRequest: [],
  });
  const [activeTab, setActiveTab] = useState();
  const [showAll, setShowAll] = useState(false);

  const toggleSelection = itemId => {
    // console.log()
    // console.log(itemId)
    if (activeTab === 'atd-approve') {
      if (selectedItems.includes(itemId)) { 
        let result = selectedItems.filter(id => id !== itemId);
        if (result.length === 0) {
          setShowAll(false);
        }
        setSelectedItems(selectedItems.filter(id => id !== itemId));
      } else {
        setSelectedItems([...selectedItems, itemId]);
      }
    } else {
      if (selectedItems.some(item => Object.values(item).includes(itemId.id))) { 
        let result = selectedItems.filter(value => value.id !== itemId.id)
        if (result.length === 0) {
          setShowAll(false);
        }
        setSelectedItems(selectedItems.filter(value => value.id !== itemId.id));
      } else {
        // console.log(data?.leaveRequest)
        
        setSelectedItems([...selectedItems, itemId]);
      }
    }
  };

  const toggleSelectAll = () => {
    let activeData = [];
    if (activeTab === 'atd-approve') {
      activeData = data.atRequest;
    } else {
      activeData = data.leaveRequest;
    }

    activeData.length === 0 && alert('All items was already approved');
    if (selectedItems.length === activeData.length) {
      setSelectedItems([]);
    } else {
      // Otherwise, select all items excluding those with statusby_manager equal to 1
      const itemsToSelect = activeData.filter(
        item => item.statusby_manager !== 1,
      );
      if (activeTab === 'leaveapprove') {
        const res = itemsToSelect.map(item => {
          const data = {
            id: item.id,
            total_day: item.total_day,
            leave_id: item.leave_id,
          };
          return data;
        });
        setSelectedItems(res);
      } else {
        setSelectedItems(itemsToSelect.map(item => item.id));
      }
    }
  };

  return (
    <SelectContext.Provider
      value={{
        setActiveTab,
        activeTab,
        showAll,
        setShowAll,
        setSelectedItems,
        selectedItems,
        toggleSelection,
        toggleSelectAll,
        setData,
        data,
      }}>
      {children}
    </SelectContext.Provider>
  );
};

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('useSelectContext must be used within a SelectContext');
  }
  return context;
};
