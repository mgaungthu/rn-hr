import axios from 'axios';

const API_URL = 'http://10.10.8.231/hrms/public/api/';

export const LoginUser = async data => {
  try {
    userinfo = await axios.post(API_URL + 'login', data);
    return {
      status: true,
      data: {
        userinfo
      },
    };
  } catch (error) {

    return {status:false,message:error.response.data.message};
  }
};
