import {Consumer} from './context';
import React, {Component} from 'react';
import {ScrollView,ActivityIndicator,AsyncStorage} from 'react-native'
import {SongView} from "./SongView";
import styles from '../core/style';
import {TouchableHighlight} from 'react-native'

export class SongList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offline: false
        };
    }

    getLocalData = async (key) => {
        return await AsyncStorage.getItem(key);
    };

    componentDidMount(): void {
        this.getLocalData('offline').then((offline) => {
            if (offline === 'true') {
                this.setState({'offline': true});
            } else {
                this.setState({'offline': false});
            }
        })

    }

    updateScreen = (navigate, song) => {
        navigate('UpdateScreen', {'song': song});
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <Consumer>
                {({isLoading, songs}) => (
                    <ScrollView style={styles.content}>
                        <ActivityIndicator animating={isLoading} style={styles.activityIndicator} size="large"/>
                        {songs && songs.map(song => <TouchableHighlight key={song.id}
                                                                        onPress={() => this.updateScreen(navigate, song)}>
                            <SongView song={song}/>
                        </TouchableHighlight>)}
                    </ScrollView>
                )}
            </Consumer>
        );
    }


}