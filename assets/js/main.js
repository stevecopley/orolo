function scrolledIntoView( elem ) {
    const viewportTrigger  = 0.95;
    const triggerBottom = window.pageYOffset + (window.innerHeight * viewportTrigger);
    let scrollAmount = 0;

    if( elem.offsetTop > triggerBottom ) {
        scrollAmount = 0;
    } 
    else if( elem.offsetTop + elem.offsetHeight < triggerBottom ) {
        scrollAmount = 1;
    }
    else {
        scrollAmount = (triggerBottom - elem.offsetTop) / elem.offsetHeight;
    }

    return scrollAmount;
}


window.addEventListener( 'DOMContentLoaded', () => {

    // const header   = document.getElementById( 'main-header' );
    const header   = document.getElementById( 'main-header' );
    const nav      = document.getElementById( 'main-nav' );
    const navItems = document.querySelectorAll( '#main-menu a.internal' );
    const articles = document.querySelectorAll( 'article[id]' );
    const sections = document.querySelectorAll( 'article[id] > section' );

    // Menu observer - triggered when top pixel of menu scrolls past screen edge
    let observer = new IntersectionObserver( 
        ( [e] ) => {
            e.target.classList.toggle( 'sticking', e.intersectionRatio < 1 )
        },    
        { threshold: 1 }
    );
    
    observer.observe( nav );
    

    // Article observers - triggered when articles in view - highlight any menu items
    navItems.forEach( item => item.classList.remove( 'active' ) );

    observer = new IntersectionObserver( 
        ( [e] ) => {
            const id = e.target.getAttribute( 'id' );
            const navItem = document.querySelector( `#main-menu a[href="/#${id}"]` );

            console.log( `INTER ${id} ${e.isIntersecting} -> ${navItem}` );

            if( e.isIntersecting ) {
                navItems.forEach( item => item.classList.remove( 'active' ) );
                navItem.classList.add( 'active' );
            }
            else {
                navItem.classList.remove( 'active' );
            }
        },
        { threshold: 0.5 }
     );

    articles.forEach( ( article ) => observer.observe( article ) );

    // Scroller listener to enable css animations

    function updateScroll() {
        document.body.style.setProperty(       '--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight) || 1 );
        if( header ) header.style.setProperty( '--scroll', Math.min( window.pageYOffset / header.offsetHeight, 1 ) );
        if( header )    nav.style.setProperty( '--scroll', Math.min( window.pageYOffset / header.offsetHeight, 1 ) );
        articles.forEach( ( article ) => article.style.setProperty( '--scroll', scrolledIntoView( article ) ) );
        sections.forEach( ( section ) => section.style.setProperty( '--scroll', scrolledIntoView( section ) ) );
    }

    updateScroll();

    window.addEventListener( 'scroll', updateScroll, false);
    
} );