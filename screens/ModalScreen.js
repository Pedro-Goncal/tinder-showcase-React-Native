import React, { useState } from 'react';
import {
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//FIREBASE
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { db } from '../firebase';

//STYLES
import tw from 'tailwind-rn';

//AUTH HOOK
import useAuth from '../hooks/useAuth';

//NAVIGATION
import { useNavigation } from '@react-navigation/native';

const ModalScreen = () => {
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const { user } = useAuth();

  const navigation = useNavigation();

  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => navigation.navigate('Home'))
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={tw('flex-1 items-center pt-1 ')}>
      <ScrollView>
        <Image
          style={tw('h-20 w-full')}
          resizeMode="contain"
          source={{ uri: 'https://links.papareact.com/2pf' }}
        />
        <Text style={tw('text-xl text-gray-500 p-2 font-bold')}>
          Welcome {user.displayName}
        </Text>
        <Text style={tw('text-center p-4 font-bold text-red-400')}>
          Step 1: The profile Picture
        </Text>

        <TextInput
          placeholder="Enter profile Pic URL"
          style={tw('text-center text-xl pb-2')}
          value={image}
          onChangeText={setImage}
        />
        <Text style={tw('text-center p-4 font-bold text-red-400')}>
          Step 2: The Ocupation
        </Text>

        <TextInput
          placeholder="Enter your ocupation"
          style={tw('text-center text-xl pb-2')}
          value={job}
          onChangeText={setJob}
        />
        <Text style={tw('text-center p-4 font-bold text-red-400')}>
          Step 3: The Age
        </Text>

        <TextInput
          placeholder="Enter your age"
          style={tw('text-center text-xl pb-2')}
          value={age}
          onChangeText={setAge}
          maxLength={2}
          keyboardType="numeric"
        />
      </ScrollView>

      <TouchableOpacity
        style={[
          tw('w-64 p-3 rounded-xl absolute bottom-5'),
          incompleteForm ? tw('bg-gray-400') : tw('bg-red-400'),
        ]}
        disable={incompleteForm}
        onPress={updateUserProfile}
      >
        <Text style={tw('text-center text-white text-xl')}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ModalScreen;

///https://avatars.githubusercontent.com/Pedro-Goncal
