import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskType } from '../types';
import { TASKS } from '../constants';
import TaskSelector from '../components/TaskSelector';
import TextInput from '../components/TextInput';
import OutputDisplay from '../components/OutputDisplay';
import { generateInsights } from '../services/geminiService';

export default function HomeScreen() {
  const [selectedTask, setSelectedTask] = useState<TaskType>(TaskType.KEY_INSIGHTS);
  const [inputText, setInputText] = useState<string>('');
  const [file, setFile] = useState<any>(null);
  const [output, setOutput] = useState<string | string[]>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTask = useCallback((task: TaskType) => {
    setSelectedTask(task);
    setInputText('');
    setFile(null);
    setOutput('');
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    const task = TASKS.find(t => t.id === selectedTask);
    if (!task) return;

    // Validation
    if ((task.accepts === 'image' || task.accepts === 'video') && !file) {
      Alert.alert('Error', 'Please upload a file for this task.');
      return;
    }
    if (task.accepts === 'text' && !inputText.trim()) {
      Alert.alert('Error', 'Input text cannot be empty.');
      return;
    }

    setIsLoading(true);
    setOutput('');
    setError(null);

    try {
      const result = await generateInsights(selectedTask, inputText, file);
      setOutput(result);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedTask, file]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <TaskSelector
              selectedTask={selectedTask}
              onSelectTask={handleSelectTask}
            />
            
            <TextInput
              textValue={inputText}
              onTextChange={setInputText}
              file={file}
              onFileChange={setFile}
              onClearFile={() => setFile(null)}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              selectedTask={selectedTask}
            />

            <OutputDisplay
              isLoading={isLoading}
              output={output}
              error={error}
              task={TASKS.find(t => t.id === selectedTask)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});