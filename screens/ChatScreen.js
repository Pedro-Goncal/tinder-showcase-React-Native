import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

//COMPONENTS
import Header from '../Components/Header';
import ChatList from '../Components/ChatList';

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
