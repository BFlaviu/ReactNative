import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export class SongView extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.edit}>
                <Text style={[styles.title,styles.text]}>{this.props.song.name}</Text>
                <Text style={styles.text}>Release year: {this.props.song.releaseYear}</Text>
                <Text style={styles.text}>Album: {this.props.song.album}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    edit:{
        backgroundColor: 'cyan',
        borderRadius:11,
        margin: 3
    },

    title:{
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 25,
    },

    text:{
        margin:10
    }

});