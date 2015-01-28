Polymer({
    autoplay: false,
    language: 'en-EN',
    text: '',

    isListening: false,
    isTalking: false,

    created: function() {
        if ('speechSynthesis' in window) {
            this.syn = new SpeechSynthesisUtterance();
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
            this.rec = new SpeechRecognition();
        }
        else {
            console.error('Your browser does not support the SpeechRecognition API');
        }
    },

    ready: function() {


        this.rec.continuous = true;
        this.rec.interimResults = true;

        this.syn.lang = this.language;
        this.syn.text = this.text;



        this.onRecResult();

        if (this.autoplay) {
            this.startSyn();
        }

    },

    startRec: function() {
        this.stopAll();
        this.clear();

        this.rec.start();
        this.isListening = true;
    },

    stopRec: function() {
        this.rec.stop();
        this.isListening = false;
    },

    startSyn: function() {
        this.stopAll();

        window.speechSynthesis.speak(this.syn);
        this.isTalking = true;
    },

    stopSyn: function() {
        window.speechSynthesis.cancel();
        this.isTalking = false;
    },


    onRecResult: function() {
        var that = this;

        this.rec.addEventListener('result', function(e) {
            that.interimText = '';

            for (var i = e.resultIndex; i < e.results.length; ++i) {
                if (e.results[i].isFinal) {
                    that.text += e.results[i][0].transcript;
                } else {
                    that.interimText = e.results[i][0].transcript;
                }
            }

            that.syn.text = that.text;
        });
    },

    clear: function(){
        this.text = '';
        this.interimText = '';
    },

    stopAll: function(){
        if(this.isTalking)
            this.stopSyn();
        if(this.isListening)
            this.stopRec();
    }


});