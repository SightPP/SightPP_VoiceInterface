import React, {Component} from "react";
import {Button} from "react-bootstrap";


export default class SttExample extends Component {

    constructor(props) {
        super(props);

        //binding
        this.recogniseSpeech = this.recogniseSpeech.bind(this);
    }


    recogniseSpeech(){
        var speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription('1a040caa836848b88501c48411a0b2c1', 'westus');
        speechConfig.speechRecognitionLanguage = "en-US";

        var audioConfig  = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        var recogniser = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recogniser.recognizeOnceAsync( result => {
            console.log(result);
        },err => {
            console.log(err);
        });
    }




    componentDidMount() {

    }


    render() {
        return (
            <div>

                <Button variant="primary" size="lg" block onClick={this.recogniseSpeech}>
                    Voice Configuration
                </Button>

            </div>
        );
    }
}



// var recognition = new window.SpeechRecognition();
// var speechRecognitionList = new window.SpeechGrammarList();
//
// recognition.grammars = speechRecognitionList;
// recognition.continuous = false;
// recognition.lang = 'en-UK';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;
//
// recognition.start();
//
//
// recognition.onresult = function(event) {
//     var color = event.results[0][0].transcript;
//     console.log(color);
// }



// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.async = true;
// script.src = '../microSTT/microsoft.cognitiveservices.speech.sdk.bundle.js';
// document.head.appendChild(script);