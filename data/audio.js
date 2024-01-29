const audio = {
    map: new Howl({
        src: "./audio/rain.ogg",
        volume: 0.1,
        html5: true,
        sprite: {
            main: [0, 11033, true],
        },
    }),
    walk: new Howl({
        src: "./audio/walk.ogg",
        volume: 0.2,
        html5: true,
        sprite: {
            main: [1680, 400, false],
        },
        rate: 2
    }),
};
