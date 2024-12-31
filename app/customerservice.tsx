import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator,
    Keyboard,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';
import { API_DOMAIN } from '@/apiConfig';
import { useAppSelector } from '@/store/slices/authSlice';
import { useNavigation } from 'expo-router';

interface Message {
    _id: string | number;
    text: string;
    createdAt: Date;
    user: {
        _id: number;
        name: string;
        avatar?: string;
    };
    image?: string;
    pending?: boolean; // Used to show loading state
}

const POLLING_INTERVAL = 1000; // 5 seconds interval for long polling

const CustomerService: React.FC = () => {
    const navigation = useNavigation();
    const { token } = useAppSelector((state) => state.auth);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const { colors, dark } = useTheme();
    const [keyboardHeight, setKeyboardHeight] = useState(0); // Track keyboard height

    // Handle keyboard events
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) =>
            setKeyboardHeight(event.endCoordinates.height)
        );
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
            setKeyboardHeight(0)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    const fetchMessages = async (before?: Date) => {
        if (isLoadingEarlier || !hasMoreMessages) return;

        setIsLoadingEarlier(true);

        try {
            const response = await axios.post(
                `${API_DOMAIN}/messages`,
                {
                    limit: 20,
                    before: before?.toISOString(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newMessages = response.data.data.map((message: any) => ({
                _id: message.id,
                text: message.message || '',
                createdAt: new Date(message.created_at),
                user: {
                    _id: message.sender === 'user' ? 1 : 2,
                    name: message.sender === 'user' ? 'You' : 'Admin',
                    avatar: message.sender === 'admin' ? images.avatar : undefined,
                },
                image: message.attachment,
            }));

            if (newMessages.length > 0) {
                setMessages((prevMessages) =>
                    GiftedChat.prepend(prevMessages, newMessages)
                );
            } else {
                setHasMoreMessages(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch messages.');
            console.error(error);
        } finally {
            setIsLoadingEarlier(false);
        }
    };
    const pollNewMessages = async () => {
        try {
            const response = await axios.post(
                `${API_DOMAIN}/new-messages`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newMessages = response.data.data.map((message: any) => ({
                _id: message.id,
                text: message.message || '',
                createdAt: new Date(message.created_at),
                user: {
                    _id: message.sender === 'user' ? 1 : 2,
                    name: message.sender === 'user' ? 'You' : 'Admin',
                    avatar: message.sender === 'admin' ? images.avatar : undefined,
                },
                image: message.attachment,
            }));

            if (newMessages.length > 0) {
                setMessages((prevMessages) =>
                    GiftedChat.append(prevMessages, newMessages)
                );
            }
        } catch (error) {
            console.error('Polling error:', error);
        } finally {
            setTimeout(pollNewMessages, POLLING_INTERVAL);
        }
    };

    useEffect(() => {
        fetchMessages();
        pollNewMessages(); // Start long polling
    }, []);

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const submitHandler = async () => {
        if (!inputMessage.trim() && !selectedImage) return;

        const tempMessage: Message = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage || '',
            createdAt: new Date(),
            user: { _id: 1, name: 'You' },
            image: selectedImage || undefined,
            pending: true, // Mark as pending
        };

        setMessages((prevMessages) => GiftedChat.append(prevMessages, [tempMessage]));

        const formData = new FormData();
        formData.append('message', inputMessage || '');
        if (selectedImage) {
            formData.append('attachment', {
                uri: selectedImage,
                type: 'image/jpeg',
                name: 'image.jpg',
            } as unknown as Blob);
        }

        try {
            const response = await axios.post(`${API_DOMAIN}/send-message`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newMessage = {
                _id: response.data.data.id,
                text: response.data.data.message,
                createdAt: new Date(),
                user: { _id: 1, name: 'You' },
                image: response.data.data.attachment || undefined,
            };

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg._id === tempMessage._id ? newMessage : msg
                )
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to send message.');
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg._id !== tempMessage._id)
            );
        } finally {
            setInputMessage('');
            setSelectedImage(null);
        }
    };

    const renderMessage = (props: any) => {
        const { currentMessage } = props;

        if (currentMessage.image) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: currentMessage.user._id === 1 ? 'row-reverse' : 'row',
                        marginVertical: 8,
                    }}
                >
                    <Image
                        source={{ uri: currentMessage.image }}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 10,
                            marginHorizontal: 10,
                        }}
                    />
                    {currentMessage.pending && (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                    )}
                </View>
            );
        }

        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: COLORS.secondary,
                        marginLeft: 12,
                        marginBottom: 12,
                    },
                    right: {
                        backgroundColor: COLORS.primary,
                        marginRight: 12,
                        marginVertical: 12,
                    },
                }}
                textStyle={{
                    left: { color: COLORS.white },
                    right: { color: COLORS.white },
                }}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar hidden />
            <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={icons.arrowLeft}
                                contentFit="contain"
                                style={[styles.headerIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
                            />
                        </TouchableOpacity>
                        <Text
                            style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}
                        >
                            Customer Service
                        </Text>
                    </View>
                </View>
                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={messages}
                        user={{ _id: 1 }}
                        loadEarlier={hasMoreMessages}
                        onLoadEarlier={() => {
                            const oldestMessageDate = messages[messages.length - 1]?.createdAt;
                            if (oldestMessageDate) {
                                fetchMessages(new Date(oldestMessageDate));
                            }
                        }}
                        isLoadingEarlier={isLoadingEarlier}
                        renderMessage={renderMessage}
                        renderInputToolbar={() => null}
                    />
                </View>
                {selectedImage && (
                    <View style={[styles.previewContainer, { paddingBottom: keyboardHeight }]}>
                        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                        <TouchableOpacity onPress={() => setSelectedImage(null)}>
                            <MaterialCommunityIcons name="close" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                )}
                <View
                    style={[
                        styles.inputContainer,
                        { paddingBottom: keyboardHeight }, // Dynamically adjust padding
                    ]}
                >
                    <View
                        style={[
                            styles.inputMessageContainer,
                            { backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100 },
                        ]}
                    >
                        <TextInput
                            style={styles.input}
                            value={inputMessage}
                            onChangeText={(text) => setInputMessage(text)}
                            placeholderTextColor={COLORS.greyscale900}
                            placeholder="Enter your message..."
                        />
                        <View style={styles.attachmentIconContainer}>
                            <TouchableOpacity onPress={handleImagePicker}>
                                <Feather name="image" size={24} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.sendContainer} onPress={submitHandler}>
                        <MaterialCommunityIcons name="send" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    contentContainer: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.white },
    headerTitle: { fontSize: 18, fontFamily: 'semiBold', color: COLORS.black, marginLeft: 22 },
    headerIcon: { height: 24, width: 24, tintColor: COLORS.black },
    chatContainer: { flex: 1, justifyContent: 'center' ,marginBottom: 50},
    inputContainer: {position: 'absolute', bottom: 0,  flexDirection: 'row', backgroundColor: COLORS.white, padding: 8 },
    inputMessageContainer: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.grayscale100, padding: 8, borderRadius: 12 },
    attachmentIconContainer: { marginRight: 12 },
    input: { color: COLORS.greyscale900, flex: 1, paddingHorizontal: 10 },
    sendContainer: { height: 48, width: 48, borderRadius: 49, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary },
    previewContainer: {  flexDirection: 'row', alignItems: 'center', margin: 10 },
    previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
});

export default CustomerService;
