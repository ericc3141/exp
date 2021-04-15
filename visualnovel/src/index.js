import React, { useRef } from "react";
import ReactDOM from "react-dom";

import VN, { Background, Character } from "./vn";
import club from "./demo/Club.webp";
import classroom from "./demo/Class.webp";
import mon1 from "./demo/Mon1.webp";
import mon2 from "./demo/Mon2.webp";
import mon22 from "./demo/Mon22.webp";
import mon18 from "./demo/Mon18.webp";

function Demo(props) {
    const script = useRef(async (ui) => {
        const scene = { background: { bg: <Background key="bg" src={club} /> } };
        // convenience shortcuts
        const show = (...args) => ui.show(scene, ...args);
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const monika = (src, pos) => {
            scene.background.monika = <Character
                key="monika"
                src={src}
                pos={pos}
            />;
        }
        let playerName = "???";
        let metMonika = false;
        const m = (text) => ({ dialogue: { speaker: metMonika? "Monika" : "???", text, } });
        const u = (text) => ({ dialogue: { speaker: playerName, text, } });
        const choice = (...options) => ({ choice: { options } });
        const prompt_ = (prompt) => ({ textPrompt: { prompt } });

        // Action!
        const startTime = new Date();
        monika(mon1, 50);
        await show(m("Ah, didn't expect to see anyone here."));
        monika(mon2, 50);
        playerName = await show(
            m("What's your name?"),
            prompt_("Enter your name")
        );

        monika(mon1, 50);
        const knowsMonika = await show(
            u("Wait..."),
            choice(["Who are you?", false], ["Monika?!", true]),
        );
        if (knowsMonika) {
            metMonika = true;
            monika(mon18, 50);
            await show(m("Yeah... I also had questions..."));
            monika(mon2, 50);
        } else {
            monika(mon2, 50);
            await show(m("I'm Monika, let me show you around"));
            metMonika = true;
        }
        let firstLoop = true;
        let changedBackground = false;
        while (true) {
            const branch = await show(
                m(`What ${firstLoop ? "" : "else "}can I try to answer?`),
                choice(
                    ["Where are we?", "where"],
                    ["Why does this exist?", "why"],
                    ["What can you do here?", "what"],
                    ["How does this work?", "how"],
                    ["Did you do this?", "who"],
                ),
            );
            if (branch === "where") {
                await show(m("That's the easiest one."));
                await show(m("We've made it to the interwebs!"));
                monika(mon22, 50);
                await show(m("Specifically, we're in a really small crappy visual novel engine, if you like calling generic software engines."));
                monika(mon2, 50);
                await show(m("Things look a bit rough around the edges, but it looks like it works. I hope."));
            } else if (branch === "why") {
                await show(m("Well, you know how programmers are..."));
                monika(mon22, 50);
                await show(m("Why use existing software when you can do it worse yourself?"));
                monika(mon2, 50);
                await show(m("If you want to know, it's because most existing systems look like frameworks you plug things into..."));
                await show(m("... as opposed to components that are meant to be plugged into other things."));
                await show(m("This thing is meant to be a component that plugs into a bigger site."));
                await show(m("Is that judgement correct, and will this thing work?"));
                monika(mon18, 50);
                await show(m("Only time will tell."));
                monika(mon2, 50);
            } else if (branch === "what") {
                await show(m("The absolute basics, and not too much else."));
                monika(mon22, 50);
                await show(m("It looks like I can change poses..."));
                monika(mon22, 10);
                await show(m("... move around..."));
                monika(mon2, 50);
                if (!changedBackground) {
                    scene.background.bg = <Background src={classroom} key="bg" />
                    changedBackground = true;
                    await show(m("... and flip the background!"));
                    await show(m("No transition on that one though."));
                } else {
                    await show(m("... and, well, you've seen the background"));
                }
                await show(m("More animations and sound might be possible..."));
                await show(m("I'm not sure if they'll happen though."));
            } else if (branch === "how") {
                await show(m("In the spirit of doing things in unconventional ways..."));
                await show(m("... all game scripting is done with Javascript and HTML and CSS."));
                await show(m("The good news is that I can do real interesting stuff, ..."));
                await show(m(`... like tell you it's been ${(new Date() - startTime) / 1000} seconds since we started talking.`));
                await show(m("The bad news is, well, Javascript."));
            } else if (branch === "who") {
                await show(m("No. I write Python. And poetry."));
                monika(mon18, 50);
                await show(m("It's... been a while since I've done poetry."));
                monika(mon2, 50);
            }
            firstLoop = false;
        }
    });
    return <VN script={script.current} />;
}

ReactDOM.render(
    <React.StrictMode>
        <Demo />
    </React.StrictMode>,
    document.getElementById("react-app"),
)
