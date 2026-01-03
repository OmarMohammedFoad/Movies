import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingIndicator = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#242A32' }}>
            <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
    )
}

export default LoadingIndicator