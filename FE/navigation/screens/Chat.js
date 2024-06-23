import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    Modal
} from 'react-native';
import io from 'socket.io-client';
import { AuthContext } from "../context/AuthContext";
import Config from "./config.json";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon from react-native-vector-icons

const Chat = ({ route }) => {
    const { projectId, projectName, projectDes } = route.params;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const socket = useRef(null);
    const flatListRef = useRef(null);
    const { userData } = useContext(AuthContext);
    const [user, setUser] = useState([]);

    useEffect(() => {
        getuser();
        socket.current = io(`${Config.URLAPI}/ws`);

        fetch(`${Config.URLAPI}/chat/getallmessage?projectId=${projectId}`)
            .then(response => response.json())
            .then(data => {
                setMessages(data);
                scrollToBottom();
            })
            .catch(error => {
                console.error(error);
            });

        socket.current.on('receiveMessage', newMessage => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
            scrollToBottom();
        });

        return () => {
            socket.current.disconnect();
        };

    }, [projectId]);

    async function getuser() {
        try {
            const response = await fetch(`${Config.URLAPI}/getalluserbyprojectId?projectId=${projectId}`);
            const data = await response.json();

            const usersWithRoles = await Promise.all(data.map(async (user) => {
                const roleName = await getRole(user.user_id);
                return { ...user, roleName };
            }));

            setUser(usersWithRoles);
        } catch (error) {
            console.error(error);
        }
    }

    async function getRole(userId) {
        try {
            const response = await fetch(`${Config.URLAPI}/findroleinuspr?projectId=${projectId}&userId=${userId}`);
            const json = await response.json();
            return json.role.roleName;
        } catch (error) {
            console.error(error);
        }
    }

    const scrollToBottom = () => {
        if (flatListRef.current) {
            setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
            }, 50); // Adjust the delay as needed
        }
    };

    const sendMessage = () => {
        if (message.trim() === '') return; // Don't send empty messages

        const newMessage = {
            user_id: userData.user_id,
            message: message,
            date: new Date().toISOString(),
            project_id: projectId,
            users: userData // Add userData to the message
        };
        console.log(newMessage)
         setMessages(prevMessages => [...prevMessages, newMessage]);
         setMessage('');

        fetch(`${Config.URLAPI}/chat/addmessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        })
            .then(response => response.json())
            .then(data => {
                socket.current.emit('sendMessage', data);
            })
            .catch(error => {
                console.error(error);
            });

        scrollToBottom();
    };

    const renderItem = ({ item }) => {
        const isOwnMessage = item.users?.user_id === userData.user_id;
        return (
            <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
                {!isOwnMessage && item.users && (
                    <Image source={{ uri: item.users.imagePath }} style={styles.avatar} />
                )}
                <View style={[styles.messageBubble, isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble]}>
                    {item.users && <Text style={styles.username}>{item.users.username}</Text>}
                    <Text style={styles.messageText}>{item.message}</Text>
                    <Text style={styles.messageDate}>{new Date(item.date).toLocaleString()}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                    <Image
                    source={require("./images/group.png")}
                    style={{ height: 60, width: 60 }}
                />
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{projectName}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Icon name="bars" size={25} color="#000" />
                </TouchableOpacity>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.message_id ? item.message_id.toString() : item.date}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => scrollToBottom()}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <View style={styles.inputWrapper}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message"
                        style={styles.input}
                        onSubmitEditing={sendMessage} // Send message on submit
                        blurOnSubmit={false} // Keep the input focused after submit
                    />
                    <TouchableOpacity onPress={sendMessage}>
                        <Icon name="paper-plane" size={30} color="#ffb267" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                animationInTiming={1500}
                animationOutTiming={750}
                useNativeDriver={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>


                        <View style={{ marginTop: 10 }}></View>
                        {user.map((userData) => (
                            <View key={userData.user_id}>
                                <TouchableOpacity
                                    style={styles.userItem}

                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Image
                                            style={styles.avt}
                                            source={userData.imagePath ? { uri: userData.imagePath } : require('../assets/logo.png')}
                                        />
                                        <Text>{userData.username}</Text>
                                    </View>
                                    <Text>{userData.roleName}</Text>
                                </TouchableOpacity>

                            </View>
                        ))}

                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 60,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#e8e8e8",
        paddingRight:20
    },
    messageList: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        flexGrow: 1,
        justifyContent: 'flex-end'
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'flex-end',
    },
    ownMessage: {
        justifyContent: 'flex-end',
    },
    otherMessage: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    messageBubble: {
        maxWidth: '70%',
        borderRadius: 10,
        padding: 10,
    },
    ownMessageBubble: {
        backgroundColor: "#ffc495",
        alignSelf: 'flex-end',
    },
    otherMessageBubble: {
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
    },
    username: {
        fontWeight: 'bold',
    },
    messageText: {
        marginVertical: 5,
    },
    messageDate: {
        fontSize: 10,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'column',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'

    },
    modalContent: {
        width: '70%',
        height: '100%',
        backgroundColor: 'rgb(255,224,184)',
        paddingTop: 80,
    },
    modalButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#ffb267",
        borderRadius: 5,
        alignItems: 'center'
    },
    avt: {
        height: 50,
        width: 50,
        borderRadius: 10
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "#ffb267",
        marginTop: 10,
        borderRadius: 5
    },
    userDetails: {
        paddingLeft: 15,
        paddingBottom: 10,
        marginTop:-5,
        paddingTop: 10,
        backgroundColor: "#fdc288",
        borderBottomEndRadius:5,
        borderBottomStartRadius:5
    },
    actionButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#ffb267",
        borderRadius: 5,
        alignItems: 'center'
    },editPopup: {

        flexDirection:'row',
        alignContent:'center',
        gap:10,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButton: {
        height:43,
        marginTop: 5,
        padding: 10,
        backgroundColor: "#ffb267",
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default Chat;
