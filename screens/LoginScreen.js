import React, { useLayoutEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';

//NAVIGATION
import { useNavigation } from '@react-navigation/native';

//AUTH HOOK
import useAuth from '../hooks/useAuth';

//STYLES
import tw from 'tailwind-rn';

const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();

  const navigation = useNavigation();

  useLayoutEffect(() => navigation.setOptions({ headerShown: false }), []);

  return (
    <View style={tw('flex-1')}>
      <ImageBackground
        source={{ uri: 'https://tinder.com/static/tinder.png' }}
        resizeMode="cover"
        style={tw(`flex-1 `)}
      >
        <TouchableOpacity
          style={[
            tw('absolute bottom-40 w-52 bg-white p-4 rounded-2xl'),
            { marginHorizontal: '25%' },
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tw('font-semibold text-center')}>
            Sign in & get Swipping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
