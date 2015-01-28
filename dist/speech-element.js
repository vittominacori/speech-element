Polymer({
    autoplay: false,
    language: 'en-EN',
    text: '',

    isListening: false,
    isTalking: false,

    //languages: ['it-IT','en-EN'],

    created: function() {
        if ('speechSynthesis' in window) {
            this.listen = new SpeechSynthesisUtterance();
        }
        else {
            console.error('Your browser does not support the Web Speech API');
        }

        var SpeechRecognition = window.SpeechRecognition ||
            window.webkitSpeechRecognition ||
            window.mozSpeechRecognition ||
            window.msSpeechRecognition ||
            window.oSpeechRecognition;
        if (SpeechRecognition !== undefined) {
            this.talk = new SpeechRecognition();
        }
        else {
            console.error('Your browser does not support the SpeechRecognition API');
        }
    },

    ready: function() {


        this.talk.continuous = true;
        this.talk.interimResults = true;

        this.listen.lang = this.language;
        this.listen.text = this.text;

        [
            'start',
            'end',
            'error',
            'pause',
            'resume'
        ].forEach(this.propagateTalkEvent.bind(this));

        [
            'start',
            'error',
            'end'
        ].forEach(this.propagateListenEvent.bind(this));

        this.bindResult();
        if (this.autoplay) {
            this.play();
        }

    },


    /* -- speechSynthesis --------------------------------------------------- */
    play: function() {
        if(this.isTalking){
            this.cancel();
            return;
        }

        window.speechSynthesis.speak(this.listen);
        this.isTalking = true;
    },
    cancel: function() {
        window.speechSynthesis.cancel();
        this.isTalking = false;
    },
    pause: function() { //unused
        window.speechSynthesis.pause();
    },
    resume: function() { //unused
        window.speechSynthesis.resume();
    },

    propagateTalkEvent: function (e) {
        this.listen.addEventListener(e, this.fire.bind(this, e));
    },
    /* -- !speechSynthesis --------------------------------------------------- */


    /* -- SpeechRecognition --------------------------------------------------- */
    start: function() {
        if(this.isListening){
            this.stop();
            return;
        }

        this.clear();
        this.talk.start();
        this.isListening = true;
    },
    stop: function() {
        this.talk.stop();
        this.isListening = false;
    },
    abort: function() {
        this.talk.abort();
    },

    propagateListenEvent: function (e) {
        this.talk.addEventListener(e, this.fire.bind(this, e));
    },
    bindResult: function() {
        var that = this;

        this.talk.addEventListener('result', function(e) {
            that.interimText = '';

            for (var i = e.resultIndex; i < e.results.length; ++i) {
                if (e.results[i].isFinal) {
                    that.text += e.results[i][0].transcript;
                } else {
                    that.interimText = e.results[i][0].transcript;
                }
            }

            that.listen.text = that.text;
        });
    },
    /* -- !SpeechRecognition --------------------------------------------------- */


    clear: function(){
        this.text = '';
        this.interimText = '';
    }


});