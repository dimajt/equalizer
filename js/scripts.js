var D = {

    width: 300,
    height: 150,

    theme: {
        name: 'b',
        list: ['a', 'b', 'c']
    },

    stc: 0.8,
    ftt: 512,

    volume: 0.3,

    A: {

        size: 5,
        space: 3,
        color: 'rgba(43,43,43,1)',

        Init: function() {
            D.A.width = D.A.size + D.A.space;
            D.A.length = D.width / D.A.width;
        },

        Draw: function() {
            D.ctx.fillStyle = D.A.color;
            for (var i = 0; i < D.A.length - 1; i++) {
                var h = D.data[i] * D.height / 255;
                var r = h / D.A.width;
                for (var j = 0; j < r - 1; j++) {
                    D.ctx.fillRect(i * D.A.width, D.height - j * D.A.width, D.A.size, D.A.size);
                }
            }
        }

    },

    B: {

        size: {x: 12 , y: 1},
        space: {x: 3, y: 2},
        color: 'rgba(255,255,255,0.3)',

        Init: function() {
            D.B.width = D.B.size.x + D.B.space.x;
            D.B.height = D.B.size.y + D.B.space.y;
            D.B.length = D.width / D.B.width;
        },

        Draw: function() {
            D.ctx.fillStyle = D.B.color;
            for (var i = 0; i < D.B.length - 1; i++) {
                var h = D.data[i] * D.height / 255;
                var r = h / D.B.height;
                for (var j = 0; j < r - 1; j++) {
                    D.ctx.fillRect(i * D.B.width, D.height - j * D.B.height, D.B.size.x, D.B.size.y);
                }
            }
        }

    },

    C: {

        size: {x: 8, y: 2},
        space: {x: 2, y: 2},

        Init: function() {
            D.C.width = D.C.size.x + D.C.space.x;
            D.C.height = D.C.size.y + D.C.space.y;
            D.C.length = D.width / D.C.width;
        },

        Draw: function() {
            for (var i = 0; i < D.C.length - 1; i++) {

                var h = D.data[i] * D.height / 255;
                var r = h / D.C.height;
                var c = 360 * i / (D.C.length - 1);

                D.ctx.fillStyle = 'hsla(' + c + ', 100%, 50%, 1.0)';
                for (var j = 0; j < r - 1; j++) {
                    D.ctx.fillStyle = '';
                    D.ctx.fillRect(i * D.C.width, D.height - j * D.C.height, D.C.size.x, D.C.size.y);
                }
            }
        }

    },


    Draw: function() {
        D.ctx.clearRect(0, 0, D.width, D.height);
        var type = D.theme.name.toUpperCase();
        D[type].Draw();
        requestAnimationFrame(D.Draw, D.canvas);
    },

    Play: function() {
        D.info.style.display = 'none';
    },

    Audio: function(src) {
        D.info.style.display = 'block';
        D.audio.src = src;
        if (D.audio.paused) D.audio.play();
    },

    Process: function() {
        D.analyser.getByteFrequencyData(D.data);
    },

    Sound: function() {
        D.sound = new webkitAudioContext();
        D.source = D.sound.createMediaElementSource(D.audio);
        D.node = D.sound.createScriptProcessor(2048, 1, 1);
        D.analyser = D.sound.createAnalyser();
        D.data = new Uint8Array(D.analyser.frequencyBinCount);
        D.analyser.smoothingTimeConstant = D.stc;
        D.analyser.fftSize = D.ftt;
        D.source.connect(D.analyser);
        D.analyser.connect(D.node);
        D.node.connect(D.sound.destination);
        D.source.connect(D.sound.destination);
        D.node.onaudioprocess = D.Process;
    },

    Theme: function() {
        var i = D.theme.list.indexOf(D.theme.name);
        if (++i > D.theme.list.length - 1) i = 0;
        D.theme.name = D.theme.list[i];
        document.body.className = D.theme.name;
    },

    Drag: function(e) {
        e.preventDefault();
    },

    Drop: function(e) {
        e.preventDefault();
        D.Audio(URL.createObjectURL(e.dataTransfer.files[0]));
    },

    Bind: function() {
        document.body.addEventListener('click', D.Theme, false);
        document.body.addEventListener('dragover', D.Drag, false);
        document.body.addEventListener('drop', D.Drop, false);
        D.audio.addEventListener('canplay', D.Play, false);
    },

    Set: function() {
        D.A.Init();
        D.B.Init();
        D.C.Init();
    },

    Init: function() {
        D.audio = new Audio();
        D.audio.volume = D.volume;
        D.audio.loop = true;
        D.info = document.querySelector('i');
        D.canvas = document.querySelector('canvas');
        D.canvas.width = D.width;
        D.canvas.height = D.height;
        D.ctx = D.canvas.getContext('2d');
    },

    Run: function(src) {
        D.Init();
        D.Set();
        D.Theme();
        D.Sound();
        D.Bind();
        D.Audio(src);
        D.Draw();
    }

};
