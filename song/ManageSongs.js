import { httpApiUrl } from '../core/api';
import React, {Component} from 'react';
import {Provider} from './context';
import { AsyncStorage} from "react-native"

class ManageSongs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            notes: null,
        };
    }

    componentDidMount() {
        this.getSongs();
    }

    getLocalData = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    getSongs = () => {

        this.getLocalData('offline').then((offline) => {
            if (offline === 'true') {
                this.getSongsLocal();
            } else {
                this.getSongsServer();
            }
        });

    };

    getSongsServer = () => {
        this.getLocalData('token').then((token) => {
            this.setState({isLoading: true});
            fetch(`${httpApiUrl}/songs`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Auth': token
                },
            })
                .then(response => response.json())
                .then(
                    this.getLocalData('songs').then((localSongs) => {
                        localSongs = JSON.parse(localSongs);
                            this.sendToServer(localSongs);

                }))
                .catch(error => {
                    this.setState({isLoading: false});
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error)
        });
    };


    sendToServer = (songsList) => {
        this.getLocalData('token').then((token) => {
            this.setState({isLoading: true});
            fetch(`${httpApiUrl}/songs/replace`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Auth': token
                },
                body: JSON.stringify(songsList)
            })
                .then(()=>{
                    this.setState({isLoading: false, songs: songsList});
                })
                .catch(error => {
                    this.setState({isLoading: false});
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error)
        });
    };


    getSongsLocal = () => {
        this.setState({isLoading: true});
        this.getLocalData('songs').then((songsList) => {
                songsList = JSON.parse(songsList);
                this.setState({isLoading: false, songs: songsList});
        })
    };


    render() {
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        );
    }
}

export default ManageSongs;