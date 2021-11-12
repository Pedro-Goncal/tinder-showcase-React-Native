import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

//NAVIGATION
import { useNavigation } from '@react-navigation/native';

//AUTH HOOK
import useAuth from '../hooks/useAuth';

//STYLES
import tw from 'tailwind-rn';

//FIREBASE
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { db } from '../firebase';

//UTILL FUNCTION
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const ChatRow = ({ matchDetails }) => {
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  const navigation = useNavigation();

  const { user } = useAuth();

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
    );
  }, [matchDetails, db]);

  return (
    <TouchableOpacity
      style={[
        tw('flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg'),
        styles.cardShadow,
      ]}
      onPress={() =>
        navigation.navigate('Message', {
          matchDetails,
        })
      }
    >
      <Image
        source={{ uri: matchedUserInfo?.photoURL }}
        style={tw('rounded-full h-16 w-16 mr-4')}
      />
      <View style={tw('')}>
        <Text style={tw('text-lg font-semibold')}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || 'Say Hi!'}</Text>
      </View>
    </TouchableOpacity>
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

export default ChatRow;
