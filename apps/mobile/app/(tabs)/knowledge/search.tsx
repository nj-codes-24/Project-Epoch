import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { getAnonSupabase, searchPapers, searchToolsFromGitHub } from '@api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'papers' | 'tools'>('papers');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [papers, setPapers] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      const supabase = getAnonSupabase();
      
      const [papersResult, toolsResult] = await Promise.all([
        searchPapers(supabase, query),
        searchToolsFromGitHub(query).catch(() => [])
      ]);
      
      setPapers(papersResult);
      setTools(toolsResult);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  return (
    <View className="flex-1 bg-[#fbf9f8]">
      <View className="px-6 pt-12 pb-4 border-b border-[#e4e2e2]">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-[#825500] font-medium">← Back to Hub</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-[#00261e] mb-4">Search</Text>
        
        <View className="flex-row bg-white border border-[#c1c8c4] rounded-full overflow-hidden">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search topics, papers, or tools..."
            className="flex-1 px-4 py-3 text-base text-[#1b1c1c]"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            onPress={handleSearch} 
            disabled={isSearching}
            className={`px-6 justify-center items-center ${isSearching ? 'bg-[#c1c8c4]' : 'bg-[#00261e]'}`}
          >
            <Text className="text-white font-medium">{isSearching ? '...' : 'Search'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row border-b border-[#e4e2e2]">
        <TouchableOpacity 
          onPress={() => setActiveTab('papers')}
          className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'papers' ? 'border-[#00261e]' : 'border-transparent'}`}
        >
          <Text className={`font-medium ${activeTab === 'papers' ? 'text-[#00261e]' : 'text-[#414845]'}`}>
            Research Papers {hasSearched && `(${papers.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('tools')}
          className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'tools' ? 'border-[#00261e]' : 'border-transparent'}`}
        >
          <Text className={`font-medium ${activeTab === 'tools' ? 'text-[#00261e]' : 'text-[#414845]'}`}>
            Open Source Tools {hasSearched && `(${tools.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6">
        {isSearching ? (
          <View className="py-12 items-center">
            <Text className="text-[#414845]">Searching...</Text>
          </View>
        ) : !hasSearched ? (
          <View className="bg-[#f5f3f3] border border-[#e4e2e2] rounded-lg p-6 items-center">
            <Text className="text-center text-[#414845] leading-6">
              Enter a topic above to search our curated papers or find open-source tools from GitHub.
            </Text>
          </View>
        ) : activeTab === 'papers' ? (
          papers.length === 0 ? (
            <View className="bg-white border border-[#c1c8c4] rounded-lg p-6 items-center">
              <Text className="text-lg font-bold text-[#00261e] mb-2">No research papers found.</Text>
              <Text className="text-center text-[#414845] leading-6">
                We don't have research papers on "{query}" yet. Our database updates daily via ArXiv and Semantic Scholar. Check back soon.
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {papers.map(paper => (
                <View key={paper.id} className="bg-white border border-[#c1c8c4] rounded-lg p-5 mb-4">
                  <Text className="text-lg font-bold text-[#00261e] mb-2">{paper.plain_title || paper.title}</Text>
                  <Text className="text-[#1b1c1c] mb-4" numberOfLines={3}>{paper.summary}</Text>
                  <View className="flex-row justify-between items-center pt-3 border-t border-[#e4e2e2]">
                    <Text className="text-sm text-[#717975]">{paper.citation_count} Citations</Text>
                    <TouchableOpacity className="border border-[#c1c8c4] px-4 py-2 rounded-sm">
                      <Text className="text-[#173c33] font-medium">Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )
        ) : (
          tools.length === 0 ? (
            <View className="bg-white border border-[#c1c8c4] rounded-lg p-6 items-center">
              <Text className="text-lg font-bold text-[#00261e] mb-2">No tools found.</Text>
              <Text className="text-center text-[#414845] leading-6">
                We couldn't find any GitHub repositories matching "{query}".
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {tools.map(tool => (
                <View key={tool.html_url} className="bg-white border border-[#c1c8c4] rounded-lg p-5 mb-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-bold text-[#173c33] flex-1">{tool.name}</Text>
                    <View className="bg-[#fdba55] px-2 py-1 rounded-sm ml-2">
                      <Text className="text-[#291800] font-medium text-xs">★ {tool.stars >= 1000 ? (tool.stars / 1000).toFixed(1) + 'k' : tool.stars}</Text>
                    </View>
                  </View>
                  <Text className="text-[#414845] mb-4">{tool.description}</Text>
                  <View className="flex-row gap-2 pt-3 border-t border-[#e4e2e2]">
                    <TouchableOpacity 
                      onPress={() => Linking.openURL(tool.html_url)}
                      className="flex-1 bg-[#00261e] py-2 rounded-sm items-center"
                    >
                      <Text className="text-white font-medium">View Repo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-[#f5f3f3] border border-[#e4e2e2] py-2 rounded-sm items-center">
                      <Text className="text-[#1b1c1c] font-medium">Save Tool</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )
        )}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
