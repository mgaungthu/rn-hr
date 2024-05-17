import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import {
  DeleteAttendanceRequest,
  approveAttendanceRequest,
  callAttendanceRequestList,
  submitAttendanceRequest,
} from '../../../api';
import {useDispatch, useSelector} from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import CustomModal from '../../../components/CustomModel';
import ActionButton from '../components/ActionButton';
import ActionTopRow from '../components/ActionTopRow';
import ShiftDropDown from '../components/ShiftDropDown';
import TypeCheckBox from '../components/TypeCheckBox';
import InputText from '../components/InputText';
import {
  month,
  data,
  checkBoxData,
  convertDateFormat,
} from '../../../assets/utils';
import styles from './styles';

const AttendanceApproveForm = ({route, navigation}) => {
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [requestByName, setRequestByName] = useState(null);
  const [checkedItem, setCheckedItem] = useState(null);
  const [reason, setReason] = useState('');
  const [selectedOfficeShift, setSelectedOfficeShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [editParams, setEditParams] = useState({
    isEdit: false,
    editId: null,
  });

  const {access_token, user_info} = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    closeModal();
    if (route.params?.isEdit) {
      const id = route.params?.id;
      setLoading(true);
      attendaneRequestCall(id);
      setEditParams({
        isEdit: true,
        editId: id,
      });
    }

    // console.log();

    return () => {
      closeModal();
    };
  }, [isModalVisible]);

  const attendaneRequestCall = id => {
    callAttendanceRequestList(access_token, id, user_info.approved_person)
      .then(response => {
        if (response.status) {
          const {date, reason, attendance_type_id, name} = response.data;
          const inputDate = date;
          const outputDate = convertDateFormat(inputDate);
          setDate(new Date(outputDate));
          setSelectedOfficeShift(1);
          setReason(reason);
          setRequestByName(name);
          // console.log(data)
          setCheckedItem(attendance_type_id);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const closeModal = () => {
    setTimeout(() => {
      setModalVisible(false);
      setMessage('');
    }, 1000);
  };

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event, value) => {
    setDate(value);
    if (Platform.OS === 'android') {
      setIsPickerShow(false);
    }
  };

  const handleCheckboxChange = id => {
    setCheckedItem(id === checkedItem ? null : id);
  };

  const showConfirmDialog = () => {
    return Alert.alert('Are your sure?', 'Are you sure you want to approve?', [
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          setLoading(true);

          approveAttendanceRequest(editParams.editId, access_token)
            .then(response => {
              navigation.navigate('atd-approve', {
                showModal: true,
                message: 'Attedance Approve Successfully',
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
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <CustomModal
          title={message}
          isVisible={isModalVisible}
          jsonPath={require('../../../assets/animations/error-check-mark.json')}
        />

        <ActionTopRow navigation={navigation} title={'Attendance Approve'} />
        {/* {!editParams.isEdit &&  <Text style={styles.labelText}>Request By {requestByName}</Text>}  */}
        {/* {user_info.approved_person === 1 && requestByName && (
          <Text style={styles.labelText}>Request By {requestByName}</Text>
        )} */}

        <View>
          <Text style={styles.labelText}>Date</Text>
          <TouchableOpacity onPress={showPicker} style={styles.dateBtn}>
            <Text style={styles.dateText}>{month[date.getMonth()]}</Text>
            <Text style={[styles.dateText, {fontWeight: '600'}]}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        </View>

        <ShiftDropDown
          selectedOfficeShift={selectedOfficeShift}
          setSelectedOfficeShift={setSelectedOfficeShift}
          data={data}
          labelText={'Choose your Office Shift'}
        />

        <TypeCheckBox
          checkBoxData={checkBoxData}
          checkedItem={checkedItem}
          handleCheckboxChange={handleCheckboxChange}
          title={'Attendance Type'}
        />

        <InputText setReason={setReason} reason={reason} />

        <ActionButton showConfirmDialog={showConfirmDialog} />

        {isPickerShow && (
          <RNDateTimePicker
            value={date}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={onChange}
            style={styles.datePicker}
          />
        )}

        {loading && <LoadingScreen />}
      </View>
    </ScrollView>
  );
};

export default AttendanceApproveForm;
