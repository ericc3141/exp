import React, { useState, useEffect, useRef } from 'react';

export function Background(props) {
    return <img src={props.src} style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        objectFit: "cover",
    }} />
}

export function Character(props) {
    return <img src={props.src} style={{
        transition: "all 1s ease-in-out",
        position: "absolute",
        left: `${props.pos}%`,
        bottom: 0,
        height: "100%",
        maxWidth: "100%",
        transform: "translate(-50%,0)",
        objectFit: "contain",
        objectPosition: "bottom"
    }} />
}

function Option(props) {
    const [isHover, setHover] = useState(false);
    let hoverStyles = {
        backgroundColor: "#fde7f3",
        color: "black",
    };
    if (isHover) {
        hoverStyles = {
            backgroundColor: "#ffffff",
            color: "#e7ada6",
        };
    }

    return <input 
        type="button"
        onClick={(e) => props.onClick(e)}
        value={props.text}
        onPointerEnter={(e) => setHover(true)}
        onPointerLeave={(e) => setHover(false)}
        style={{
            ...hoverStyles,
            textAlign: "center",
            display: "block",
            width: "60%",
            maxWidth: "30em",
            border: ".1em solid #efc5dc",
            fontWeight: "600",
            fontSize: ".8em",
        }}
    />
}
function Choice(props) {
    const optionElems = props.options.map((option, idx) => (
        <Option 
            key={idx}
            onClick={(e) => props.onChoice(option[1])}
            text={option[0]}
        />
    ));
    return <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        paddingBottom: "6em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }}>{optionElems}</div>
}

function TextPrompt(props) {
    const inputRef = useRef();
    useEffect(() => {
        console.log(inputRef.current);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });
    return <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF88",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <div style={{
            display: "inline-block",
            padding: "1em",
            border: ".1em solid #f6c4e0",
            backgroundColor: "#fde7f3",
            textAlign: "center",
        }}>
            <p style={{ color: "black" }}>{props.prompt}</p>
            <input type="text" ref={inputRef} style={{
                width: "100%",
                backgroundColor: "transparent",
                fontSize: "1em",
                textAlign: "center",
                borderBottom: ".02em solid black",
                color: "white",
                caretColor: "#a97e94",
                fontWeight: "700",
                WebkitTextStroke: ".05em black",
                letterSpacing: "-0.05em",
            }} />
            <input type="button" 
                onClick={(e) => props.onTextPrompt(inputRef.current.value)} 
                value="OK"
                style={{
                    backgroundColor: "transparent",
                    fontSize: "1.5em",
                    fontWeight: "900",
                    color: "white",
                    WebkitTextStroke: ".08em #a97e94",
                    letterSpacing: "-0.08em",
                }}/>
        </div>
    </div>

}

function Dialogue(props) {
    let quote = null;
    let speaker = null;
    if ("speaker" in props) {
        quote = <span>"</span>;
        speaker = <p style={{
            position: "absolute",
            left: "1em",
            top: "-1.6em",
            width: "7em",
            height: "1.5em",
            textAlign: "center",
            color: "white",
            backgroundColor: "#FFFFFFDD",
            borderBottom: ".3em solid #88888888",
            borderRadius: ".5em .5em 0 0",
            fontWeight: "900",
            WebkitTextStroke: ".08em #935482",
            letterSpacing: "-.08em",
        }}>{props.speaker}</p>;
    }
    return <div style={{
            position: "absolute",
            left: "5%",
            bottom: "1%",
            width: "90%",
    }} >
        <div style={{
            position: "relative",
            margin: "0 auto",
            maxWidth: "50em",
            backgroundColor: "#fdb3d5DD",
            borderRadius: ".6em",
            border: ".15em solid #FFFFFF",
            padding: "1em",
        }}>
            {speaker}
            <p style={{
                height: "3em",
                color: "white",
                fontWeight: "700",
                WebkitTextStroke: ".05em black",
                letterSpacing: "-0.05em",
            }}>{quote}{props.text}{quote}</p>
        </div>
    </div>
}

export default function VN(props) {
    const [line, setLine] = useState({});
    const [showInput, setShowInput] = useState(false);

    const script = props.script;
    const show = (...args) => {
        setShowInput(false);

        let resolve;
        const shown = new Promise((res, rej) => {resolve = res;});
        let newLine = { shown: resolve };
        for (const i of args) {
            newLine = {...newLine, ...i};
        }
        setLine(newLine);

        return shown;
    }
    useEffect(() => {
        script({ show });
    }, [script]);

    const handleDialogue = (e) => {
        if (["A", "INPUT"].indexOf(e.target.tagName) >= 0) {
            return;
        } else if ("choice" in line || "textPrompt" in line) {
            setShowInput(true);
        } else {
            line.shown(null);
        }
    }
    let inputElement = null;
    if (showInput) {
        if ("choice" in line) {
            inputElement = <Choice {...line.choice} onChoice={line.shown} />;
        } else if ("textPrompt" in line) {
            inputElement = <TextPrompt {...line.textPrompt} onTextPrompt={line.shown} />;
        }
    }

    return <div style={{
        width: "100%",
        height: "100%",
        position: "relative",
        fontSize: "1.5em",
    }} onClick={handleDialogue} >
        {typeof line.background === "object" ? Object.values(line.background) : null}
        { "dialogue" in line ? <Dialogue  {...line.dialogue} onDialogue={handleDialogue} /> : null }
        { inputElement }
    </div>
}
