import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Scene from './Scene';


const container = document.getElementById('my-app');
const items = [].map.call(container.querySelectorAll('li>a'), (a) => {
    const path = a.pathname;
    const name = path.split('/').reverse()[0];
    return {
	path: path,
	name: name,
	title: null,
	rect: null,
	popup: false,
    };
});

const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
	<App items={items}/>
    </React.StrictMode>
);



const defaultScene = new Scene({
    title: 'body>header:first-child>svg',
    toRepos: 'body>footer a[title="repository"]>svg',
});

let resizeTimerId;
window.addEventListener('resize', (e) => {
    if (resizeTimerId !== undefined) {
	clearTimeout(resizeTimerId);
    }
    resizeTimerId = setTimeout(() => {
	defaultScene.resized();
    }, 250);
});

let scrollTimerId;
window.addEventListener('scroll', (e) => {
    if (scrollTimerId !== undefined) {
	clearTimeout(scrollTimerId);
    }
    scrollTimerId = setTimeout(() => {
	defaultScene.scrolled();
    }, 60);
});
