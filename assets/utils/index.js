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
