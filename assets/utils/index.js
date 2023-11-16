export const month = [
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
  
  export const data = [
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
  

  export const checkBoxData = [
    {id: 1, Label: 'In Time', isChecked: false},
    {id: 2, Label: 'Out Time', isChecked: false},
    {id: 3, Label: 'Ferry Late', isChecked: false},
    {id: 4, Label: 'On Duty', isChecked: false},
    {id: 5, Label: 'Travel', isChecked: false},
    {id: 6, Label: 'Off Day', isChecked: false},
    {id: 7, Label: 'Work From Home', isChecked: false},
  ];


  export const leaveBoxData = [
    {id: 1, Label: 'FullDay Leave', isChecked: false},
    {id: 2, Label: 'Morning Leave', isChecked: false},
    {id: 3, Label: 'Evening Leave', isChecked: false},
  ];

  export const convertDateFormat = inputDate => {
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

 export function getDayName(dateString) {
  // Create a new Date object using the date string
  const convertedDate = new Date(dateString);

  // Get the day name
  const options = { weekday: 'long' };
  const dayName = new Intl.DateTimeFormat('en-US', options).format(convertedDate);

  return dayName;
}

export function convertDateFormat2(dateString) {
  // Create a new Date object using the date string
  const convertedDate = new Date(dateString);

  // Get the day, month abbreviation, and year
  const day = convertedDate.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(convertedDate);
  const year = convertedDate.getFullYear();

  // Format the date as "DD-MMM-YYYY"
  const formattedDate = `${day}-${monthAbbreviation}-${year}`;

  return formattedDate;
}


export const getFormattedDate = () => {
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const currentDate = new Date();
  return currentDate.toLocaleDateString('en-US', options);
};

export function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

export const getCompare = (time1, time2) => {
  // console.log(time1,time2)
  const [hours1, minutes1, ampm1] = time1.match(/(\d+):(\d+)\s([APMapm]{2})/).slice(1);
  const [hours2, minutes2, ampm2] = time2.match(/(\d+):(\d+)\s([APMapm]{2})/).slice(1);

  const militaryHours1 = ampm1.toUpperCase() === 'PM' ? parseInt(hours1, 10) + 12 : parseInt(hours1, 10);
  const militaryHours2 = ampm2.toUpperCase() === 'PM' ? parseInt(hours2, 10) + 12 : parseInt(hours2, 10);

  if (militaryHours1 === militaryHours2) {
    return parseInt(minutes1, 10) > parseInt(minutes2, 10);
  }

  // console.log(militaryHours1 > militaryHours2)
  return militaryHours1 > militaryHours2;
};
