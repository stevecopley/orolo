window.addEventListener( 'DOMContentLoaded', () => {

    // Menu observer - triggered when top pixel of menu scrolls past screen edge
    const nav = document.getElementById( 'main-nav' );

    let observer = new IntersectionObserver( 
        ( [e] ) => {
            e.target.classList.toggle( 'sticking', e.intersectionRatio < 1 )
        },    
        { threshold: 1 }
    );
    
    observer.observe( nav );
    
    // Article observers - triggered when articles in view - highlight any menu items

    // const header   = document.getElementById( 'main-header' );
    const articles = document.querySelectorAll( 'article[id]' );
    const navItems = document.querySelectorAll( '#main-menu a.internal' );

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
        { threshold: 0.25 }
     );

    // if( header ) observer.observe( header );
    articles.forEach( ( article ) => observer.observe( article ) );

} );