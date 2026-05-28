import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-[#fbf9f8] justify-center px-6">
      <View className="mb-10 items-center">
        <Text className="text-4xl text-[#00261e] font-bold mb-2">Welcome Back</Text>
        <Text className="text-base text-[#414845]">Sign in to continue to The Knowledge Hub</Text>
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

        <TouchableOpacity className="w-full bg-[#00261e] py-4 rounded-md items-center">
          <Text className="text-white text-base font-medium">Sign In</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-[#414845] text-sm">Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-[#825500] text-sm font-medium">Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
