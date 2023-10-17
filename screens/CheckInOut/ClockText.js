import React, { useState ,useEffect} from 'react'
import { Text, StyleSheet } from 'react-native';


const  timeText = () => {
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    var h = h > 12 ? h - 12 : h;
    var ampm = d.getHours() >= 12 ? ' PM' : ' AM';
    const textContent =
      ('0' + h).substr(-2) +
      ':' +
      ('0' + m).substr(-2) +
      ':' +
      ('0' + s).substr(-2) +
      ampm;

    return textContent;
  }

const ClockText = () => {

    const [curTime,setCurTime] = useState(timeText);

    useEffect(() => {
       
        let Timer = setInterval(() => setCurTime(timeText),1000)
    
        // console.log(time());
        return () => clearInterval(Timer);
    
      }, []);


  return (
    <Text style={styles.clockText}>{curTime}</Text>
  )
}

export default ClockText;

const brownColor = '#797a7c';

const styles = StyleSheet.create({

    clockText: {
      fontSize: 40,
      color: brownColor,
      fontWeight: 'bold',
    },
    
  });
  