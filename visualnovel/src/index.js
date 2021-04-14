import React, { useRef } from "react";
import ReactDOM from "react-dom";

import { VN } from "./vn";

function Demo(props) {
    const script = useRef(async (ui) => {
        await ui.show({ dialogue: { text: "Hi" }});
        while (true) {
            await ui.show({ dialogue: { text: "Hi" }, choice: { options: [["1",1]] } });
        }
        return;
    });
    return <VN script={script.current} />;
}

ReactDOM.render(
    <React.StrictMode>
        <Demo />
    </React.StrictMode>,
    document.getElementById("react-app"),
)
