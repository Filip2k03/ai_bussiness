import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { TaskType } from '../types';
import { TASKS } from '../constants';

interface TextInputProps {
  textValue: string;
  onTextChange: (value: string) => void;
  file: any;
  onFileChange: (file: any) => void;
  onClearFile: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  selectedTask: TaskType;
}

export default function TextInput({
  textValue,
  onTextChange,
  file,
  onFileChange,
  onClearFile,
  onGenerate,
  isLoading,
  selectedTask,
}: TextInputProps) {
  const currentTask = TASKS.find(task => task.id === selectedTask);
  const placeholderText = currentTask ? currentTask.placeholder : "Enter your text here...";
  const acceptsFile = currentTask?.accepts === 'image' || currentTask?.accepts === 'video';

  const handleFilePicker = async () => {
    try {
      if (currentTask?.accepts === 'image') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          onFileChange(result.assets[0]);
        }
      } else if (currentTask?.accepts === 'video') {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'video/*',
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets[0]) {
          onFileChange(result.assets[0]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const getButtonText = () => {
    switch(selectedTask) {
      case TaskType.IMAGE_CREATE:
        return 'Generate Image';
      case TaskType.DIAGRAM_AI:
        return 'Generate Diagram';
      case TaskType.STORYBOARD_CREATOR:
        return 'Generate Storyboard';
      default:
        return 'Generate Analysis';
    }
  };

  const isButtonDisabled = isLoading || (acceptsFile && !file) || (!acceptsFile && !textValue.trim());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Input</Text>
      
      {acceptsFile && (
        <View style={styles.fileSection}>
          {file ? (
            <View style={styles.fileSelected}>
              <View style={styles.fileInfo}>
                <Ionicons name="document" size={20} color="#4f46e5" />
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name || 'Selected file'}
                </Text>
              </View>
              <TouchableOpacity onPress={onClearFile} disabled={isLoading}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.filePicker} onPress={handleFilePicker}>
              <Ionicons name="cloud-upload-outline" size={32} color="#9ca3af" />
              <Text style={styles.filePickerText}>
                Tap to upload {currentTask?.accepts === 'image' ? 'image' : 'video'}
              </Text>
              <Text style={styles.filePickerSubtext}>
                {currentTask?.accepts === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV, WEBM up to 50MB'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <RNTextInput
        style={styles.textInput}
        value={textValue}
        onChangeText={onTextChange}
        placeholder={placeholderText}
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.generateButton, isButtonDisabled && styles.disabledButton]}
        onPress={onGenerate}
        disabled={isButtonDisabled}
      >
        <Ionicons 
          name={isLoading ? "hourglass-outline" : "send"} 
          size={20} 
          color={isButtonDisabled ? "#6b7280" : "#ffffff"} 
        />
        <Text style={[styles.generateButtonText, isButtonDisabled && styles.disabledButtonText]}>
          {isLoading ? 'Analyzing...' : getButtonText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 16,
  },
  fileSection: {
    marginBottom: 16,
  },
  filePicker: {
    backgroundColor: '#4b5563',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6b7280',
    borderStyle: 'dashed',
  },
  filePickerText: {
    fontSize: 16,
    color: '#f9fafb',
    fontWeight: '500',
    marginTop: 8,
  },
  filePickerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  fileSelected: {
    backgroundColor: '#4b5563',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#f9fafb',
    marginLeft: 8,
    flex: 1,
  },
  textInput: {
    backgroundColor: '#4b5563',
    borderRadius: 8,
    padding: 16,
    color: '#f9fafb',
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#4b5563',
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButtonText: {
    color: '#6b7280',
  },
});