import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, Text} from 'react-native';

import {DeleteOverTime, OverTimeAction, getOverTime} from '../../../api';
import {useSelector} from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import CustomModal from '../../../components/CustomModel';
import ActionButton from '../components/ActionButton';
import ActionTopRow from '../components/ActionTopRow';
import ShiftDropDown from '../components/ShiftDropDown';
import InputText from '../components/InputText';
import {convertDateFormat, data, leaveBoxData} from '../../../assets/utils';
import styles from './../AtdRequest/styles';
import DateRangePicker from './components/DateRangePicker';

const OverTimeForm = ({route, navigation, navigation: {setParams}}) => {
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [totalDays, setTotalDays] = useState(1);
  const [totalHour, setTotalHour] = useState(Number);

  const [checkedItem, setCheckedItem] = useState(1);
  const [reason, setReason] = useState('');
  const [selectedOfficeShift, setSelectedOfficeShift] = useState(null);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [editParams, setEditParams] = useState({
    isEdit: false,
    editId: null,
    leave_id: null,
  });

  const {access_token, user_info} = useSelector(state => state.user);

  useEffect(() => {
    closeModal();
    if (route.params?.isEdit) {
      const id = route.params?.id;
      setLoading(true);
      callOverTime(id);
      setEditParams({
        isEdit: true,
        editId: id,
      });
      setParams({isEdit: false});
    }

    // console.log();

    return () => {
      closeModal();
    };
  }, [isModalVisible]);

  const callOverTime = id => {
    getOverTime(access_token, id)
      .then(response => {
        const {from_date, shift_id, to_date, total_hours, reason} =
          response.data;
        const from_dateConverted = convertDateFormat(from_date);
        const end_dateConverted = convertDateFormat(to_date);
        setStartDate(new Date(from_dateConverted));
        setEndDate(new Date(end_dateConverted));
        setReason(reason);
        setTotalHour(total_hours);
        setSelectedOfficeShift(shift_id);
        // handleEndDateChange();
        const result = differenceInDays(
          new Date(from_dateConverted),
          new Date(end_dateConverted),
        );
        const divider = checkedItem === 1 ? 1 : 0.5;
        setTotalDays(result * divider);
      })
      .catch(error => {
        console.log(error.message);
      });
    setLoading(false);
    // convertDateFormat()
  };

  const closeModal = () => {
    setTimeout(() => {
      setModalVisible(false);
      setMessage('');
    }, 1000);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
    // alert(endDate);

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

    if (!startDate || !endDate || !selectedOfficeShift || !reason) {
      setModalVisible(true);
      setMessage('Please fill out all required fields');
      return;
    }

    const data = {
      id: editParams.editId,
      from_date: formatStartDate,
      to_date: formatEndDate,
      total_hours: totalHour * 1,
      reason: reason,
    };

    setLoading(true);

    OverTimeAction(data, access_token)
      .then(response => {
        // console.log(response.message);
        setModalVisible(true);
        if (response.status) {
          navigation.navigate('otrequest', {
            showModal: true,
            message: editParams.isEdit
              ? 'Overtime Request Updated'
              : 'Overtime Request Submitted',
          });
        } else {
          setMessage(response.message);
          setModalVisible(true);
        }
      })
      .catch(error => console.log('here'))
      .finally(() => setLoading(false));

    // console.log(attachment)
  };

  const showConfirmDialog = action => {
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
            DeleteOverTime(access_token, editParams.editId)
              .then(response => {
                navigation.navigate('otrequest', {
                  showModal: true,
                  message: 'Overtime request already removed',
                });
              })
              .finally(() => setLoading(false));
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
          title={'Overtime Request'}
          approve={user_info.approved_person}
        />

        {/* {user_info.approved_person === 1 && requestName &&  (
          <Text style={[styles.labelText,{padding:0}]}>Request By {requestName}</Text>
        )} */}

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
          labelText={
            selectedOfficeShift
              ? selectedOfficeShift
              : 'Choose your Office Shift'
          }
        />

        <View style={{marginTop: 10}}></View>

        <InputText
          setReason={setTotalHour}
          Title={'Total Hours'}
          reason={totalHour}
          labelText={'Number of Overtime Hours Requested'}
          Type={'numeric'}
        />

        <View style={{marginTop: 10}}></View>

        <InputText setReason={setReason} reason={reason} />

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

export default OverTimeForm;