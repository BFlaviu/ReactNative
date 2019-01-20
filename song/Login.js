import React, {Component} from 'react';
import {Alert,TextInput, View, StyleSheet, Button, ActivityIndicator} from "react-native";
import {httpApiUrl, headers} from '../core/api';
import styles from '../core/style';
import {AsyncStorage} from "react-native"
import {NetInfo} from 'react-native';


export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false
        };
    }

    setLocalData = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };

    getLocalData = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    onLogin = (navigate) => {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.onlineLogin(navigate);
            } else {
                this.offlineLogin(navigate);
            }
        });

    };


    render() {
        const {navigate} = this.props.navigation;
        return (
            <View >
                <ActivityIndicator animating={this.state.isLoading} style={styles.activityIndicator} size="large"/>
                <TextInput
                    style={{height: 50, borderColor: 'blue', borderWidth: 1}}
                    onChangeText={(text) => this.setState({username:text})}
                    placeholder={'Username'}
                    value={this.state.username}
                />
                <TextInput
                    style={{marginTop: 20, marginBottom:20, height: 50, borderColor: 'blue', borderWidth: 1}}
                    onChangeText={(text) => this.setState({password:text})}
                    secureTextEntry={true}
                    placeholder={'Password'}
                    value={this.state.password}
                />
                <Button
                    onPress={()=>this.onLogin(navigate)}
                    title="Login"
                    color="#008000"
                />
            </View>


        );
    }

    onlineLogin = (navigate) => {
        this.setState({isLoading: true});
        fetch(`${httpApiUrl}/login`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
        }).then(response => {
            const headers = response.headers;
            this.setLocalData('token', headers.get("Auth")).then().catch((error) => {
                console.log(error)
            });
            return Promise.all([response.status])
        }).then(([status]) => {
            this.setState({isLoading: false});
            if (parseInt(status, 10) === 200) {
                this.setLocalData('offline', 'false').then().catch((error) => {
                    console.log(error)
                });
                this.setLocalData('lastLoggedUser', JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })).then().catch((error) => {
                    console.log(error)
                });
                navigate('SongsScreen');
            } else {
                Alert.alert("Username sau parola incorecta!")
            }

        })
            .catch(error => {
                this.setState({isLoading: false});
                this.offlineLogin(navigate);
                console.log(error);
            });
    };

    offlineLogin = (navigate) => {
        this.getLocalData('lastLoggedUser').then((lastLoggedUser) => {
            if (lastLoggedUser == null) {
                Alert.alert("Username sau parola incorecta!");
            } else {
                lastLoggedUser = JSON.parse(lastLoggedUser);
                if (this.state.username === lastLoggedUser.username && this.state.password === lastLoggedUser.password) {
                    this.setLocalData('offline', 'true').then().catch((error) => {
                        console.log(error);
                    });
                    Alert.alert("Internetul nu este pornit, offline login!")
                    navigate('SongsScreen');
                } else {
                    Alert.alert("Username sau parola incorecta!");
                }
            }
        })
    }
}


