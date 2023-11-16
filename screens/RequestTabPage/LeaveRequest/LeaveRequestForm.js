import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';

import {
  DeleteLeaveRequest,
  approveConfirm,
  callLeaveHistoryListApi,
  leaveRequestApi,
} from '../../../api';
import {useSelector} from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import CustomModal from '../../../components/CustomModel';
import ActionButton from '../components/ActionButton';
import ActionTopRow from '../components/ActionTopRow';
import ShiftDropDown from '../components/ShiftDropDown';
import TypeCheckBox from '../components/TypeCheckBox';
import InputText from '../components/InputText';
import {convertDateFormat, data, leaveBoxData} from '../../../assets/utils';
import styles from './../AtdRequest/styles';
import DateRangePicker from './components/DateRangePicker';
import SelectLeaveName from './components/SelectLeaveName';
import Attachment from './components/Attachment';


const LeaveRequestForm = ({route, navigation, navigation: {setParams}}) => {

  const [leaveRequestId,setLeaveRequestId] = useState();
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [totalDays, setTotalDays] = useState(1);
  const [leaveId,setLeaveId] = useState();
  const [checkedItem, setCheckedItem] = useState(1);
  const [reason, setReason] = useState('')
  const [selectedOfficeShift, setSelectedOfficeShift] = useState(null);
  const [attachment,setAttachment] = useState(null);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [editParams, setEditParams] = useState({
    isEdit: false,
    editId: null,
    leave_id:null
  });

  const {access_token, user_info} = useSelector(state => state.user);
  

  useEffect(() => {

    
    closeModal();
    if (route.params?.isEdit) {
  
      const id = route.params?.id;
      const leave_id = route.params?.leave_id
      setLoading(true);
      callLeaveHistoryListCall(id);
      // console.log(leave_id);
      setEditParams({
        isEdit: true,
        editId: id,
        leave_id:leave_id
      });
      setParams({isEdit:false})

    }

    // console.log();

    return () => {
      closeModal();
    };
  }, [isModalVisible]);

  const callLeaveHistoryListCall = id => {
      callLeaveHistoryListApi(access_token,id).then(
        (response) => {
          // console.log(response.data)
          const {id,from_date,to_date,leave_name_id,leave_type_id,shift_name,total_day,reason,attach_file} = response.data;
          const from_dateConverted = convertDateFormat(from_date);
          const end_dateConverted = convertDateFormat(to_date);
          setStartDate(new Date(from_dateConverted));
          setEndDate(new Date(end_dateConverted));
          setLeaveId(leave_name_id)
          setSelectedOfficeShift(shift_name);
          setCheckedItem(leave_type_id)
          setReason(reason)
          setTotalDays(total_day)
          setAttachment(attach_file)
          setLeaveRequestId(id);
        }
      ).finally(
        () => setLoading(false)
      )
      .catch(
        ()=> alert("Internet Connection Error")
      )

      // convertDateFormat()
  };

  const closeModal = () => {
    setTimeout(() => {
      setModalVisible(false);
      setMessage('');
    }, 1000);
  };

  const handleCheckboxChange = id => {
    setCheckedItem(id === checkedItem ? null : id);

    const result = differenceInDays(startDate, endDate);
    // alert(result)
    const divider = id === 1 ? 1 : 0.5;
    setTotalDays(result * divider);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);

    // Calculate total days
    const result = differenceInDays(startDate, currentDate);
    const divider = checkedItem === 1 ? 1 : 0.5;
    setTotalDays(result * divider);
  };

  function differenceInDays(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in days
    const differenceInDays = Math.ceil((end - start) / oneDay);

    // Ensure the minimum difference is 1 day
    return Math.max(1, differenceInDays + 1);
  }


  const handleFormSubmit = () => {
    const formatStartDate = startDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const formatEndDate = endDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    if (
      !leaveId ||
      !startDate ||
      !endDate ||
      !selectedOfficeShift ||
      !checkedItem ||
      !reason
    ) {
      // console.log(leaveId  , startDate ,endDate ,selectedOfficeShift ,checkedItem ,reason)
      setModalVisible(true);
      setMessage('Please fill out all required fields');
      return;
    }

    const checked = leaveBoxData.filter(item => item.id === checkedItem);

    const data = {
      leave_name: leaveId,
      from_date: formatStartDate,
      to_date: formatEndDate,
      total_day: totalDays,
      leave_type: checked[0].id,
      reason: reason,
      editId: editParams.editId,
    };

    setLoading(true);

    leaveRequestApi(data, attachment, access_token)
      .then(response => {
        // console.log(response.message)
        // setModalVisible(true)
        if (response.status) {
          navigation.navigate('leaverequest', {
            showModal: true,
            message: editParams.isEdit
              ? 'Leave Request Updated'
              : 'Leave Request Submitted',
          });
        } else {
          setMessage(response.message);
          setModalVisible(true);
        }
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));

    // console.log(attachment)
  };

  const showConfirmDialog = (action) => {

    if(action === 'approve') {
      return Alert.alert(
        'Are your sure?',
        'Are you sure you want to approve?',
        [
          // The "Yes" button
          {
            text: 'Yes',
            onPress: () => {
              setLoading(true);
              approveConfirm(access_token,leaveRequestId,totalDays,leaveId).then(
                (response) => {
                  navigation.navigate('leaverequest', {
                    showModal: true,
                    message: response.message,
                  });
                }
              ).finally(
                () =>  setLoading(false)
              )
            },
          },
          // The "No" button
          // Does nothing but dismiss the dialog when tapped
          {
            text: 'No',
          },
        ],
      );
    }
    return Alert.alert(
      'Are your sure?',
      'Are you sure you want to remove this?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            setLoading(true);
            // console.log(leaveRequestId)
            DeleteLeaveRequest(access_token,leaveRequestId).then(
              (response) => {
                navigation.navigate('leaverequest', {
                  showModal: true,
                  message: 'Leave request already removed',
                });
              }
            ).finally(
              () => setLoading(false)
            )
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
        },
      ],
    );
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    // alert(currentDate);
    setShowStartDatePicker(false);
    setStartDate(currentDate);

    // Automatically open EndDatePicker after selecting StartDatePicker
    setShowEndDatePicker(true);
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    if (startDate) {
      setShowEndDatePicker(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <CustomModal
          title={message}
          isVisible={isModalVisible}
          jsonPath={require('../../../assets/animations/error-check-mark.json')}
        />

        <ActionTopRow
          handleFormSubmit={handleFormSubmit}
          navigation={navigation}
          title={'Leave Request'}
        />

        <SelectLeaveName setLoading={setLoading} setLeaveId={setLeaveId} editParams={editParams}/>

        <DateRangePicker
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          startDate={startDate}
          endDate={endDate}
          totalDays={totalDays}
          showStartDatePicker={showStartDatePicker}
          showStartDatePickerModal={showStartDatePickerModal}
          showEndDatePickerModal={showEndDatePickerModal}
          showEndDatePicker={showEndDatePicker}
        />

        <ShiftDropDown
          selectedOfficeShift={selectedOfficeShift}
          setSelectedOfficeShift={setSelectedOfficeShift}
          data={data}
          labelText={selectedOfficeShift ? selectedOfficeShift : 'Choose your Office Shift'}
        />

        <TypeCheckBox
          checkBoxData={leaveBoxData}
          checkedItem={checkedItem}
          handleCheckboxChange={handleCheckboxChange}
          title={'Leave Type'}
        />

        <InputText setReason={setReason} reason={reason} />

        <Attachment setAttachment={setAttachment} attachment={attachment}/>

        <ActionButton
          user_info={user_info}
          editParams={editParams}
          showConfirmDialog={showConfirmDialog}
        />

        {loading && <LoadingScreen />}
      </View>
    </ScrollView>
  );
};

export default LeaveRequestForm;



