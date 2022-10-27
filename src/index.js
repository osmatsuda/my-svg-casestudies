import React, { useReducer } from 'react';
import ReactDOM from 'react-dom/client';
import Scene from './Scene';
import ItemList from './Items';
import { ItemsDispatch } from './utils';


const rootNode = document.getElementById('my-app');
const initItems = [].map.call(rootNode.querySelectorAll('li>a'), (a) => {
    const svgsrc = a.pathname;
    return {
	src: svgsrc,
	title: null,
	rect: null,
	// popupState:
	//   0: nopopup
	//   1: by click
	//   2: by browser UI
	popupState: 0,
    };
});

if (window.location.search !== '') {
    (([_, src, ...rest]) => {
	let invalidSearch = true;
	for (const item of initItems) {
	    if (item.src === src) {
		item.popupState = 2;
		invalidSearch = false;
		break;
	    }
	}
	if (invalidSearch) {
	    window.history.replaceState(null, '', '/');
	}
    })(window.location.search.match(/[&?]get=([^&]*).*$/));
}

function itemsUpdated(items, diff) {
    if (diff.test === null) {
	const _return = items.map((item) => {
	    diff.updates.forEach((update) => {
		item[update.key] = update.value;
	    });
	    return item;
	});
	return _return;
    }
    if (!!diff.testfailed && diff.testfailed.length > 0) {
	const _return = items.map((item) => {
	    if (item[diff.test.key] === diff.test.value) {
		diff.updates.forEach((update) => {
		    item[update.key] = update.value;
		});
	    } else {
		diff.testfailed.forEach((update) => {
		    item[update.key] = update.value;
		});
	    }
	    return item;
	});
	return _return;
    }
    const _return = items.map((item) => {
	if (item[diff.test.key] === diff.test.value) {
	    diff.updates.forEach((update) => {
		item[update.key] = update.value;
	    });
	}
	return item;
    });
    return _return;
}

function App(props) {
    const [items, dispatch] = useReducer(itemsUpdated, props.items);
    locationCtl.itemsUpdate = dispatch;

    return (
	<ItemsDispatch.Provider value={dispatch}>
	    <ItemList items={items}/>
	</ItemsDispatch.Provider>
    );
}

function LocationCtl() {
    window.addEventListener('popstate', (e) => {
	const diff = this.updateState();
	this.itemsUpdate(diff);
    });
}

LocationCtl.prototype.updateState = function() {
    let test = null;
    const updates = [];
    const testfailed = [];
    const current = window.location.search.match(/[&?]get=([^&]*).*$/);
    if (current === null) {
	updates.push({ key: 'popupState', value: 0 });
    } else {
	test = { key: 'src', value: current[1] };
	updates.push({ key: 'popupState', value: 2 });
	testfailed.push({ key: 'popupState', value: 0 });
    }
    return {test, updates, testfailed};
};

LocationCtl.prototype.itemsUpdate = function() {};

const locationCtl = new LocationCtl();


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


const root = ReactDOM.createRoot(rootNode);
root.render(
    <React.StrictMode>
	<App items={initItems}/>
    </React.StrictMode>
);

