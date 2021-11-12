import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//UTILL FUNCTION
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

//STYLES
import tw from 'tailwind-rn';

//NAVIGATION
import { useRoute } from '@react-navigation/native';

//FIREBASE
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from '@firebase/firestore';
import { db } from '../firebase';

//AUTH HOOK
import useAuth from '../hooks/useAuth';

//COMPOENENTS
import Header from '../Components/Header';
import SenderMessage from '../Components/SenderMessage';
import ReceiverMessage from '../Components/ReceiverMessage';

const MessagesScreen = () => {
  const [input, setInput] = useState(null);
  const [messages, setMessages] = useState([]);

  const { user } = useAuth();
  const { params } = useRoute();

  const { matchDetails } = params;

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches', matchDetails.id, 'messages'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );

  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });
    setInput('');
  };
  return (
    <SafeAreaView style={tw('flex-1')}>
      <Header
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        callEnabled
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw('flex-1')}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            inverted={1}
            data={messages}
            style={tw('pl-4')}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.userId === user.uid ? (
                <SenderMessage key={item.id} message={item} />
              ) : (
                <ReceiverMessage key={item.id} message={item} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={tw(
            'flex-row justify-between items-center border-t border-gray-200 px-5 py-2'
          )}
        >
          <TextInput
            style={tw('h-10 text-lg')}
            placeholder="Send Message...."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text style={{ color: '#FF5864' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagesScreen;
