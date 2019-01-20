import {StyleSheet, Button, TextInput, View, AsyncStorage} from "react-native";
import React, {Component} from 'react';
import {httpApiUrl} from "../core/api";



export class UpdateSong extends Component {

    constructor(props) {
        super(props);
        this.state = {
            song: null,
            name: '',
            releaseYear: '',
            album: '',
            offline: false
        };

    }

    componentDidMount() {
        const {navigation} = this.props;
        const song = navigation.getParam('song');
        this.state.song = song;
        this.setState({
            name:song.name,
            releaseYear:song.releaseYear,
            album:song.album
        });
        this.getLocalData('offline').then((offline) => {
            if (offline === 'true') {
                this.setState({'offline': true});
            } else {
                this.setState({'offline': false});
            }
        })
    }

    render() {

        return (

            <View style={styles.container}>
                <TextInput
                    onChangeText = {(text) => this.setState({name:text})}
                    style={styles.text}
                    value={this.state.name}
                    placeholder={'Song Title'}
                />
                <TextInput
                    onChangeText={(text) => this.setState({releaseYear:text})}
                    style={styles.text}
                    value={this.state.releaseYear}
                    placeholder={'Release year'}
                />
                <TextInput
                    onChangeText={(text) => this.setState({album:text})}
                    style={styles.text}
                    value={this.state.album}
                    placeholder={'Album'}
                />
                <View >
                    <View />
                    <View >
                        <Button
                            style={styles.button}
                            onPress={() => this.cancel()}
                            title="Cancel"
                            color={'#008000'}
                        />
                    </View>
                        <Button
                            style={styles.button}
                            onPress={() => this.ok()}
                            title="OK"
                            color={'#008000'}
                        />
                    </View>
                    <View style={{flex: 0.05}}/>
                </View>
            </View>
        );
    }

    ok = () => {
        this.state.song.name = this.state.name;
        this.state.song.releaseYear = this.state.releaseYear;
        this.state.song.album = this.state.album;
        if(this.state.offline){
            this.updateLocal();
        }
        else{
            this.updateServer();
        }
    };

    updateServer = () =>{
        this.getLocalData('token').then((token) => {
            this.setState({isLoading: true});
            fetch(`${httpApiUrl}/songs/update`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Auth': token
                },
                body: JSON.stringify(this.state.song)
            })
                .then(response => {
                    this.updateLocal();
                    this.props.navigation.navigate('SongsScreen');
                })
                .catch(error => {
                    this.setState({isLoading: false});
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error)
        });
    };


    updateLocal = () =>{
        this.getLocalData('songs').then((songsList)=>{
            songsList = JSON.parse(songsList);
            for(let i=0;i<songsList.length;i++){
                if(songsList[i].id === this.state.song.id){
                    songsList[i] = this.state.song;
                }
            }
            this.setLocalData('songs',JSON.stringify(songsList)).then().catch((error)=>{
                console.log(error);
            });
            this.props.navigation.navigate('SongsScreen');
        })
    };


    cancel = () => {
        this.props.navigation.goBack();
    };

    getLocalData = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    setLocalData = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };

}


const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1
    },

    text: {
        backgroundColor: '#FFFF99',
        fontSize: 18,
        borderColor: 'blue',
        borderWidth: 1,
        marginTop: 20,
        marginRight: 6,
        marginLeft: 6
    },

    button: {
        width: 50,
        height: 50,
    },

});