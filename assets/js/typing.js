const typingSpeed = 100;
const displaySpeed = 10;

const initialDelay = 500;
const inputDelay = 1000;

const typingFont = new FontFaceObserver( 'Silkscreen' );

typingFont.load().then( () => {
    console.log('GOT FONT');
    document.documentElement.classList.add( 'fonts-loaded' );
    resizeWindows();
} );

const typingElements = document.querySelectorAll( '.typing' );


function resizeWindows() {
    typingElements.forEach( el => {
        const width = el.clientWidth + 1;  // Need to always round up, so add 1
        const height = el.clientHeight + 1;  // Need to always round up, so add 1
        // el.style.width = "calc(" + width + "px + 1em)";
        el.style.height = height + "px";

        // const typingBlocks = el.children;

        // for( const block of typingBlocks ) {
        //     const width = block.clientWidth + 1;  // Need to always round up, so add 1
        //     const height = block.clientHeight + 1;  // Need to always round up, so add 1
        //     block.style.width = "calc(" + width + "px)";
        //     block.style.height = height + "px";
        // }
    } );
}

resizeWindows();

typingElements.forEach( el => {

    setTimeout( () => {
        const typingBlocks = el.children;

        let delay = initialDelay;

        for( const block of typingBlocks ) {
            if( window.getComputedStyle( block ).display !== "none" ) {
                const text = block.innerText;
                const isUserInput = block.classList.contains( "prompt" );
                const speed = isUserInput ? typingSpeed : displaySpeed;
                let blockTime = text.length * speed;
                blockTime += isUserInput ? inputDelay : 0;

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

                delay += blockTime;
            }
        }
    }, initialDelay );
} );


function typeEffect( element, text, speed, isUserInput ) {
    element.style.color = isUserInput ? "yellow" : "white";
    element.style.setProperty( "--prompt-colour", "yellow" );
    element.style.setProperty( "--caret-colour", "yellow" );

    let i = 0;
    let pause = isUserInput ? Math.floor( inputDelay / speed ) : 0;

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

            if( element.tagName == 'A' ) {
                element.style.textDecoration = "underline";
            }

            // element.style.setProperty( "--caret-colour", "transparent" );
        }
    }, speed );
}

