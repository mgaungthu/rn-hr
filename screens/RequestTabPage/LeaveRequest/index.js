import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigationState} from '@react-navigation/native';
import {callLeaveHistoryAll, callLeaveHistoryListApi} from '../../../api';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import CustomModal from '../../../components/CustomModel';
import LoadingScreen from '../../../components/LoadingScreen';
import FloatActionBtn from '../components/FloatActionBtn';
import {useSelectContext} from '../SelectContext';
import {setLeaveRequests} from '../../../redux/reducers/leaveList';

const LeaveRequest = ({route, navigation, navigation: {setParams}, state}) => {
  const [atData, setAtData] = useState([]);
  const [visibleData, setVisibleData] = useState([]); // Data to be displayed
  const [visibleItemCount, setVisibleItemCount] = useState(10); // Initial number of items to display
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const {access_token, user_info} = useSelector(state => state.user);

  const navigationState = useNavigationState(state => state);

  const activeTabRoute = navigationState.routes[navigationState.index];

  const activeTabName = activeTabRoute ? activeTabRoute.name : null;

  const {
    setShowAll,
    showAll,
    setSelectedItems,
    selectedItems,
    toggleSelection,
    toggleSelectAll,
    setData,
  } = useSelectContext();

  const scrollViewRef = useRef();

  useEffect(() => {
    setLoading(true);
    callLeaveHistoryList();
    if (route.params?.showModal) {
      setLoading(false);
      setMessage(route.params?.message);
      setParams({showModal: false});
      toggleModal();
    }

    return () => {
      callLeaveHistoryList();
      toggleModal();
    };
  }, [route.params?.showModal]);

  useEffect(() => {
    // Slice the data array to include only the visible items
    const slicedData = atData?.slice(0, visibleItemCount);
    setVisibleData(slicedData);
  }, [visibleItemCount, atData]);

  const toggleModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  };

  const callLeaveHistoryList = () => {
      callLeaveHistoryListApi(access_token)
        .then(response => {
          setAtData(response.data);
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!atData || atData.length === 0) {
    return (
      <>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: scaleFontSize(16), color: '#000'}}>
            You have no Leave request
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
            toggleSelection={toggleSelection}
            selectedItems={selectedItems}
            title={item.leave_name}
            from_date={item.from_date}
            to_date={item.to_date}
            id={item.id}
            name={item.name}
            leave_id={item.leave_id}
            totalDay={item.total_day}
            leave_type_name={item.leave_type_name}
            navigation={navigation}
            statusbyManager={item.statusby_manager}
            user_info={user_info}
            keyExtractor={item => item.id}
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
  selectedItems,
  toggleSelection,
  title,
  name,
  from_date,
  to_date,
  totalDay,
  leave_type_name,
  id,
  leave_id,
  navigation,
  statusbyManager,
  user_info
}) => (
  <View
    style={[
      styles.item,
      {
        backgroundColor:
          selectedItems.some(item => Object.values(item).includes(id)) &&
          !statusbyManager
            ? '#ddd'
            : '#fff',
      },
    ]}>
    <TouchableOpacity
      onPress={() => navigation.navigate('leaveRequestForm', {
        leave_id: leave_id,
        id: id,
        isEdit: true,
      })}>
      <View style={styles.rowWrapper}>
        <View style={styles.leftBox}>
          <View
            style={[
              styles.statusCircle,
              {backgroundColor: statusbyManager === 1 ? '#43A047' : '#a7e34d'},
            ]}>
            <Text style={styles.circleText}>
              {statusbyManager === 1 ? 'A' : 'P'}
            </Text>
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.dateText}>
              {from_date} - {to_date}
            </Text>
          </View>
        </View>

        <View style={styles.rightBox}>
          <Text
            style={[
              styles.title,
              {fontSize: scaleFontSize(12), color: '#000'},
            ]}>{`(Total Day - ${totalDay}) ${leave_type_name}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

export default LeaveRequest;

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
    fontSize: scaleFontSize(12),
    color: '#8bc34a',
  },
  statusCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    // padding: horizontalScale(10),
    width: 45,
    height: 45,
    borderRadius: 100,
    marginRight: verticalScale(8),
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
    justifyContent: 'space-between',
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
