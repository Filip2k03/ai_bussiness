import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { TaskType } from '../types';
import { TASKS } from '../constants';

interface TaskSelectorProps {
  selectedTask: TaskType;
  onSelectTask: (task: TaskType) => void;
}

export default function TaskSelector({ selectedTask, onSelectTask }: TaskSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your AI Agent</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TASKS.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() => onSelectTask(task.id)}
            style={[
              styles.taskCard,
              selectedTask === task.id && styles.selectedCard
            ]}
          >
            <View style={styles.taskContent}>
              <Text style={styles.taskIcon}>{task.icon}</Text>
              <Text style={[
                styles.taskTitle,
                selectedTask === task.id && styles.selectedText
              ]}>
                {task.title}
              </Text>
              <Text style={[
                styles.taskDescription,
                selectedTask === task.id && styles.selectedDescription
              ]}>
                {task.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingRight: 16,
  },
  taskCard: {
    backgroundColor: '#4b5563',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    minHeight: 120,
  },
  selectedCard: {
    backgroundColor: '#4f46e5',
  },
  taskContent: {
    alignItems: 'center',
  },
  taskIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedText: {
    color: '#ffffff',
  },
  taskDescription: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedDescription: {
    color: '#e0e7ff',
  },
});