import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const handleApiKeySetup = () => {
    Alert.alert(
      'API Key Setup',
      'To use this app, you need to configure your Google Gemini API key in the environment variables.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About',
      'AI Business Intelligence Assistant\nVersion 1.0.0\n\nPowered by Google Gemini AI',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleApiKeySetup}>
            <View style={styles.settingContent}>
              <Ionicons name="key-outline" size={24} color="#4f46e5" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>API Key Setup</Text>
                <Text style={styles.settingDescription}>Configure your Gemini API key</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingContent}>
              <Ionicons name="information-circle-outline" size={24} color="#4f46e5" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>About App</Text>
                <Text style={styles.settingDescription}>Version and information</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f9fafb',
  },
  settingDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
});