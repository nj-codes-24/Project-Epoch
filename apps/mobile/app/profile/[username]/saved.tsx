import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getAnonSupabase, getSavedPapers, getSavedTools } from '@api';

export default function ProfileSavedScreen() {
  const { username } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'papers' | 'tools'>('papers');
  const [savedPapers, setSavedPapers] = useState<any[]>([]);
  const [savedTools, setSavedTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock ID until real Auth is integrated
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getAnonSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || '11111111-1111-1111-1111-111111111111';
        const [papersResult, toolsResult] = await Promise.all([
          getSavedPapers(supabase, userId),
          getSavedTools(supabase, userId)
        ]);
        
        setSavedPapers(papersResult);
        setSavedTools(toolsResult);
      } catch (error) {
        console.error("Failed to load saved items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-[#fbf9f8]">
      <View className="px-6 pt-12 pb-4 border-b border-[#e4e2e2]">
        <TouchableOpacity onPress={() => router.push('/(tabs)/knowledge')} className="mb-4">
          <Text className="text-[#825500] font-medium">← Back to Hub</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-[#00261e] mb-1">{username}'s Profile</Text>
        <Text className="text-[#414845]">Proof of Work and Saved Resources</Text>
      </View>

      <View className="flex-row border-b border-[#e4e2e2]">
        <TouchableOpacity 
          onPress={() => setActiveTab('papers')}
          className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'papers' ? 'border-[#00261e]' : 'border-transparent'}`}
        >
          <Text className={`font-medium ${activeTab === 'papers' ? 'text-[#00261e]' : 'text-[#414845]'}`}>
            Saved Papers ({savedPapers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('tools')}
          className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'tools' ? 'border-[#00261e]' : 'border-transparent'}`}
        >
          <Text className={`font-medium ${activeTab === 'tools' ? 'text-[#00261e]' : 'text-[#414845]'}`}>
            Saved Tools ({savedTools.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6">
        {isLoading ? (
          <View className="py-12 items-center">
            <Text className="text-[#414845]">Loading saved items...</Text>
          </View>
        ) : activeTab === 'papers' ? (
          savedPapers.length === 0 ? (
            <View className="bg-[#f5f3f3] border border-[#e4e2e2] rounded-lg p-6 items-center">
              <Text className="text-[#414845]">No saved papers yet.</Text>
            </View>
          ) : (
            <View className="space-y-4">
              {savedPapers.map(paper => (
                <View key={paper.id} className="bg-white border border-[#c1c8c4] rounded-lg p-5 shadow-sm mb-4">
                  <Text className="text-lg font-bold text-[#00261e] mb-2">{paper.plain_title || paper.title}</Text>
                  <Text className="text-xs text-[#717975] mb-4">Saved resource</Text>
                  
                  <View className="flex-row gap-2 pt-3 border-t border-[#e4e2e2]">
                    <TouchableOpacity className="flex-1 bg-[#00261e] py-2 rounded-sm items-center">
                      <Text className="text-white font-medium">Read</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-[#f5f3f3] border border-[#e4e2e2] py-2 rounded-sm items-center">
                      <Text className="text-[#1b1c1c] font-medium">Unsave</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )
        ) : (
          savedTools.length === 0 ? (
            <View className="bg-[#f5f3f3] border border-[#e4e2e2] rounded-lg p-6 items-center">
              <Text className="text-[#414845]">No saved tools yet.</Text>
            </View>
          ) : (
            <View className="space-y-4">
              {savedTools.map(tool => (
                <View key={tool.id} className="bg-white border border-[#c1c8c4] rounded-lg p-5 shadow-sm">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-bold text-[#173c33] flex-1">{tool.name}</Text>
                    <View className="bg-[#fdba55] px-2 py-1 rounded-sm ml-2">
                      <Text className="text-[#291800] font-medium text-xs">★ {tool.github_stars}</Text>
                    </View>
                  </View>
                  <Text className="text-sm text-[#414845] mb-4">{tool.description}</Text>
                  
                  <View className="flex-row gap-2 pt-3 border-t border-[#e4e2e2]">
                    <TouchableOpacity 
                      onPress={() => tool.github_url && Linking.openURL(tool.github_url)}
                      className="flex-1 bg-[#00261e] py-2 rounded-sm items-center"
                    >
                      <Text className="text-white font-medium">View Repo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-[#f5f3f3] border border-[#e4e2e2] py-2 rounded-sm items-center">
                      <Text className="text-[#1b1c1c] font-medium">Unsave</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
