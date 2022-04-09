const navElement = document.getElementById( 'main-nav' );

const observer = new IntersectionObserver( 
    ( [e] ) => e.target.classList.toggle( 'sticking', e.intersectionRatio < 1 ),
    { threshold: [1] }
);

observer.observe( navElement );

