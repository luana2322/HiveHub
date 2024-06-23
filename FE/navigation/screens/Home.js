import * as React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import Background from '../components/Background2';
import Config from "./config.json";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

import CarouselCustom from "../components/CarouselCustom";
export default function Home({ navigation }) {
    const { userData } = useContext(AuthContext);
    const [checked, setChecked] = React.useState('first');
    const today = new Date();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState([]);
    const [todaytask, setTodaytask] = useState([]);
    const isFocused = useIsFocused();

    const dataImg = [
        {
        image: require('./images/phonebee.png'),
    },{
            image: require('./images/granttbee.png'),
        },{
            image: require('./images/multiphonebee.png'),
        },

    ]


    useEffect(() => {
        if (isFocused) {
            fetchDataProject();
            fetchDataTask();
            fetchDataTodayTask();
        }
    }, [isFocused]);

    function formatDate(isoString) {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function fetchDataProject() {
        try {
            const response = await fetch(`${Config.URLAPI}/getprjectbyuserId?userId=${userData.user_id}`);
            const data = await response.json();
            setProject(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchDataTask() {
        try {
            const response = await fetch(`${Config.URLAPI}/getalltaskbyuser?userId=${userData.user_id}`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchDataTodayTask() {
        try {
            const response = await fetch(`${Config.URLAPI}/findtaskbydate?user_id=${userData.user_id}&date=${formatDate(today)}`);
            const data = await response.json();
            setTodaytask(data);
        } catch (error) {
            console.error(error);
        }
    }

    const gotoTaskDetail = (item) => {
        navigation.navigate('TaskDetail', { task: item });
    };





    return (
        <Background>
            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                    <View style={styles.header}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={{ height: 60, width: 60 }}
                        />
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>HIVEHUB</Text>
                            <Text style={{ fontSize: 14, marginBottom: 5, fontStyle: 'italic', marginLeft: -5 }}>Planning App</Text>
                        </View>
                    </View>
                    <View style={styles.header}>
                        <Image
                            source={userData.imagePath ? { uri: userData.imagePath } : require('../assets/logo.png')}
                            style={{ height: 60, width: 60, borderRadius: 5 }}
                        />
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.caculate}>
                        <View style={styles.countproject}>
                            <Text style={styles.headerbodytext}>
                                Project
                            </Text>
                            <Text style={styles.bodybodytext}>
                                {project.length}
                            </Text>
                        </View>
                        <View style={styles.couttask}>
                            <View style={styles.countalltask}>
                                <Text style={styles.headerbodytext}>
                                    ALL TASK
                                </Text>
                                <Text style={styles.headerbodytext2}>
                                    {tasks.length}
                                </Text>
                            </View>
                            <View style={styles.todaytask}>
                                <Text style={styles.headerbodytext}>
                                    TODAY TASK
                                </Text>
                                <Text style={styles.headerbodytext2}>
                                    {todaytask.length}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.tasktoday}>

                        <FlatList
                            style={styles.todaytasklist}
                            data={todaytask}
                            keyExtractor={(item) => item.task_id}
                            ListHeaderComponent={
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:20,color:'#FFFFFF',fontWeight:'bold'}}>
                                    TODAY TASK LIST
                                </Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.taskview} onPress={() => gotoTaskDetail(item)}>
                                    <Text style={styles.whitetext}>{item.taskName} | {item.description} | {item.project.projectName}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    <View style={styles.howto} >
                        <CarouselCustom data={dataImg}/>
                    </View>
                </View>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: 60,
        padding: 10,
        gap: 5,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    headerText: {
        borderColor: '#ffad44',
        width: 70,
        height: 70,
        borderWidth: 1,
        borderRadius: 50,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    headerTextToday: {
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        marginTop: 10,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        padding: 10,
    },
    caculate: {
        flexDirection: 'row',
        gap: 10,
    },
    countproject: {
        backgroundColor: "#ffb267",
        height: 200,
        width: '30%',
        borderRadius: 15,
        padding: 10,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 30,
    },
    tasktoday: {
        marginTop: 20,
        backgroundColor: "#ffb267",

        borderRadius: 15,
    },
    howto: {
        marginTop: 20,
        backgroundColor: "#ffb267",

        borderRadius: 25,
       paddingTop:10,
        paddingBottom:10
    },
    headerbodytext: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#ffffff",
    },
    headerbodytext2: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#ffffff",
    },
    bodybodytext: {
        fontSize: 50,
        fontWeight: 'bold',
        color: "#ffffff",
    },
    couttask: {
        backgroundColor: "#ffb267",
        height: 200,
        width: '67%',
        borderRadius: 15,
        flexDirection: 'column',
        padding: 10,
        gap: 10,
    },
    countalltask: {
        flexDirection: 'column',
        backgroundColor: "#fa933a",
        height: 85,
        borderRadius: 15,
        alignItems: "center",
        gap: 5,
        padding: 5,
    },
    todaytask: {
        flexDirection: 'column',
        backgroundColor: "#fa933a",
        height: 85,
        borderRadius: 15,
        alignItems: "center",
        gap: 5,
        padding: 5,
    },
    taskview: {
        marginTop: 10,
        backgroundColor: "#fa933a",
        borderRadius: 5,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    todaytasklist: {
        flexDirection: 'column',
        gap: 10,
        padding: 10,
    },
    whitetext: {
        color: '#FFFFFF',
        fontSize:18
    },
});
