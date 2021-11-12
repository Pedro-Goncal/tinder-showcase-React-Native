import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//NAVIGATION
import { useNavigation } from '@react-navigation/native';

//AUTH HOOK
import useAuth from '../hooks/useAuth';

//SWIPER
import Swiper from 'react-native-deck-swiper';

//Styles
import tw from 'tailwind-rn';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign, Entypo, Ionicons, Fontisto } from '@expo/vector-icons';

//FIREBASE
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp,
} from '@firebase/firestore';
import { db } from '../firebase';

//UTILL FUNCTION
import generateId from '../lib/generateId';

const HomeScreen = () => {
  const [profiles, setProfiles] = useState([]);

  const navigation = useNavigation();

  const { user, logout } = useAuth();

  const swipRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate('Modal');
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, 'users', user.uid, 'passes')
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, 'users', user.uid, 'swipes')
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      unsub = onSnapshot(
        query(
          collection(db, 'users'),
          where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [db]);

  //SWIPE LEFT
  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  };

  //SWIPE RIGHT
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    const loggedInProfile = await (
      await getDoc(doc(db, 'users', user.uid))
    ).data();

    //Check If the user swiped on you
    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid))
      .then((documentSnapshot) => {
        if (documentSnapshot.exists()) {
          setDoc(
            doc(db, 'users', user.uid, 'swipes', userSwiped.id),
            userSwiped
          );

          //Create a Match
          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timeStamp: serverTimestamp(),
          });

          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped,
          });
        } else {
          setDoc(
            doc(db, 'users', user.uid, 'swipes', userSwiped.id),
            userSwiped
          );
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      {/* HEADER */}

      <View style={tw('flex-row items-center justify-between px-5')}>
        <TouchableOpacity onPress={logout}>
          <Image
            source={{ uri: user.photoURL }}
            style={tw('h-10 w-10 rounded-full')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Fontisto name="tinder" size={60} color="#FF5864" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      {/* END OF HEADER */}

      {/* CARDS */}
      <View style={tw('flex-1 -mt-6')}>
        <Swiper
          ref={swipRef}
          containerStyle={{ backgroundColor: 'transparent' }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: { label: { textAlign: 'right', color: 'red' } },
            },
            right: {
              title: 'LIKE',
              style: { label: { textAlign: 'left', color: '#4DED30' } },
            },
          }}
          onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
          verticalSwipe={false}
          renderCard={(card) =>
            card ? (
              <View key={card.id} style={tw('bg-red-500 h-3/4 rounded-xl')}>
                <Image
                  style={tw('absolute top-0 h-full w-full rounded-xl')}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw(
                      'flex-row absolute bottom-0 bg-white w-full h-20 justify-between items-center px-6 py-2 rounded-b-xl'
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw('text-xl font-bold')}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw('text-2xl font-bold')}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    'relative bg-white h-3/4 rounded-xl justify-center items-center'
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw('font-bold pb-5')}>No More Profiles</Text>
                <FontAwesome5 name="sad-tear" size={80} color="#FF5864" />
              </View>
            )
          }
        />
      </View>

      <View style={tw('flex flex-row justify-evenly pb-5')}>
        <TouchableOpacity
          onPress={() => swipRef.current.swipeLeft()}
          style={tw(
            'items-center justify-center rounded-full w-16 h-16 bg-red-200'
          )}
        >
          <Entypo size={24} name="cross" color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipRef.current.swipeRight()}
          style={tw(
            'items-center justify-center rounded-full w-16 h-16 bg-green-200'
          )}
        >
          <AntDesign size={24} name="heart" color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default HomeScreen;
