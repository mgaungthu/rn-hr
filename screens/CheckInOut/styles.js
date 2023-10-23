import {StyleSheet} from "react-native";

const brownColor = '#797a7c';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  secWrapper: {
    flex: 1.3,
    alignItems: 'center',
    marginVertical: 25,
  },
  checkIntext: {
    color: '#4CAF50',
    fontSize: 19,
  },
  clockText: {
    fontSize: 40,
    color: brownColor,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 25,
    color: brownColor,
  },
  shiftText: {
    fontSize: 16,
    color: brownColor,
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: '#206aed',
    marginVertical: 15,
  },
  checkInOutBtn: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
});

export default styles