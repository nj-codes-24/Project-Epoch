import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

const SKILLS = [
  'Code', 'Design', 'Writing', 'Research', 'Strategy', 'Analysis', 
  'Marketing', 'Sales', 'Finance', 'Legal', 'Product', 'Operations', 
  'Data', 'Video & Media', 'Community', 'Fundraising'
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleFinish = () => router.replace('/(tabs)/knowledge');

  return (
    <View className="flex-1 bg-[#fbf9f8] px-6 pt-12 pb-6">
      {/* Step Indicators */}
      <View className="flex-row gap-2 mb-10 justify-center">
        {[1, 2, 3].map(i => (
          <View 
            key={i} 
            className={`h-2 rounded-full flex-1 ${i <= step ? 'bg-[#00261e]' : 'bg-[#dbdad9]'}`}
          />
        ))}
      </View>

      {/* Step 1: Username */}
      {step === 1 && (
        <View className="flex-1">
          <Text className="text-3xl text-[#00261e] font-bold mb-2 text-center">Claim your identity</Text>
          <Text className="text-base text-[#414845] text-center mb-8">
            This is how other builders will know you.
          </Text>
          
          <View className="mb-8">
            <Text className="text-sm font-medium text-[#1b1c1c] mb-2">Username</Text>
            <View className="flex-row items-center bg-white border border-[#c1c8c4] rounded-md px-4">
              <Text className="text-[#717975] text-base mr-2">@</Text>
              <TextInput 
                value={username}
                onChangeText={setUsername}
                className="flex-1 py-4 text-base text-[#1b1c1c]"
                placeholder="builder123"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="flex-1 justify-end">
            <TouchableOpacity 
              onPress={handleNext}
              disabled={!username.trim()}
              className={`w-full py-4 rounded-md items-center ${username.trim() ? 'bg-[#00261e]' : 'bg-[#c1c8c4]'}`}
            >
              <Text className="text-white text-base font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <View className="flex-1">
          <Text className="text-3xl text-[#00261e] font-bold mb-2 text-center">What do you build?</Text>
          <Text className="text-base text-[#414845] text-center mb-6">
            Select up to 3 core skills to curate your feed.
          </Text>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-center gap-3 pb-8">
              {SKILLS.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    onPress={() => handleSkillToggle(skill)}
                    className={`px-4 py-3 rounded-md border ${
                      isSelected 
                        ? 'bg-[#fdba55] border-[#fdba55]' 
                        : 'bg-white border-[#c1c8c4]'
                    }`}
                  >
                    <Text className={`text-base font-medium ${isSelected ? 'text-[#291800]' : 'text-[#1b1c1c]'}`}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View className="pt-4">
            <TouchableOpacity 
              onPress={handleNext}
              disabled={selectedSkills.length === 0}
              className={`w-full py-4 rounded-md items-center ${selectedSkills.length > 0 ? 'bg-[#00261e]' : 'bg-[#c1c8c4]'}`}
            >
              <Text className="text-white text-base font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3: GitHub Connect */}
      {step === 3 && (
        <View className="flex-1">
          <Text className="text-3xl text-[#00261e] font-bold mb-2 text-center">Connect GitHub</Text>
          <Text className="text-base text-[#414845] text-center mb-8">
            Required to participate in code contribution tasks and build your Proof of Work.
          </Text>

          <View className="bg-[#f5f3f3] rounded-xl p-8 items-center border border-[#e4e2e2] mb-8">
            <Text className="text-4xl mb-4">🐙</Text>
            <TouchableOpacity className="bg-[#24292e] px-8 py-3 rounded-md w-full items-center">
              <Text className="text-white font-medium text-base">Connect GitHub</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-end space-y-4">
            <TouchableOpacity 
              onPress={handleFinish}
              className="w-full bg-[#00261e] py-4 rounded-md items-center mb-4"
            >
              <Text className="text-white text-base font-medium">Continue to Hub</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleFinish} className="items-center py-2">
              <Text className="text-base text-[#414845]">Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
