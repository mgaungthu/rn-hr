import axios from 'axios';
import {readFile} from 'react-native-fs';


// const API_URL = 'http://10.10.8.231/hrms/public/api/';
const API_URL = 'http://10.10.8.20/hrms/public/api/';


export const LoginUser = async data => {
  try {
    userinfo = await axios.post(API_URL + 'login', data);
    return {
      status: true,
      data: {
        userinfo,
      },
    };
  } catch (error) {
    return {status: false, message: error.response.data.message};
  }
};

const loadImageBase64 = async capturedImageURI => {
  try {
    const base64Data = await readFile(capturedImageURI, 'base64');
    return 'data:image/jpeg;base64,' + base64Data;
  } catch (error) {
    console.error('Error converting image to base64:', error);
  }
};



export const checkInOutApi = async (imgUri, latLong, access_token, id,checkInStatus) => {



  try {

    const d = new Date();
    const m = d.getMinutes();
    const h = d.getHours() >= 12 ? d.getHours() - 12 : d.getHours();
    const ampm = d.getHours() >= 12 ? ' PM' : ' AM';
    let datalist = [];
    let today = new Date(),
      curDate =
        today.getFullYear() +
        '-' +
        ('0' + (today.getMonth() + 1)).substr(-2) +
        '-' +
        ('0' + today.getDate()).substr(-2);

    const base64Image = await loadImageBase64(imgUri.uri);

    // console.log(base64Image)
    datalist = {
      employee_id: id,
      type: checkInStatus ? 'check-out' : 'check-in',
      date: curDate, //    time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      checkIntime: checkInStatus ? '-' : ('0' + h).substr(-2) + ':' + ('0' + m).substr(-2) + ampm,
      checkOuttime: !checkInStatus ? '-' : ('0' + h).substr(-2) + ':' + ('0' + m).substr(-2) + ampm,
      in_image: base64Image,
      latitude: latLong[1],
      longitude: latLong[0],
      out_image: '-',
    };

    // console.log(datalist);

    const config = {
      timeout:3000,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer  ' + access_token,
        'Content-Type': 'multipart/form-data',
      },
    }

    response = await axios.post(API_URL + 'user/attendance', datalist,config);

    return {
      status: true,
      message: response.data.message,
      time:checkInStatus ? datalist.checkOuttime : datalist.checkIntime
    };
  } catch (error) {
    // console.log(error.response.data.message);
    return {
      status: false,
      message: error.response.data.message,
    };
  }
};

export const callCheckInOutInfo = async access_token => {

  // console.log(access_token)

  const config = { Authorization: "Bearer " + access_token }

  try {
    response = await axios.get(API_URL + 'user/get_checkinout_info',{headers: config})
    
    // console.log( response.data.todayOfficeShift);
    return {
      status: true,
      data: response.data.todayOfficeShift,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
};

export const callAttendanceRequestList = async (access_token) => {

  const config = { Authorization: "Bearer " + access_token }

  try {   
    response = await axios.get(API_URL + 'user/attendance_request_list',{headers: config})  
    const trasmformed = transformArray(response.data.attendanceRequestlists);

    return {
      status: true,
      data: trasmformed,
    };

  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
}

function transformArray(originalArray) {
  return originalArray.map(item => ({
    id: item.id,
    status: item.statusby_manager,
    title: item.attendance_type.attendance_type_name,
    date: item.from_date
  }));
}