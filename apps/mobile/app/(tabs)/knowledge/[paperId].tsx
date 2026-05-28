import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function PaperDetailScreen() {
  const { paperId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-[#fbf9f8]">
      <View className="px-6 pt-12 pb-4 border-b border-[#e4e2e2]">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-[#825500] font-medium">← Back to Hub</Text>
        </TouchableOpacity>
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-sm text-[#717975] uppercase font-bold tracking-wider">Artificial Intelligence</Text>
        </View>
        <Text className="text-3xl font-bold text-[#00261e] mb-4">Attention Is All You Need</Text>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-[#414845]">Published: Dec 2017</Text>
          <Text className="text-sm text-[#414845]">120,000 Citations</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="bg-[#f5f3f3] border border-[#e4e2e2] rounded-lg p-6 mb-8">
          <Text className="text-lg font-bold text-[#173c33] mb-2">Why it matters</Text>
          <Text className="text-[#1b1c1c] leading-6">
            This paper introduced the Transformer architecture, replacing recurrent neural networks (RNNs) with self-attention mechanisms. It is the foundation for all modern LLMs including GPT, Claude, and Gemini.
          </Text>
        </View>

        <Text className="text-xl font-bold text-[#00261e] mb-4">AI Summary</Text>
        <Text className="text-[#1b1c1c] leading-6 mb-8">
          The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
        </Text>

        <Text className="text-xl font-bold text-[#00261e] mb-4">Implementations & Tools</Text>
        <View className="bg-white border border-[#c1c8c4] rounded-lg p-5 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bold text-[#173c33]">huggingface/transformers</Text>
            <Text className="text-xs bg-[#fdba55] text-[#291800] px-2 py-1 rounded-sm font-medium">★ 120k</Text>
          </View>
          <Text className="text-sm text-[#414845] mb-4">State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.</Text>
          <TouchableOpacity className="border border-[#c1c8c4] py-2 rounded-sm items-center">
            <Text className="font-medium text-[#173c33]">View Repository</Text>
          </TouchableOpacity>
        </View>

        <View className="h-10" />
      </ScrollView>

      {/* Floating Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#e4e2e2] px-6 py-4 flex-row justify-between items-center pb-8">
        <TouchableOpacity className="flex-1 mr-2 bg-[#00261e] py-3 rounded-md items-center">
          <Text className="text-white font-medium">Save Paper</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 ml-2 bg-white border border-[#c1c8c4] py-3 rounded-md items-center">
          <Text className="text-[#00261e] font-medium">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
