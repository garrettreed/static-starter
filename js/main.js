(() => {
    let body = document.getElementsByTagName('body')[0];

    let p = document.createElement('p');
    p.innerHTML = "hello there";

    body.appendChild(p);
})();
