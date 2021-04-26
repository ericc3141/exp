import React, { useState, useEffect, useRef } from 'react';

export function Background(props) {
    const { src } = props;
    if (!src) { return null; }
    return <img src={src} style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        objectFit: "cover",
    }} />
}

export function Character(props) {
    const { src, pos } = props;
    if (!src) { return null; }
    return <img src={src} style={{
        transition: "all 1s ease-in-out",
        position: "absolute",
        left: `${pos}%`,
        bottom: 0,
        height: "100%",
        maxWidth: "100%",
        transform: "translate(-50%,0)",
        objectFit: "contain",
        objectPosition: "bottom"
    }} />
}

function Option(props) {
    const { onNext, text } = props;
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
        onClick={onNext}
        value={text}
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
export function Choice(props) {
    const { options, onNext } = props;
    if (!options) { return null; }
    const optionElems = options.map((option, idx) => (
        <Option 
            key={idx}
            onNext={(e) => onNext(option[1])}
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

export function TextPrompt(props) {
    const { onNext, prompt } = props;
    const inputRef = useRef();
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });
    if (!prompt) { return null; }
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
        <form style={{
            display: "inline-block",
            padding: "1em",
            border: ".1em solid #f6c4e0",
            backgroundColor: "#fde7f3",
            textAlign: "center",
        }} onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            onNext(data.get("response"));
        }} >
            <p style={{ color: "black" }}>{prompt}</p>
            <input type="text" ref={inputRef} name="response" style={{
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
            <input type="submit" 
                value="OK"
                style={{
                    backgroundColor: "transparent",
                    fontSize: "1.5em",
                    fontWeight: "900",
                    color: "white",
                    WebkitTextStroke: ".08em #a97e94",
                    letterSpacing: "-0.08em",
                }}/>
        </form>
    </div>

}

export function Dialogue(props) {
    const { onNext, speaker, text } = props;
    const boxRef = useRef(null);
    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.focus();
        }
    });
    if (!text) { return null; }
    const shouldIgnore = (e) => ["A", "INPUT"].indexOf(e.target.tagName) >= 0
    const handleEvent = (e) => {
        if (shouldIgnore(e)) { return; }
        onNext();
    };
    let quoteElem = null;
    let speakerElem = null;
    if ("speaker" in props) {
        quoteElem = <span>"</span>;
        speakerElem = <p style={{
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
        }}>{speaker}</p>;
    }
    return <div style={{
            position: "absolute",
            left: "5%",
            bottom: "1%",
            width: "90%",
    }} >
        <div onClick={handleEvent} onKeyDown={handleEvent} tabindex="0" ref={boxRef} style={{
            position: "relative",
            margin: "0 auto",
            maxWidth: "50em",
            backgroundColor: "#fdb3d5DD",
            borderRadius: ".6em",
            border: ".15em solid #FFFFFF",
            padding: "1em",
        }}>
            {speakerElem}
            <p style={{
                height: "3em",
                color: "white",
                fontWeight: "700",
                WebkitTextStroke: ".05em black",
                letterSpacing: "-0.05em",
            }}>{quoteElem}{text}{quoteElem}</p>
        </div>
    </div>
}

export function DialogueInput(props) {
    const { dialogue, textPrompt, choice, onNext } = props;
    const [showInput, setShowInput] = useState(false);

    const advance = (e) => {
        if (textPrompt || choice) {
            setShowInput(true);
        } else {
            onNext(e);
        }
    };

    let inputElem = null;
    if (showInput) {
        if (textPrompt) {
            inputElem = <TextPrompt onNext={onNext} {...textPrompt} />;
        } else if (choice) {
            inputElem = <Choice onNext={onNext} {...choice} />;
        }
    }
    return <>
        <Dialogue onNext={advance} {...dialogue} />
        {inputElem}
    </>;
}

export function useImp(Component, initProps) {
    const [props, setProps] = useState(initProps || {});
    const update = (...newProps) => {
        let onNext;
        const nextPromise = new Promise( resolve => { onNext = resolve } );
        let withNext = { onNext };
        for (const i of newProps) {
            withNext = { ...withNext, ...i };
        }
        setProps(withNext);
        return nextPromise;
    };

    return [<Component {...props} />, update];
}

export function useScript(script) {
    const scriptRef = useRef(script);
    useEffect(() => scriptRef.current(), []);
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

