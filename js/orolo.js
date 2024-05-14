const animationTime = 500;

const NL = 10;
const SPC = 32;
const NBSP = 160;

const wrappingChars = [32, 33, 45, 47, 63, 92, 124, 125, 173, 180];
const codeRanges = [
    { 'start':  33, 'end':  64 },
    { 'start':  91, 'end':  96 },
    { 'start': 123, 'end': 126 },
    { 'start': 161, 'end': 191 },
    // { 'start': 224, 'end': 255 },
];

const blankChars = [NBSP];
const randChars = [];
codeRanges.forEach(range => {
    for (let i = range.start; i <= range.end; i++) {
        if (!wrappingChars.includes(i)) randChars.push(i);
    }
});


//-----------------------------------------------------------------
// MARK: Menu Highlight

document.body.addEventListener('htmx:afterSettle', evt => {
    const contentName = evt.detail.pathInfo.requestPath.replace('pages/','').replace('.html','');
    const contentLinkId = 'link-' + contentName;

    const links = document.querySelectorAll('nav a');

    Array.from(links).forEach(link => {
        if (link.id == contentLinkId) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
});


//-----------------------------------------------------------------
// MARK: Image Zoom

document.body.addEventListener('htmx:afterSwap', evt => {
    const images = document.querySelectorAll('#gallery img');

    Array.from(images).forEach(image => {
        image.addEventListener('click', () => {
            image.classList.toggle('zoomed');
        });
    });
});


//-----------------------------------------------------------------
// MARK: Remove Text

document.body.addEventListener('htmx:beforeSwap', evt => {
    const children = getAllDescendants(evt.detail.target);
    const [origTexts, blankTexts, codeTexts] = parseText(children);
    typeText(children, origTexts, codeTexts, blankTexts);
});


//-----------------------------------------------------------------
// MARK: Add Text

document.body.addEventListener('htmx:afterSwap', evt => {
    const children = getAllDescendants(evt.detail.target);
    const [origTexts, blankTexts, codeTexts] = parseText(children);
    typeText(children, blankTexts, codeTexts, origTexts);
});


//-----------------------------------------------------------------
// MARK: Parse Text

function parseText(nodes) {
    const origTexts = [];
    const blankTexts = [];
    const codeTexts = [];

    nodes.forEach(node => {
        origTexts.push(node.textContent);
        blankTexts.push(generateAltText(node, blankChars));
        codeTexts.push(generateAltText(node, randChars));
    });

    return [origTexts, blankTexts, codeTexts];
}


//-----------------------------------------------------------------
// MARK: Type Text

function typeText(nodes, startTexts, tweenTexts, finalTexts) {
    let totalChars = 0;

    for (let c = 0; c < nodes.length; c++) {
        nodes[c].textContent = startTexts[c];
        totalChars += startTexts[c].length;
    }

    let pass = 0;
    const numPasses = Math.max(parseInt(totalChars / 15), 1);
    const passTime = parseInt(animationTime / numPasses);

    const typist = setInterval(() => {
        const passDepth = pass / numPasses;
        const finalTop    = (passDepth * 2) - 1.0;
        const finalBottom = (passDepth * 2) - 0.5;
        const tweenTop    = (passDepth * 2) - 0.5;
        const tweenBottom = (passDepth * 2) - 0.0;

        let charPos = 0;

        for (let c = 0; c < nodes.length; c++) {
            const node = nodes[c];
            const tweenText = tweenTexts[c];
            const finalText = finalTexts[c];
            const currentText = node.textContent;
            const len = currentText.length;

            let newText = '';

            for (let i = 0; i < len; i++) {
                const charDepth = (charPos + i) / totalChars;

                const diceRoll = Math.random();
                const tweenThreshold = (1 - charDepth) / 50;
                const finalThreshold = (1 - charDepth) / 5;

                const tweening  = charDepth <= tweenBottom && charDepth > tweenTop;
                const finishing = charDepth <= finalBottom && charDepth > finalTop;
                const allDone   = charDepth <= finalTop;

                const shouldTween  = tweening  && (diceRoll < tweenThreshold);
                const shouldFinish = finishing && (diceRoll < finalThreshold);

                if      (allDone)      newText += finalText[i];
                else if (shouldFinish) newText += finalText[i];
                else if (shouldTween)  newText += tweenText[i];
                else                   newText += currentText[i];
            }

            node.textContent = newText;
            charPos += len;
        }

        pass++;
        if (pass > numPasses) clearInterval(typist);
    }, passTime);
}


//-----------------------------------------------------------------
// MARK: Find Descendants

function getAllDescendants(node) {
    const descendants = [];

    getDescendants(node);

    function getDescendants(node) {
        Array.from(node.childNodes).forEach(child =>{
            getDescendants(child);
            if (child.nodeName == '#text') descendants.push(child);
        })
    }

    return descendants;
}


//-----------------------------------------------------------------
// MARK: Alt Version of text

function generateAltText(node, charSet) {
    const originalText = node.textContent;
    const len = originalText.length;
    let altText = '';
    let prevCode = NL;

    for (let i = 0; i < len; i++) {
        const code = originalText.charCodeAt(i);
        let altCode = SPC;

        if (code == SPC || code == NL) altCode = code;
        else if (prevCode != NL && wrappingChars.includes(code)) altCode = SPC;
        else altCode = charSet[(Math.floor(Math.random() * charSet.length))];

        altText += String.fromCharCode(altCode);
        prevCode = code;
    }

    return altText;
}

