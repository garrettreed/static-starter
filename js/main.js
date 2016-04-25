(() => {
    let body = document.getElementsByTagName('body')[0];

    let p = document.createElement('p');
    p.innerHTML = "This was created with js.";

    body.appendChild(p);

})();
