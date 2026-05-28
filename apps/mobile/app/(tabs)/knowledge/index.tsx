import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';

export default function KnowledgeFeedScreen() {
  const categories = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science'
  ];

  const mockPapers = [
    { id: '1', title: 'Attention Is All You Need', summary: 'The foundational transformer paper.', citations: 120000 },
    { id: '2', title: 'Generative Agents', summary: 'Interactive simulacra of human behavior.', citations: 1400 }
  ];

  return (
    <View className="flex-1 bg-[#fbf9f8]">
      <View className="px-6 pt-12 pb-4 flex-row justify-between items-center border-b border-[#e4e2e2]">
        <View>
          <Text className="text-2xl font-bold text-[#00261e]">The Knowledge Hub</Text>
          <Text className="text-sm text-[#414845]">Curated research for your learning journey.</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/knowledge/search')}
          className="bg-[#173c33] px-4 py-2 rounded-md"
        >
          <Text className="text-white font-medium">Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {categories.map((category) => (
          <View key={category} className="mb-8">
            <View className="px-6 flex-row items-center gap-2 mb-4 mt-6">
              <Text className="text-xl font-bold text-[#173c33]">{category}</Text>
              <View className="bg-[#dbdad9] px-2 py-1 rounded-sm">
                <Text className="text-xs text-[#1b1c1c] font-medium">New</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 pb-2" contentContainerStyle={{ paddingRight: 40 }}>
              {mockPapers.map(paper => (
                <View key={paper.id} className="w-72 bg-white border border-[#c1c8c4] rounded-lg p-5 mr-4 overflow-hidden relative shadow-sm">
                  {paper.citations > 10000 && (
                    <View className="absolute top-0 left-0 right-0 h-1 bg-[#fdba55]" />
                  )}
                  <Text className="text-lg font-bold text-[#00261e] mb-2" numberOfLines={2}>{paper.title}</Text>
                  <Text className="text-sm text-[#1b1c1c] mb-4" numberOfLines={3}>{paper.summary}</Text>
                  
                  <View className="flex-1 justify-end">
                    <View className="flex-row justify-between items-center pt-3 border-t border-[#e4e2e2]">
                      <Text className="text-xs text-[#717975]">{paper.citations} Citations</Text>
                      <View className="flex-row gap-2">
                        <Link href={`/(tabs)/knowledge/${paper.id}`} asChild>
                          <TouchableOpacity className="border border-[#c1c8c4] px-3 py-1 rounded-sm">
                            <Text className="text-xs font-medium text-[#173c33]">View</Text>
                          </TouchableOpacity>
                        </Link>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
