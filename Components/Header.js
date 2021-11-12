import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

//NAVIGATION
import { useNavigation } from '@react-navigation/native';

//STYLES
import tw from 'tailwind-rn';
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();
  return (
    <View style={tw('p-2 flex-row items-center justify-between')}>
      <View style={tw('flex flex-row items-center')}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw('p-2')}>
          <Ionicons name="chevron-back-outline" size={32} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw('text-lg font-bold pl-2')}>{title}</Text>
      </View>

      {callEnabled && (
        <TouchableOpacity style={tw('rounded-full mr-4 p-4 bg-red-200')}>
          <Foundation name="telephone" sixe={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
