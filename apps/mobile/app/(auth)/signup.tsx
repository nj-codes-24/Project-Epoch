import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function SignupScreen() {
  return (
    <View className="flex-1 bg-[#fbf9f8] justify-center px-6">
      <View className="mb-10 items-center">
        <Text className="text-4xl text-[#00261e] font-bold mb-2">Join the Hub</Text>
        <Text className="text-base text-[#414845]">Create an account to start your learning journey</Text>
      </View>

      <View className="space-y-6">
        <View className="mb-4">
          <Text className="text-sm font-medium text-[#1b1c1c] mb-2">Email address</Text>
          <TextInput 
            className="w-full bg-white border border-[#c1c8c4] rounded-md px-4 py-3 text-base text-[#1b1c1c]"
            placeholder="you@university.edu"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-[#1b1c1c] mb-2">Password</Text>
          <TextInput 
            className="w-full bg-white border border-[#c1c8c4] rounded-md px-4 py-3 text-base text-[#1b1c1c]"
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        <Link href="/(auth)/onboarding" asChild>
          <TouchableOpacity className="w-full bg-[#00261e] py-4 rounded-md items-center">
            <Text className="text-white text-base font-medium">Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-[#414845] text-sm">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-[#825500] text-sm font-medium">Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
