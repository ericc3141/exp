import React, { useRef } from "react";
import ReactDOM from "react-dom";

import VN, { useImp, useScript, DialogueInput, Background, Character } from "./vn";
import club from "./demo/Club.webp";
import classroom from "./demo/Class.webp";
import mon1 from "./demo/Mon1.webp";
import mon2 from "./demo/Mon2.webp";
import mon22 from "./demo/Mon22.webp";
import mon18 from "./demo/Mon18.webp";

function Demo(props) {
    const [ monikaElem, setMonika ] = useImp(Character, {src: mon1});
    const [ backElem, setBack ] = useImp(Background, {src: club});
    const [ diElem, show ] = useImp(DialogueInput);
    useScript(async () => {
        // convenience shortcuts
        const bg = (src) => setBack({ src });
        const monika = (src, pos) => setMonika({ src, pos });
        const m = (text) => ({ dialogue: { speaker: metMonika? "Monika" : "???", text, } });
        const u = (text) => ({ dialogue: { speaker: playerName, text, } });

        const choice = (...options) => ({ choice: { options } });
        const prompt_ = (prompt) => ({ textPrompt: { prompt } });

        // Action!
        let playerName = "???";
        let metMonika = false;
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
            await show(m("Guess we haven't met. I'm Monika."));
            await show(m("Let me show you around"));
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
                    bg(classroom);
                    changedBackground = true;
                    await show(m("... and flip the background!"));
                    await show(m("No transition on that one though."));
                } else {
                    await show(m("... and, well, you've seen the background"));
                }
                await show(m("More animations and sound might be possible..."));
                await show(m("I'm not sure if they'll happen though."));
            } else if (branch === "how") {
                await show(m("It seems pretty typical for visual novel engines to come with their own scripting language."));
                await show(m("These languages make it simple and easy to define characters, offer choices, and do visual novel stuff."));
                await show(m("In the spirit of being highly atypical..."));
                await show(m("... Everything here is written in full, fat Javascript, in all its Turing complete glory."));
                await show(m("The good news is that I can do real interesting stuff, ..."));
                await show(m(`... like tell you it's been ${(new Date() - startTime) / 1000} seconds since we started talking.`));
                await show(m("The bad news is that characters, saves, and literally any niceties are on you."));
                await show(m("And, well, Javascript."));
            } else if (branch === "who") {
                await show(m("No. I write Python. And poetry."));
                monika(mon18, 50);
                await show(m("It's... been a while since I've done poetry."));
                monika(mon2, 50);
            }
            firstLoop = false;
        }
    });
    return <div style={{ fontSize: "1.5em" }}>
        {backElem} {monikaElem} {diElem}
    </div>;
}

ReactDOM.render(
    <React.StrictMode>
        <Demo />
    </React.StrictMode>,
    document.getElementById("react-app"),
)
