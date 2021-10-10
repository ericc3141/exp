
let GITHUB = "https://github.com";
let RAW_GITHUB = "https://raw.githubusercontent.com";

function parseGithubPath(urlString) {
    let url;
    try {
        url = new URL(urlString);
    } catch (e) {
        return null;
    }
    if (!(url.origin === GITHUB)) {
        return null;
    }
    let [_, user, repo, type, ...path ] = url.pathname.split("/");
    if (!(["tree", "blob", "commit"].includes(type))) {
        return null;
    }
    return { url, user, repo, type, path };
}

function makeDownloadUrl(parsed) {
    if (parsed.type === "blob") {
        let downloadUrl = new URL(RAW_GITHUB);
        downloadUrl.pathname = [parsed.user, parsed.repo].concat(parsed.path).join("/")
        return downloadUrl;
    }
    if (parsed.type === "commit") {
        let downloadUrl = new URL(parsed.url);
        downloadUrl.pathname += ".patch";
        return downloadUrl;
    }
    return null;
}


function replaceLink(link) {
    let originalHref = link.href;
    let parsed = parseGithubPath(originalHref);
    if (parsed === null) {
        return;
    }
    let downloadUrl = makeDownloadUrl(parsed);
    if (downloadUrl === null) {
        return;
    }
    link.href = downloadUrl.href;
    link.addEventListener("click", (e) => {
        e.preventDefault();
        window.location = originalHref;
    });
}

document.body.addEventListener("pointerdown", (e) => {
    if (e.target.tagName === "A" && e.button === 2) {
        replaceLink(e.target);
    }
});

