import React from 'react'
import { ApproveTabNavigation } from '../../navigation/MainNavigation'
import HeaderRight from './components/HeaderRight';



const ApproveTab = ({navigation}) => {


  React.useEffect(() => {
 
    navigation.setOptions({
      headerRight: () => {
       return (
        <HeaderRight navigation={navigation}/>
       )
      },
    });
  }, [navigation]);
  
  
  return (

    <ApproveTabNavigation />
    
  )
}

export default ApproveTab

