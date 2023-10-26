import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import {callAttendanceRequestList, submitAttendanceRequest} from '../../../api';
import {useSelector} from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import CustomModal from '../../../components/CustomModel';
import styles from './style';
import {
    horizontalScale,
    verticalScale,
  } from '../../../assets/styles/scaling';
import ActionButton from './ActionButton';

const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const data = [
  {value: '1', label: 'Office Shift'},
  {value: '2', label: 'Front Office Shift-A'},
  {value: '3', label: 'Duty Off'},
  {value: '4', label: 'ADS Office Shift'},
  {value: '5', label: 'ADS Production Shift'},
  {value: '6', label: 'ADS S&D Shift'},
  {value: '7', label: 'ADS S&D (Shwe Bo & Wetlet) Shift'},
  {value: '8', label: 'ADS Driver Shift'},
  {value: '9', label: 'ADS O&M Shift'},
  {value: '10', label: 'ADS S&D (KISG) Shift'},
];

const checkBoxData = [
  {id: 1, Label: 'In Time', isChecked: false},
  {id: 2, Label: 'Out Time', isChecked: false},
  {id: 3, Label: 'Ferry Late', isChecked: false},
  {id: 4, Label: 'On Duty', isChecked: false},
  {id: 5, Label: 'Travel', isChecked: false},
  {id: 6, Label: 'Off Day', isChecked: false},
  {id: 7, Label: 'Work From Home', isChecked: false},
];

const AttendanceRequestForm = ({route, navigation}) => {
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
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
    callAttendanceRequestList(access_token, id)
      .then(response => {
        // console.log(response.data)
        const {date, reason, status, attendance_type_id} = response.data;
        const inputDate = date;
        const outputDate = convertDateFormat(inputDate);
        setDate(new Date(outputDate));
        setSelectedOfficeShift(1);
        setReason(reason);
        // console.log(data)
        setCheckedItem(attendance_type_id);
      })
      .catch(error => {
        alert(error);
      })
      .finally(() => setLoading(false));
  };

  const convertDateFormat = inputDate => {
    const dateComponents = inputDate.split('/');
    const originalDate = new Date(
      dateComponents[2],
      dateComponents[0] - 1,
      dateComponents[1],
    );

    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const day = originalDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
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

  const handleFormSubmit = () => {
    if (!date || !selectedOfficeShift || !checkedItem || !reason) {
      setModalVisible(true);
      setMessage('Please fill out all required fields');
      return;
    }

    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const checked = checkBoxData.filter(item => item.id === checkedItem);

    const formData = {
      formattedDate,
      officeShift:
        data.find(item => item.value === selectedOfficeShift)?.value ||
        selectedOfficeShift ||
        '',
      checkedItems: checked[0].id,
      reason,
    };

    setLoading(true);

    submitAttendanceRequest(
      formData,
      access_token,
      user_info.userId,
      editParams,
    )
      .then(() => {
        setLoading(false);
        navigation.navigate('atd-req', {showModal: true});
      })
      .catch(() => {
        setLoading(false);
        setModalVisible(true);
        setMessage('Internet Connection Error');
      });

    // Now you can use formData to submit or perform any other actions
    // console.log('Form submitted with data:', formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <CustomModal
            title={message}
            isVisible={isModalVisible}
            jsonPath={require('../../../assets/animations/error-check-mark.json')}
          />
          <View style={styles.titleBox}>
            <Pressable onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faXmark}
                size={horizontalScale(23)}
                style={styles.icon}
              />
            </Pressable>
            <Text style={styles.title}>Attendance Request</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleFormSubmit}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                size={horizontalScale(25)}
                style={[styles.icon]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.labelText}>Date</Text>
          <TouchableOpacity onPress={showPicker} style={styles.dateBtn}>
            <Text style={styles.dateText}>{month[date.getMonth()]}</Text>
            <Text style={[styles.dateText, {fontWeight: '600'}]}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.labelText}>Office Shift</Text>
          <Dropdown
            mode="modal"
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={{color: '#000'}}
            activeColor={'#ccc'}
            data={data}
            maxHeight={verticalScale(300)}
            labelField="label"
            valueField="value"
            placeholder={
              data[selectedOfficeShift]?.label || 'Choose your Office Shift'
            }
            searchPlaceholder="Search..."
            value={selectedOfficeShift}
            onChange={item => {
              setSelectedOfficeShift(item.value);
            }}
          />
        </View>

        <View>
          <Text style={styles.labelText}>Attendance Type</Text>

          <View style={styles.checkBoxWrapper}>
            {checkBoxData.map((item, index) => (
              <View key={item.id} style={styles.checkboxContainer}>
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleCheckboxChange(item.id)}
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  activeOpacity={0.7}>
                  <CheckBox
                    tintColors="#5a5a5a"
                    onFillColor="#5a5a5a"
                    boxType="square"
                    value={item.id === checkedItem}
                    onValueChange={() => handleCheckboxChange(item.id)}
                  />
                  <Text style={styles.label}>{item.Label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text style={[styles.labelText]}>
            Reason
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Please write your reason"
            placeholderTextColor="#9e9e9e"
            value={reason}
            onChangeText={text => setReason(text)}
          />

          <ActionButton user_info={user_info} editParams={editParams}/>
        </View>

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

export default AttendanceRequestForm;

