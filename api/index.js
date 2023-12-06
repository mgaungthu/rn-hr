import axios from 'axios';
import {readFile} from 'react-native-fs';

// const API_URL = 'http://10.10.18.22/hrms/public/api/';
const API_URL = 'https://soloversion.com/api/';

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

export const checkInOutApi = async (
  imgUri,
  latLong,
  access_token,
  id,
  checkInStatus,
  checkInOut,
) => {
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

    let base64Image = null;
    if (imgUri) {
      base64Image = await loadImageBase64(imgUri.uri);
    }

    // console.log(checkInStatus || checkInOut ? 'check-out' : 'check-in',)

    datalist = {
      employee_id: id,
      type: checkInStatus || checkInOut ? 'check-out' : 'check-in',
      date: curDate, //    time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      checkIntime: checkInStatus
        ? '-'
        : ('0' + h).substr(-2) + ':' + ('0' + m).substr(-2) + ampm,
      checkOuttime: !checkInStatus
        ? '-'
        : ('0' + h).substr(-2) + ':' + ('0' + m).substr(-2) + ampm,
      in_image: checkInStatus || checkInOut ? 'check-out' : base64Image,
      latitude: latLong[1] || null,
      longitude: latLong[0] || null,
      out_image: checkInStatus || checkInOut ? base64Image : '-',
    };

    // console.log(datalist);

    const config = {
      timeout: 3000,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer  ' + access_token,
        'Content-Type': 'multipart/form-data',
      },
    };

    // console.log(datalist);

    response = await axios.post(API_URL + 'user/attendance', datalist, config);
    

    return {
      status: true,
      message: response.data.message,
      time:
        checkInStatus || checkInOut
          ? datalist.checkOuttime
          : datalist.checkIntime,
    };
  } catch (error) {
    console.log(error.response.data.message);

    return {
      status: false,
      message: error.response.data.message || error,
    };
  }
};

export const callCheckInOutInfo = async access_token => {
  // console.log(access_token)

  const config = {Authorization: 'Bearer ' + access_token};

  try {
    response = await axios.get(API_URL + 'user/get_checkinout_info', {
      headers: config,
    });

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

export const callAttendanceRequestList = async (access_token, id = null,approve = null) => {
  const config = {Authorization: 'Bearer ' + access_token};

  let response;
  let trasnformed;
  

  try {
    if (!id) {
      response = await axios.get(API_URL + 'user/attendance_request_list', {
        headers: config,
      });
      
      if(approve === 1){
        trasnformed = transformArray(response.data.attendanceRequestlists);
      }else {
        trasnformed = singleTransform(response.data.attendanceRequestlists);
      }
     

    } else {
      response = await axios.get(
        API_URL +
          'user/attendance_request_list?edit_attendance_request_id=' +
          id,
        {
          headers: config,
        },
      );
      trasnformed = transformArray(response.data.attendanceRequest);
    }

    
    return {
      status: true,
      data: trasnformed,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
};

export const callAttendanceRequestAll = async access_token => {
  const config = {Authorization: 'Bearer ' + access_token};

  try {
    const response = await axios.get(API_URL + 'user/attendance_request_all', {
      headers: config,
    });

   
    const trasnformed = transformArray(response.data.attendanceRequestlists);

    return {
      status: true,
      data: trasnformed,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
};

function singleTransform(originalArray){
  if (originalArray.length > 0) {
    return originalArray.map(item => ({
      id: item.id,
      status: item.statusby_manager,
      title: item.attendance_type.attendance_type_name,
      date: item.from_date,
      statusby_manager: item.statusby_manager,
    }));
  }
  const item = originalArray;
  return {
    id: item.id,
    status: item.statusby_manager,
    attendance_type_id: item.attendance_type_id,
    date: item.from_date,
    reason: item.reason,
    statusby_manager: item.statusby_manager,
  };
}

function transformArray(originalArray) {
  if (originalArray.length > 0) {
    return originalArray.map(item => ({
      id: item.id,
      name:item.employee.name,
      status: item.statusby_manager,
      title: item.attendance_type.attendance_type_name,
      date: item.from_date,
      statusby_manager: item.statusby_manager,
    }));
  }
  const item = originalArray;
  return {
    id: item.id,
    name:item.employee.name,
    status: item.statusby_manager,
    attendance_type_id: item.attendance_type_id,
    date: item.from_date,
    reason: item.reason,
    statusby_manager: item.statusby_manager,
  };
}

export const submitAttendanceRequest = async (formData, access_token, id) => {
  const config = {
    timeout: 3000,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer  ' + access_token,
    },
  };

  const data = {
    employee_id: id,
    shift_id: formData.officeShift, // You can replace this with your actual value
    attendance_type_id: formData.checkedItems, // You can replace this with your actual value
    date: formData.formattedDate, // You can replace this with your actual value
    reason: formData.reason,
    approvedby_manager: 0,
    approvedby_hr: 0,
    isEdit: formData.editParams.isEdit,
    attendance_id: formData.editParams.editId,
  };

  try {
    response = await axios.post(
      API_URL + 'user/attendance_request',
      data,
      config,
    );

    // console.log(response);
  } catch (error) {
    console.log(error.response.data.message);
  }
};

export const approveAttendanceRequest = async (id, accessToken) => {
  try {
    const response = await axios.post(
      `${API_URL}user/attendancerequest_approve_confirm/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    // console.log(error.response);
    return {
      status: false,
      data: response.data.message,
    };
  }
};

export const DeleteAttendanceRequest = async (access_token, id) => {
  const config = {Authorization: 'Bearer ' + access_token};

  try {
    const response = await axios.get(
      API_URL + 'user/attendancerequest_delete?atd_id=' + id,
      {
        headers: config,
      },
    );

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // console.log(error);
    return {
      status: false,
      data: null,
    };
  }
};

export const callLeaveTypeList = async (access_token, id = null,userId) => {
  const config = {Authorization: 'Bearer ' + access_token};
  // console.log(id);
  
  try {
    if (!id) {
      const response = await axios.get(API_URL + 'user/leave_history_list', {
        headers: config,
      });

      return {
        status: true,
        data: response.data,
      };
    } else {

      // console.log(userId + "here")
      const response = await axios.get(
        API_URL + 'user/leave_history_list?id=' + id + '&userId=' + userId,
        {
          headers: config,
        },
      );
      
      // console.log(response.data);
      return {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
};

export const callLeaveHistoryListApi = async (access_token, id = null) => {
  const config = {Authorization: 'Bearer ' + access_token};

  try {
    if (!id) {
      const response = await axios.get(API_URL + 'user/leave_request_list', {
        headers: config,
      });
      const leaveRequestList = response.data.leaveRequestList.map(
        ({
          id,
          employee,
          statusby_manager,
          from_date,
          to_date,
          total_day,
          leave,
          leave_type,
        }) => ({
          id,
          name:employee.name,
          statusby_manager,
          from_date,
          to_date,
          total_day,
          leave_name: leave.leave_name,
          leave_id: leave.id,
          leave_type_name: leave_type.leave_type_name,
        }),
      );

      // console.log(leaveRequestList);
      return {
        status: true,
        data: leaveRequestList,
      };
    } else {
      const response = await axios.get(
        API_URL + 'user/leave_request_list?id=' + id,
        {
          headers: config,
        },
      );

      const leaveRequestList = response.data.leaveRequestList.map(
        ({
          id,
          employee_id,
          statusby_manager,
          employee,
          from_date,
          to_date,
          total_day,
          leave,
          leave_type,
          shift,
          reason,
          attach_file,
        }) => ({
          id,
          employee_id,
          name:employee.name,
          statusby_manager,
          from_date,
          to_date,
          total_day,
          leave_name_id: leave.id,
          leave_type_id: leave_type.id,
          shift_name: shift.name,
          reason,
          attach_file,
        }),
      );
      // console.log(leaveRequestList)
      return {
        status: true,
        data: leaveRequestList[0],
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
};


export const callLeaveHistoryAll = async (access_token) => {
  const config = {Authorization: 'Bearer ' + access_token};

  try {
      const response = await axios.get(API_URL + 'user/leave_request_all', {
        headers: config,
      });
      const leaveRequestList = response.data.leaveRequestList.map(
        ({
          id,
          employee,
          statusby_manager,
          from_date,
          to_date,
          total_day,
          leave,
          leave_type,
        }) => ({
          id,
          name:employee.name,
          statusby_manager,
          from_date,
          to_date,
          total_day,
          leave_name: leave.leave_name,
          leave_id: leave.id,
          leave_type_name: leave_type.leave_type_name,
        }),
      );

      return {
        status: true,
        data: leaveRequestList,
      };
    
  } catch (error) {
    return {
      status: false,
      data: null,
    };
  }
};

export const leaveRequestApi = async (data, attachment, access_token) => {
  const config = {
    timeout: 3000,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer  ' + access_token,
      'Content-Type': 'multipart/form-data',
    },
  };

  let imageInclude;

  if (attachment?.uri) {
    const imgBase64 = await loadImageBase64(attachment.uri);
    const append = {attach_file: imgBase64};

    imageInclude = {...data, ...append};
  }


  // console.log(attachment?.uri ? imageInclude : data);
  // console.log(data)

  try {
    response = await axios.post(
      API_URL + 'user/leaverequeststore',
      attachment?.uri ? imageInclude : data,
      config,
    );
    // console.log(response.data);
    return {
      status: true,
      message: response.data.message,
    };
  } catch (error) {
    // console.log(error.response.data.message);
    return {
      status: false,
      message: error.response.data.message,
    };
  }
};

export const DeleteLeaveRequest = async (access_token, id) => {
  const config = {Authorization: 'Bearer ' + access_token};

  try {
    const response = await axios.delete(
      API_URL + `user/leave_request_delete/${id}`,
      {
        headers: config,
      },
    );
    // console.log(response.data);
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      data: null,
    };
  }
};

export const approveConfirm = async (access_token, id, totalDays, leaveId) => {
  const config = {Authorization: 'Bearer ' + access_token};

  const data = {
    leave_name: leaveId,
    total_day: totalDays,
  };

  try {
    const response = await axios.post(
      `${API_URL}user/approve_confirm/${id}`,
      data,
      {
        headers: config,
      },
    );

    return {
      status: true,
      message: response.data.message,
    };
  } catch (error) {
    // console.log(error.response.data);
    return {
      status: false,
      data: response.data.message,
    };
  }
};

export const approveListConfirm = async (access_token, data) => {
  const config = {Authorization: 'Bearer ' + access_token};
  const totalDayarray = data.map(item => item.total_day);
  const leaveIdArray = data.map(item => item.leave_id);
  let idArray = data.map(item => item.id);

  try {
    const response = await axios.post(
      `${API_URL}user/approve_confirm/${idArray}`,
      {
        leave_name: leaveIdArray,
        total_day: totalDayarray,
      },
      {
        headers: config,
      },
    );

    // console.log(response.data)
    return {
      status: true,
      message: response.data.message,
    };
  } catch (error) {
    // console.log(error.response.data);
    return {
      status: false,
      data: response.data.message,
    };
  }
};


export const callCheckInOutList = async access_token => {
  const config = {Authorization: 'Bearer ' + access_token};

  try {
    const response = await axios.post(API_URL + 'user/get_user_info',{}, {
      headers: config,
    });

    return {
      status: true,
      data: response.data.user.office_shift,
    };
  } catch (error) {

    console.log(error)
    return {
      status: false,
      data: null,
    };
  }
};


export const keepToken = async accessToken => {
  const config = {Authorization: 'Bearer ' + access_token};

  try {
    const response = await axios.post(API_URL + 'user/token-count',{}, {
      headers: config,
    });

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {

    console.log(error)
    return {
      status: false,
      data: null,
    };
  }
} 