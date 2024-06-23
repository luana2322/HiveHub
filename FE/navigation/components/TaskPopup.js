import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Popup = ({ task, onClose }) => (
    <View style={styles.container}>
        <Text style={styles.title}>{task.taskName}</Text>
        <Text style={styles.text}>Start: {formatDate(task.timeStart)}</Text>
        <Text style={styles.text}>End: {formatDate(task.timeEnd)}</Text>
        <Text style={styles.text}>Project: {task.project.projectName}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
    </View>
);
function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
    text:{
        fontSize:16
    },
    container: {
        position: 'absolute',
        top: '50%', // Place the popup in the center of the screen
        left: '50%', // Place the popup in the center of the screen
        transform: [{ translateX: -150 }, { translateY: -100 }], // Center the popup by transforming its position
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        zIndex: 2, // Ensure the popup is displayed on top
        width: 300, // Set a fixed width for the popup
        alignItems: 'center', // Center the content
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'lightgrey',
    },
    closeButtonText: {
        fontSize: 16,
    },
});

export default Popup;
