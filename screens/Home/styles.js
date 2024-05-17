import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';

export default styles = StyleSheet.create({
  TopContainer: {
    flexDirection: 'row',
    margin: verticalScale(15),
    gap: horizontalScale(10),
    justifyContent: 'space-between',
  },
  avatorBox: {
    flexDirection: 'row',
    gap: horizontalScale(10),
  },
  avator: {
    width: 100,
    height: 100,
  },
  boxShadow: {
    height: 100,
    width: 100,
    // shadowColor: '#000000',
    // shadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    backgroundColor: '#ffffff',
    borderRadius: horizontalScale(100),
    paddingTop: verticalScale(5),
    elevation: 40,
    overflow: 'hidden',
  },
  secWrapper: {
    marginHorizontal: horizontalScale(20),
  },
  dateBox: {
    marginBottom: verticalScale(15),
  },
  boxWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: horizontalScale(15),
    marginTop: verticalScale(30),
    paddingBottom: verticalScale(20),
  },
  box: {
    backgroundColor: '#fff',
    width: '47%',
    alignItems: 'center',
    padding: horizontalScale(18),
    borderRadius: 10,
    elevation: 10,
  },
  boxImg: {
    width: 50,
    height: 50,
    marginBottom: verticalScale(10),
  },
  nameText: {
    fontSize: scaleFontSize(20),
    color: '#fff',
  },
  countText: {
    textAlign: 'center',
    fontSize: scaleFontSize(12),
    color: '#fff',
    fontWeight: '500',
  },
  countBox: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 30,
    height: 30,
    position: 'absolute',
    right: '30%',
    top: '10%',
    zIndex: 1000,
    // top:-10
  },
});
