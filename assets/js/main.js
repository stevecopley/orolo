window.addEventListener( 'DOMContentLoaded', () => {

    // Menu observer - triggered when top pixel of menu scrolls past screen edge
    let observer = new IntersectionObserver( ( [e] ) => {
        e.target.classList.toggle( 'sticking', e.intersectionRatio < 1 )
    },    
    { threshold: [1] }
    );
    
    const nav = document.getElementById( 'main-nav' );
    observer.observe( nav );
    
    // Article observers - triggered when articles in view - highlight any menu items
    observer = new IntersectionObserver( ( [e] ) => {
        const id = e.target.getAttribute( 'id' );
        const navItem = document.querySelector( `nav li a[href="/#${id}"]` );

        navItem.classList.toggle( 'active', e.intersectionRatio > 0 );
    } );
  
    // Track all articles that have an `id` applied
    document.querySelectorAll( 'article[id]' ).forEach( ( article ) => {
        observer.observe( article );
    } );

} );