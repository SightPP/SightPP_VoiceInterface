import React, {Component} from "react";
import {Button} from 'react-bootstrap';
import UIfx from 'uifx';
import beepsound from '../beepsound.mp3';


class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            synth: null,
            utterThis: null,
            voiceList: null,
            isMute: false,
            langu: 2, // default language: British eng
            rate: 2,
            pitch: 1.5,
            objects: null,
            lastClickTime: null,
            runFun: false
        };

        //binding
        this.speakTexts = this.speakTexts.bind(this);
        this.obtainVoices = this.obtainVoices.bind(this);
        this.startNavigation = this.startNavigation.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.stopNavigate = this.stopNavigate.bind(this);
    }

    //socket = new WebSocket('ws://localhost:7979');



    obtainVoices() {
        this.state.synth = window.speechSynthesis;
        this.state.voiceList = this.state.synth.getVoices();
    }


    speakTexts(text) {
        this.state.utterThis = new SpeechSynthesisUtterance(text); // text content
        this.state.utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }
        this.state.utterThis.voice = this.state.voiceList[this.state.langu]; // choose the language type(en-GB)
        this.state.utterThis.rate = this.state.rate;// rate
        this.state.utterThis.pitch = this.state.pitch;// pitch
        this.state.synth.speak(this.state.utterThis);//speak
        //speechSynthesis.speak(utterThis);
    }


    startNavigation() {
        console.log(this.state.socket);
        console.log(this.state.synth);

        var self = this;
        this.state.socket = new WebSocket('ws://localhost:7979');
        this.state.isMute = false;
        const bell = new UIfx(
            beepsound,
            {
                volume: 1, // 0~1
                throttleMs: 100
            }
        );

        if (this.state.objects !== null) {
            this.state.socket.addEventListener('open', function(event) {
                self.state.socket.send(self.state.objects);
            });
        }

        console.log(this.state.socket);

        this.state.socket.addEventListener('message', function(event) {
            console.log(event.data);
            if (self.state.isMute === false) {
                self.speakTexts(event.data);
            }
            // var obj = JSON.parse(event.data);
            // if (obj.priority == 4) { // if receive a emergency signal
            //     bell.play();
            // }else {
            //     self.speakTexts(obj.msg);
            // }
        })

    }



    componentDidMount() {
        // obtain the language lists
        this.obtainVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.obtainVoices;
        }

    }



    componentWillReceiveProps(newProps) {
        console.log(newProps);
        if (newProps.muteFlag === true) {
            console.log("mute");
            this.state.isMute = true;
            this.state.synth.cancel();
            this.speakTexts("Sounds muted.");
        }else {
            if (newProps.voiceProps.langu !== null) {
                this.state.langu = newProps.voiceProps.langu;
                this.state.rate = newProps.voiceProps.speed;
                this.state.pitch = newProps.voiceProps.pitch;
            }
            if (newProps.objects !== null) {
                this.state.objects = newProps.objects;
            }
        }
    }



    handleClick () {
        if(this.state.lastClickTime === null ) {
            var d = new Date();
            this.state.lastClickTime = d.getTime();
            this.speakTexts("This button can offer obstacle avoidance service. " +
                "If you want to use this function, please click it again immediately.");
        }else {
            var d = new Date();
            var duration = d.getTime() - this.state.lastClickTime;

            if (duration > 8500) {
                this.speakTexts("This button can offer obstacle avoidance service. " +
                    "If you want to use this function, please click it again immediately.");
                d = new Date();
                this.state.lastClickTime = d.getTime();
            }else {
                this.startNavigation();
                d = new Date();
                this.state.lastClickTime = d.getTime();
            }
        }
    }


    stopNavigate () {
        console.log(this.state.socket);
        console.log(this.state.synth);
        if (this.state.synth !== null && this.state.synth.speaking === true) {
            this.state.synth.cancel();
        }

        if (this.state.socket == null) {
            this.speakTexts('You have not open the obstacle avoidance service.');
        }else {
            if (this.state.socket.readyState !== 1) {
                this.speakTexts('You have not open the obstacle avoidance service.');
            }else {
                this.state.socket.close();
                this.speakTexts('Obstacle avoidance stopped.');
                console.log(this.state.socket);
                console.log(this.state.synth);
            }
        }
    }




    render() {
        return (
            <div>
                <Button variant="warning" size="lg" block onClick={this.handleClick}>
                    Start
                </Button>
                <br/>
                <Button variant="danger" size="lg" block onClick={this.stopNavigate}>
                    Stop
                </Button>
            </div>
        );
    }
}

export default Navigation;


// var ifObtained = setInterval(()=> {
//     console.log(voices);
//     console.log(Object.keys(voices).length);
//
//     if (Object.keys(voices).length != 0) {
//         clearInterval(ifObtained);
//     }
// }, 2000);