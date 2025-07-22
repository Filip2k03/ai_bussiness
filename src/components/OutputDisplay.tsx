import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { Task, TaskType } from '../types';

interface OutputDisplayProps {
  isLoading: boolean;
  output: string | string[];
  error: string | null;
  task?: Task;
}

export default function OutputDisplay({ isLoading, output, error, task }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const outputText = typeof output === 'string' ? output : '';

  const handleCopy = async () => {
    if (outputText) {
      await Clipboard.setStringAsync(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Alert.alert('Copied', 'Text copied to clipboard');
    }
  };

  const shouldShowCopyButton = () => {
    if (!output || Array.isArray(output)) return false;
    if (task?.id === TaskType.IMAGE_CREATE) return false;
    return true;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingTitle}>AI is thinking...</Text>
          <Text style={styles.loadingSubtitle}>
            Analyzing your input for {task?.title || 'insights'}.
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (output) {
      if (task?.id === TaskType.IMAGE_CREATE && typeof output === 'string' && output.startsWith('data:image/')) {
        return (
          <View style={styles.imageContainer}>
            <Image source={{ uri: output }} style={styles.generatedImage} resizeMode="contain" />
          </View>
        );
      }

      if (task?.id === TaskType.STORYBOARD_CREATOR && Array.isArray(output)) {
        return (
          <View style={styles.storyboardContainer}>
            <Text style={styles.storyboardTitle}>AI Storyboard</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storyboardScroll}>
              {output.map((imgSrc, index) => (
                <View key={index} style={styles.storyboardFrame}>
                  <Image source={{ uri: imgSrc }} style={styles.storyboardImage} resizeMode="contain" />
                  <View style={styles.frameNumber}>
                    <Text style={styles.frameNumberText}>{index + 1} / {output.length}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        );
      }

      return (
        <ScrollView style={styles.textOutputContainer}>
          <Text style={styles.outputText}>{outputText}</Text>
        </ScrollView>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{task?.icon}</Text>
        <Text style={styles.emptyTitle}>AI Output</Text>
        <Text style={styles.emptyDescription}>
          Your generated analysis will appear here once you provide an input.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {shouldShowCopyButton() && (
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          <Ionicons 
            name={copied ? "checkmark" : "copy-outline"} 
            size={16} 
            color={copied ? "#10b981" : "#f9fafb"} 
          />
          <Text style={[styles.copyButtonText, copied && styles.copiedText]}>
            {copied ? 'Copied!' : 'Copy'}
          </Text>
        </TouchableOpacity>
      )}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    minHeight: 300,
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4b5563',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  copyButtonText: {
    color: '#f9fafb',
    fontSize: 12,
    marginLeft: 4,
  },
  copiedText: {
    color: '#10b981',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#fca5a5',
    textAlign: 'center',
    marginTop: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  generatedImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  storyboardContainer: {
    flex: 1,
    padding: 16,
  },
  storyboardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 16,
  },
  storyboardScroll: {
    flex: 1,
  },
  storyboardFrame: {
    width: 250,
    height: 200,
    marginRight: 12,
    position: 'relative',
  },
  storyboardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  frameNumber: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  frameNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  textOutputContainer: {
    flex: 1,
    padding: 16,
  },
  outputText: {
    color: '#f9fafb',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});