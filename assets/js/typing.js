const typingSpeed = 100;
const displaySpeed = 10;

const initialDelay = 1000;
const delayBetweenBlocks = 1000;

const typingElements = document.querySelectorAll( '.typing' );


typingElements.forEach( el => {
    const width = el.clientWidth + 1;  // Need to always round up, so add 1
    const height = el.clientHeight + 1;  // Need to always round up, so add 1
    el.style.width = "calc(" + width + "px + 2em)";
    el.style.height = height + "px";

    setTimeout( () => {
        const typingBlocks = el.children;

        let delay = initialDelay;

        for( const block of typingBlocks ) {
            const text = block.innerText;
            const isUserInput = block.classList.contains( "prompt" );
            const speed = isUserInput ? typingSpeed : displaySpeed;
            const blockTime = text.length * speed;

            block.style.color = "transparent";
            block.innerHTML = "";

            if( block == el.firstElementChild ) {
                block.style.setProperty( "--prompt-colour", "yellow" );
                block.style.setProperty( "--caret-colour", "yellow" );
            }

            setTimeout( () => {
                for( clearBlock of typingBlocks ) {
                    clearBlock.style.setProperty( "--caret-colour", "transparent" );
                }
                typeEffect( block, text, speed, isUserInput );
            }, delay );

            delay += blockTime + (isUserInput? delayBetweenBlocks : 0);
        }
    }, initialDelay );
} );


function typeEffect( element, text, speed, isUserInput ) {
    element.style.color = isUserInput ? "yellow" : "white";
    element.style.setProperty( "--prompt-colour", "yellow" );
    element.style.setProperty( "--caret-colour", "yellow" );

    let i = 0;
    let pause = 10;

    const timer = setInterval( () => {
        if( pause > 0 ) {
            pause--;
        }
        else if( i < text.length ) {
            element.append( text.charAt( i ) );
            i++;
        }
        else {
            clearInterval( timer );
            // element.style.setProperty( "--caret-colour", "transparent" );
        }
    }, speed );
}

