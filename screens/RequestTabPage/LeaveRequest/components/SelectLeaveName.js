import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableHighlight,
  FlatList,
  BackHandler
} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../../assets/styles/scaling';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faClose} from '@fortawesome/free-solid-svg-icons';
import {callLeaveTypeList} from '../../../../api';
import {useSelector} from 'react-redux';

const SelectLeaveName = ({setLeaveId, setLoading,editParams}) => {
  const [isModalVisible, setModalVisible] = useState(false)
  const [leavedData, setLeavedData] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null);
  const {access_token} = useSelector(state => state.user);

  


  useEffect(() => {

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
    if (isModalVisible) {
      
      setLoading(true);
      callLeaveTypeList(access_token)
        .then(response => {
          // console.log(response.data);
          setLeavedData(response.data.leaveHistories);
        })
        .finally(() => setLoading(false));
    }

    return () => backHandler.remove();

  }, [isModalVisible]);
  

  useEffect(() => {
    if(editParams.isEdit){
       
      setLoading(true);
      callLeaveTypeList(access_token,editParams.leave_id)
        .then(response => {
          
          const {leave,leave_id,available,taken,balance,pending} = response.data.leaveHistories[0]
          setSelectedLeave({title:leave.leave_name,allowance:available,taken,balance,pending});
          setLeaveId(leave_id)
        })
        .finally(() => setLoading(false));
    }
  }, [editParams.isEdit])


  const backAction = () => {
    if (isModalVisible) {
      // Close the modal if it's open
      setModalVisible(false);
      return true; // Prevent default behavior (e.g., exiting the app)
    }
    return false; // Allow default behavior (e.g., navigating back)
    
  };
  

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const showTitleValue = (
    leaveId,
    title,
    allowance,
    taken,
    balance,
    pending,
  ) => {
    // console.log(title, allowance, taken, balance, pending)
    setSelectedLeave({title, allowance, taken, balance, pending});
    setLeaveId(leaveId);
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      
      {selectedLeave ? (
        <View style={styles.selectedLeaveContainer}>
          <LeaveTypeComponent
            title={selectedLeave.title}
            allowance={selectedLeave.allowance}
            taken={selectedLeave.taken}
            balance={selectedLeave.balance}
            pending={selectedLeave.pending}
            showTitleValue={toggleModal}
          />
        </View>
      ) : (
        <>
          <Pressable onPress={toggleModal} style={styles.selectWrapper}>
            <Text style={styles.selectFont}>Select Leave Name</Text>
            <FontAwesomeIcon icon={faEdit} size={20} color="#206aed" />
          </Pressable>
        </>
      )}

      <Modal visible={isModalVisible} animationType="fade" onRequestClose={toggleModal}>
        <View style={styles.modalWrapper}>
          <View style={styles.topActionRow}>
            <Pressable onPress={toggleModal}>
              <FontAwesomeIcon
                icon={faClose}
                color="#206aed"
                size={23}
                secondaryColor="#000"
              />
            </Pressable>
            <Text style={styles.title}>Select Leave Name</Text>
          </View>

          <View style={styles.mainWrapper}>
            <FlatList
              data={leavedData}
              renderItem={({item}) => (
                <LeaveTypeComponent
                  leaveId={item.leave_id}
                  title={item.leave.leave_name}
                  allowance={item.available}
                  taken={item.taken}
                  balance={item.balance}
                  pending={item.pending}
                  showTitleValue={showTitleValue}
                />
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const LeaveTypeComponent = ({
  leaveId,
  title,
  allowance,
  taken,
  balance,
  pending,
  showTitleValue,
}) => {
  return (
    <TouchableHighlight
      onPress={() =>
        showTitleValue(leaveId, title, allowance, taken, balance, pending)
      }
      underlayColor="#cacaca"
      style={{borderRadius: 5}}>
      <View style={styles.typeWrapper}>
        <Text style={styles.Leavetitle}>{title}</Text>
        <View style={styles.typeRow}>
          <View style={styles.leaveBox}>
            <Text style={styles.boxTitle}>Allowance</Text>
            <Text
              style={[
                styles.boxTitle,
                {
                  fontWeight: '500',
                  marginTop: verticalScale(10),
                  color: '#2196F3',
                },
              ]}>
              {allowance}
            </Text>
          </View>
          <View style={styles.leaveBox}>
            <Text style={styles.boxTitle}>Taken</Text>
            <Text
              style={[
                styles.boxTitle,
                {
                  fontWeight: '500',
                  marginTop: verticalScale(10),
                  color: '#4CAF50',
                },
              ]}>
              {taken}
            </Text>
          </View>
          <View style={styles.leaveBox}>
            <Text style={styles.boxTitle}>Balance</Text>
            <Text
              style={[
                styles.boxTitle,
                {
                  fontWeight: '500',
                  marginTop: verticalScale(10),
                  color: '#e91e63',
                },
              ]}>
              {balance}
            </Text>
          </View>
          <View style={[styles.leaveBox, {borderRightWidth: 0}]}>
            <Text style={styles.boxTitle}>Pending</Text>
            <Text
              style={[
                styles.boxTitle,
                {
                  fontWeight: '500',
                  marginTop: verticalScale(10),
                  color: '#ffeb3b',
                },
              ]}>
              {pending}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default SelectLeaveName;

const styles = StyleSheet.create({
  selectWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#206aead',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: verticalScale(10),
    paddingHorizontal: 0,
    marginTop: verticalScale(30),
    marginBottom: verticalScale(10),
  },
  selectFont: {
    color: '#000',
    fontSize: scaleFontSize(16),
  },
  modalWrapper: {
    padding: horizontalScale(20),
    borderTopColor: '#206aed',
    borderTopWidth: 10,
    marginBottom: verticalScale(50),
  },
  topActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  mainWrapper: {
    marginTop: verticalScale(20),
  },
  title: {
    color: '#000',
    fontSize: scaleFontSize(20),
    fontWeight: '500',
  },
  Leavetitle: {
    color: '#000',
    fontSize: scaleFontSize(16),
    fontWeight: '500',
  },
  typeWrapper: {
    padding: 10,
    borderRadius: 5,
  },
  typeRow: {
    flexDirection: 'row',
    marginTop: verticalScale(10),
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(5),
    paddingBottom: horizontalScale(10),
    borderBottomColor: '#206aed',
    borderBottomWidth: 1,
  },
  leaveBox: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(5),
    borderRightColor: '#ddd',
    borderRightWidth: 1,
    width: 88,
  },
  boxTitle: {
    textAlign: 'center',
    color: '#000',
    fontSize: scaleFontSize(14),
  },
  selectedLeaveContainer: {
    marginTop: verticalScale(10),
  },
});
