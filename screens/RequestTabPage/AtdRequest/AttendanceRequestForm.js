import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import {submitAttendanceRequest} from '../../../api';
import {useSelector} from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';

const AttendanceRequestForm = ({navigation}) => {
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [checkedItem, setCheckedItem] = useState(null);
  const [reason, setReason] = useState('');
  const [selectedOfficeShift, setSelectedOfficeShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const {access_token, user_info} = useSelector(state => state.user);

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event, value) => {
    setDate(value);
    if (Platform.OS === 'android') {
      setIsPickerShow(false);
    }
  };

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

  const handleCheckboxChange = id => {
    console.log(id);
    setCheckedItem(id === checkedItem ? null : id);
  };

  const handleFormSubmit = () => {
    if (!date || !selectedOfficeShift || !checkedItem || !reason) {
      alert('Please fill out all required fields');
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
        data.find(item => item.value === selectedOfficeShift)?.value || '',
      checkedItems: checked[0].id,
      reason,
    };

    setLoading(true);

    submitAttendanceRequest(formData, access_token, user_info.userId).then(
      success => {
        setLoading(false);
        navigation.navigate('atd-req', { formSubmitted: true });
      },
    );

    // Now you can use formData to submit or perform any other actions
    // console.log('Form submitted with data:', formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.topRow}>
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
        <View style={{marginTop: verticalScale(15)}}>
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
            placeholder="Choose your Office Shift"
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
          <Text style={[styles.labelText, {marginTop: verticalScale(10)}]}>
            Attendance Type
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Please write your reason"
            placeholderTextColor="#9e9e9e"
            value={reason}
            onChangeText={text => setReason(text)}
          />
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

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: horizontalScale(18),
    borderTopColor: '#206aed',
    borderTopWidth: verticalScale(10),
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
  },
  title: {
    color: '#000',
    fontSize: scaleFontSize(20),
    fontWeight: '500',
  },
  icon: {
    color: '#206aed',
    marginTop: verticalScale(2),
  },
  dateBtn: {
    width: horizontalScale(100),
    backgroundColor: '#eff4f2',
    paddingVertical: verticalScale(25),
    borderColor: '#b7bcc5',
    borderWidth: verticalScale(1),
    borderRadius: horizontalScale(8),
    marginTop: verticalScale(10),
  },
  dateText: {
    color: '#000',
    textAlign: 'center',
    fontSize: scaleFontSize(18),
  },
  labelText: {
    color: '#9e9e9e',
    fontSize: scaleFontSize(16),
    marginTop: verticalScale(20),
  },
  dropdown: {
    height: verticalScale(50),
    borderBottomColor: 'gray',
    borderBottomWidth: verticalScale(0.5),
  },
  placeholderStyle: {
    fontSize: scaleFontSize(16),
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: scaleFontSize(16),
    color: '#000',
  },
  checkBoxWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: verticalScale(15),
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(15),
    width: '50%',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    color: '#000',
    margin: horizontalScale(8),
  },
  input: {
    color: '#000',
    borderBottomWidth: verticalScale(1),
    borderBottomColor: '#9e9e9e',
    fontSize: scaleFontSize(16),
    marginTop: verticalScale(8),
  },
});
