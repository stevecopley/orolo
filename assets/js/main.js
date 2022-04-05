var toggleButton = document.getElementById( "menu-toggle" );
var menu = document.getElementById( "main-menu" );

if( toggleButton && menu ) {
    toggleButton.addEventListener( "click", function() {
        menu.classList.toggle( "menu-visible" );
    });
}