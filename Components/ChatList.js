import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

//FIREBASE
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { db } from '../firebase';

//AUTH HOOK
import useAuth from '../hooks/useAuth';

//STYLES
import tw from 'tailwind-rn';

//COMPONENTS
import ChatRow from './ChatRow';

const ChatList = () => {
  const [matches, setMatches] = useState([]);

  const { user } = useAuth();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches'),
          where('usersMatched', 'array-contains', user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );

  return matches.length > 0 ? (
    <FlatList
      style={tw('h-full')}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tw('p-5')}>
      <Text style={tw('text-center text-lg')}>No matches at the moment</Text>
    </View>
  );
};

export default ChatList;
