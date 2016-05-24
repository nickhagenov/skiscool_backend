/**
 * Created by baebae on 4/20/16.
 */
import React,{Component,StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native';

var Panel = React.createClass({
 icons : { 
            'up'    : require('./images/Arrow-up.png'),
            'down'  : require('./images/Arrow-down.png')
        },
     getInitialState() { 
    return {    	
    title       : this.props.title,
     expanded    : false,
     animation   : new Animated.Value()
    }
    },
    
    
_setMaxHeight(event){
    this.setState({
        maxHeight   : event.nativeEvent.layout.height
    });
},

_setMinHeight(event){
    this.setState({
        minHeight   : event.nativeEvent.layout.height
    });
} ,
    toggle(){  
        let initialValue = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
        finalValue = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

      this.setState({ 
            expanded    : !this.state.expanded,
            animation   : new Animated.Value()
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    },

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
        this.toggle();
    },

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    },

    render(){
        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];
        } 
        console.log('etat:');
        console.log(this.state.expanded);
        return (
            <Animated.View 
                style={[styles.container,{height: this.state.animation}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body} onLayout={this._setMaxHeight}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
});

export default Panel;

let styles = StyleSheet.create({
    container   : {
        backgroundColor: '#fff',
        margin:10,
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title       : {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold'
    },
    button      : {

    },
    buttonImage : {
        width   : 30,
        height  : 25
    },
    body        : {
        padding     : 10,
        paddingTop  : 0
    }
});