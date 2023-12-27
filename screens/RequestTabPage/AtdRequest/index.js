import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigationState} from '@react-navigation/native';
import {
  callAttendanceRequestAll,
  callAttendanceRequestList as callatdReq,
} from '../../../api';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import CustomModal from '../../../components/CustomModel';
import LoadingScreen from '../../../components/LoadingScreen';
import FloatActionBtn from '../components/FloatActionBtn';
import {useSelectContext} from '../SelectContext';
import {setAttendanceRequests} from '../../../redux/reducers/attendanceList';

const AtdRequest = ({route, navigation, navigation: {setParams}}) => {
  const [atData, setAtData] = useState([]);
  const [visibleData, setVisibleData] = useState([]); // Data to be displayed
  const [visibleItemCount, setVisibleItemCount] = useState(10); // Initial number of items to display
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    setActiveTab,
    setShowAll,
    showAll,
    setSelectedItems,
    selectedItems,
    toggleSelection,
    setData,
  } = useSelectContext();

  const {user_info, access_token} = useSelector(state => state.user);

  const navigationState = useNavigationState(state => state);

  const activeTabRoute = navigationState.routes[navigationState.index];

  const activeTabName = activeTabRoute ? activeTabRoute.name : null;
  const dispatch = useDispatch();

  const scrollViewRef = useRef();

  useEffect(() => {
    setActiveTab(activeTabName);
    // console.log(activeTabName)
    setVisibleItemCount(10);
  }, [activeTabName]);

  useEffect(() => {
    setLoading(true);
    callAttendanceRequestList();
    if (route.params?.showModal) {
      // setShowAll(false)
      setLoading(false);
      setSelectedItems([]);
      setVisibleData([]);
      setMessage(route.params?.message);
      setParams({showModal: false});
      toggleModal();
    }

    return () => {
      toggleModal();
    };
  }, [route.params?.showModal]);

  useEffect(() => {
    // Slice the data array to include only the visible items

    if (atData?.length > 0) {
      const slicedData = atData?.slice(0, visibleItemCount);
      setVisibleData(slicedData);
    }
  }, [visibleItemCount, atData]);

  const toggleModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  };

  const callAttendanceRequestList = () => {
    if (user_info.approved_person) {

      callAttendanceRequestAll(access_token)
        .then(response => {
          if (response.status) {
            setAtData(response.data);
            if (response.data) {
              dispatch(setAttendanceRequests(response.data));
              const filteredData = response.data.filter(
                item => item.statusby_manager === 0,
              );
              // console.log(filteredData)
              setData(prevData => ({
                ...prevData,
                atRequest: [...filteredData],
              }));
            }
          }
        })
        .catch(() => alert('Internet Connection Error'))
        .finally(() => setLoading(false));
    } else {
      callatdReq(access_token)
        .then(response => {
          setAtData(response.data);
        })
        .catch(() => alert('Internet Connection Error'))
        .finally(() => setLoading(false));
    }
  };

  const handleScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction =
      currentOffset > (scrollViewRef.current?.lastOffset || 0) ? 'down' : 'up';

    // Check if the user is pulling up
    if (direction === 'down') {
      setTimeout(() => {
        const newVisibleItemCount = visibleItemCount + 5;
        setVisibleItemCount(newVisibleItemCount);
      }, 1000);

      // Add your logic here
    } else {
      setVisibleItemCount(10);
    }

    // Save the current offset for the next comparison
    scrollViewRef.current.lastOffset = currentOffset;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // console.log(visibleData)

  if (visibleData.length === 0) {
    return (
      <>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 16, color: '#000'}}>
            You have no Attendance request
          </Text>
        </View>
        <FloatActionBtn activeTabName={activeTabName} navigation={navigation} />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomModal
        title={message}
        isVisible={isModalVisible}
        jsonPath={require('../../../assets/animations/success-checkmark.json')}
      />
      <FlatList
        ref={scrollViewRef}
        data={visibleData}
        renderItem={({item}) => (
          <Item
            key={item.id}
            setShowAll={setShowAll}
            showAll={showAll}
            title={item.title}
            name={item.name}
            toggleSelection={toggleSelection}
            selectedItems={selectedItems}
            status={item.status}
            date={item.date}
            id={item.id}
            navigation={navigation}
            statusbyManager={item.statusby_manager}
            keyExtractor={item => item.id}
            user_info={user_info}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {loading && <LoadingScreen />}

      <FloatActionBtn activeTabName={activeTabName} navigation={navigation} />
    </SafeAreaView>
  );
};

const Item = ({
  setShowAll,
  showAll,
  title,
  name,
  status,
  date,
  id,
  navigation,
  statusbyManager,
  selectedItems,
  toggleSelection,
  user_info
}) => {
  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor:
            selectedItems.includes(id) && !statusbyManager ? '#ddd' : '#fff',
        },
      ]}>
      <TouchableOpacity
        onLongPress={() => {
          setShowAll(true);
          toggleSelection(id);
        }}
        delayLongPress={1000}
        disabled={statusbyManager == 0 || null ? false : true}
        onPress={() => {
          selectedItems.length === 1 || showAll
            ? toggleSelection(id)
            : navigation.navigate('attendanceRequestForm', {
                id: id,
                isEdit: true,
              });
        }}>
        <View style={styles.rowWrapper}>
          <View style={styles.rowWrapper}>
            <View
              style={[
                styles.statusCircle,
                {backgroundColor: status === 1 ? '#43A047' : '#a7e34d'},
              ]}>
              <Text style={styles.circleText}>{status === 1 ? 'A' : 'P'}</Text>
            </View>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>
          <View style={styles.rightCenter}>
            {user_info.approved_person === 1 && (
              <Text style={[styles.title]}>{name}</Text>
            )}
            
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AtdRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fff',
    padding: horizontalScale(12),
  },
  title: {
    fontSize: scaleFontSize(14),
    color: '#206aed',
  },
  dateText: {
    color: '#8bc34a',
  },
  statusCircle: {
    justifyContent: 'center',
    // padding: horizontalScale(10),
    width: 45,
    height: 45,
    borderRadius: 100,
    marginRight: verticalScale(13),
  },
  circleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '900',
  },
  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightCenter:{
    width:130,
    textAlign:"center"
  }
});
