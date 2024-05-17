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
import {getAllOverTime} from '../../../api';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import CustomModal from '../../../components/CustomModel';
import LoadingScreen from '../../../components/LoadingScreen';
import FloatActionBtn from '../components/FloatActionBtn';
import {useSelectContext} from '../SelectContext';
import {setOverTimeRequests} from '../../../redux/reducers/overTimeList';

const OtApprove = ({route, navigation, navigation: {setParams}}) => {
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
  const dispatch = useDispatch();

  const {access_token} = useSelector(state => state.user);

  const navigationState = useNavigationState(state => state);

  const activeTabRoute = navigationState.routes[navigationState.index];

  const activeTabName = activeTabRoute ? activeTabRoute.name : null;

  const scrollViewRef = useRef();

  useEffect(() => {
    setActiveTab(activeTabName);
    // console.log(activeTabName)
    setVisibleItemCount(10);
  }, [activeTabName]);

  useEffect(() => {
    setLoading(true);
    callOverTimeist();
    if (route.params?.showModal) {
      setLoading(false);
      setSelectedItems([]);
      setVisibleData([]);
      setMessage(route.params?.message);
      // toggleModal();
      setParams({showModal: false});
    }

    return () => {
      setParams({showModal: false});
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

  const callOverTimeist = () => {
    getAllOverTime(access_token)
      .then(response => {
        // console.log(response.data);
        if (response.status) {
          setAtData(response.data);
          if (response.data) {
            dispatch(setOverTimeRequests(response.data));
            const filteredData = response.data.filter(
              item => item.statusby_manager === 0,
            );
            setData(prevData => ({
              ...prevData,
              overTimeRequest: [...filteredData],
            }));
          }
        }
      })
      .catch(errr => {
        console.log(errr);
        alert('Internet Connection Error');
      })
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

  // console.log(visibleData)

  if (visibleData.length === 0) {
    return (
      <>
        <CustomModal
          title={message}
          isVisible={isModalVisible}
          jsonPath={require('../../../assets/animations/success-checkmark.json')}
        />
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 16, color: '#000'}}>
            You have no Overtime request
          </Text>
        </View>
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
            name={item.employee.name}
            totalHour={item.total_hours * 1}
            from_date={item.from_date}
            to_date={item.to_date}
            selectedItems={selectedItems}
            id={item.id}
            navigation={navigation}
            statusbyManager={item.statusby_manager}
            setShowAll={setShowAll}
            toggleSelection={toggleSelection}
            keyExtractor={item => item.id}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {loading && <LoadingScreen />}
    </SafeAreaView>
  );
};

const Item = ({
  name,
  totalHour,
  id,
  navigation,
  from_date,
  to_date,
  statusbyManager,
  selectedItems,
  setShowAll,
  toggleSelection,
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
        disabled={statusbyManager == 0 || null ? false : true}
        onLongPress={() => {
          setShowAll(true);
          toggleSelection(id);
        }}
        delayLongPress={1000}
        onPress={() =>
          navigation.navigate('OverTimeApproveForm', {
            // leave_id: leave_id,
            id: id,
            isEdit: true,
          })
        }>
        <View style={styles.rowWrapper}>
          <View style={styles.leftBox}>
            <View
              style={[
                styles.statusCircle,
                {
                  backgroundColor:
                    statusbyManager === 1 ? '#43A047' : '#a7e34d',
                },
              ]}>
              <Text style={styles.circleText}>
                {statusbyManager === 1 ? 'A' : 'P'}
              </Text>
            </View>
            <View>
              <Text style={styles.dateText}>
                {from_date} - {to_date}
              </Text>
              {/* <Text style={styles.dateText}>{differenceInDays}</Text> */}
            </View>
          </View>

          <View style={styles.rightBox}>
            <Text style={styles.title}>{name}</Text>
            <Text
              style={[
                styles.title,
                {fontSize: scaleFontSize(12), color: '#000'},
              ]}>{`(Total Hour - ${totalHour})`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OtApprove;

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
    fontSize: scaleFontSize(13),
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
