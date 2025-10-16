import React from 'react';
import { Modal, View, StyleSheet, ActivityIndicator } from 'react-native';

const Loader = ({ isVisible, isLoading }: any) => {
    return (
        <Modal animationType="slide" transparent={true} visible={isLoading}>
            <View style={styles.modalBackground}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(192, 192, 192, 0.5)',
    },
});

export default Loader;
