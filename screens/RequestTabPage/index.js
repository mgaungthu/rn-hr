import React from 'react'
import { RequestTabNavigation } from '../../navigation/MainNavigation'
import HeaderRight from './components/HeaderRight';



const RequestTabPage = ({navigation}) => {

  
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

    <RequestTabNavigation />
    
  )
}

export default RequestTabPage

