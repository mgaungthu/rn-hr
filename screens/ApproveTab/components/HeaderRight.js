import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {horizontalScale, verticalScale} from '../../../assets/styles/scaling';
import {useSelectContext} from '../SelectContext';
import {
  ApproveOverTime,
  approveAttendanceRequest,
  approveListConfirm,
} from '../../../api';
import {useSelector} from 'react-redux';

const HeaderRight = ({navigation}) => {
  const {
    showAll,
    setShowAll,
    setSelectedItems,
    selectedItems,
    toggleSelection,
    toggleSelectAll,
    data,
    setData,
    activeTab,
  } = useSelectContext();

  [loading, setLoading] = useState(false);

  const {access_token, user_info} = useSelector(state => state.user);

  useEffect(() => {
    //  console.log(activeTab)
    setSelectedItems([]);
    setShowAll(false);
  }, [activeTab]);

  if (!user_info.approved_person) {
    return null;
  }

  return (
    <View style={styles.btnWrapper}>
      {showAll ? (
        <>
          <Pressable onPress={() => toggleSelectAll()}>
            <Text style={styles.text}>
              Select {selectedItems.length > 0 ? selectedItems.length : 'all'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (selectedItems.length === 0) {
                alert('Please select items');
              } else {
                Alert.alert(
                  'Are your sure?',
                  'Are you sure you want to approve?',
                  [
                    // The "Yes" button
                    {
                      text: 'Yes',
                      onPress: () => {
                        if (activeTab === 'atd-approve') {
                          // console.log(navigation);
                          setLoading(true);

                          approveAttendanceRequest(selectedItems, access_token)
                            .then(response => {
                              if (response.status) {
                                navigation.navigate('atd-approve', {
                                  showModal: true,
                                  message: `Approve ${selectedItems.length} items Successfully`,
                                });
                                setSelectedItems([]);
                                setShowAll(false);
                              }
                            })
                            .finally(() => setLoading(false));
                        } else if (activeTab === 'otapprove') {
                          ApproveOverTime(selectedItems, access_token)
                            .then(response => {
                              if (response.status) {
                                navigation.navigate('otapprove', {
                                  showModal: true,
                                  message: `Approve ${selectedItems.length} items Successfully`,
                                });
                                setSelectedItems([]);
                                setShowAll(false);
                              }
                            })
                            .finally(() => setLoading(false));
                        } else {
                          setLoading(true);
                          approveListConfirm(access_token, selectedItems)
                            .then(response => {
                              if (response.status) {
                                navigation.navigate('leaveapprove', {
                                  showModal: true,
                                  message: `Approve ${selectedItems.length} items Successfully`,
                                });
                                setSelectedItems([]);
                                setShowAll(false);
                              }
                            })
                            .finally(() => setLoading(false));
                        }
                      },
                    },
                    {
                      text: 'No',
                    },
                  ],
                );
              }
            }}>
            <Text style={styles.text}>
              Approve {loading && <ActivityIndicator size={10} />}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectedItems([]);
              setShowAll(!showAll);
            }}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => setShowAll(!showAll)}>
          <Text style={styles.text}>Select</Text>
        </Pressable>
      )}
    </View>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  btnWrapper: {
    marginRight: horizontalScale(10),
    flexDirection: 'row',
    gap: horizontalScale(10),
  },
  text: {
    color: '#ddd',
    padding: verticalScale(2),
  },
});
