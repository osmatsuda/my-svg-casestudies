import React, { useRef, useState, useEffect, useReducer, useContext } from 'react';
import { getSvgTitle, dimmed, ItemsDispatch } from './utils';
import Popup from './Popup';

// ISSUE: mouse over and kirakira is not stable.

function itemsUpdated(items, diff) {
    return items.map((item) => {
	if (item[diff.test.key] === diff.test.value) {
	    diff.updates.forEach((update) => {
		item[update.key] = update.value;
	    });
	}
	return item;
    });
}

function App(props) {
    const [items, dispatch] = useReducer(itemsUpdated, props.items);
    return (
	<ItemsDispatch.Provider value={dispatch}>
	    <ItemList items={items}/>
	</ItemsDispatch.Provider>
    );
}

function ItemList(props) {
    const lis = [];
    let popup;
    for (const item of props.items) {
	if (item.popup) {
	    popup = <Popup rect={item.rect} src={item.path} title={item.title}/>;
	}
	lis.push(<li key={item.path}><Item {...item}/></li>);
    }

    document.body.style.overflow = !popup ? 'visible' : 'hidden';
    return (
	<>
	    <ul>{lis}</ul>
	    {popup}
	</>
    );
}

function Item(props) {
    const href = '?' + props.name;
    const src = props.path;
    const itemsUpdate = useContext(ItemsDispatch);
    // eyeCatching
    //   0: no
    //   1: live
    //   2: ended
    const [eyeCatching, setEyeCatching] = useState(0);
    const anchor = useRef(null);

    useEffect(() => {
	getSvgTitle(src)
	    .then((title) => {
		itemsUpdate({
		    test: { key: 'path', value: src, },
		    updates: [
			{ key: 'title', value: title, },
		    ],
		});
	    });
    }, [src, itemsUpdate]);

    function mouseHover(e) {
	if (e.type === 'mouseenter' && eyeCatching === 0) {
	    setEyeCatching(1);
	} else if (e.type === 'mouseleave') {
	    setEyeCatching(0);
	}
    }

    function popupWork(e) {
	e.preventDefault();
	const tnn = e.target.nodeName.toLowerCase();
	if (!!anchor.current && (tnn === 'img' || tnn === 'embed')) {
	    const arect = anchor.current.getBoundingClientRect();
	    itemsUpdate({
		test: { key: 'path', value: src, },
		updates: [
		    { key: 'popup', value: true, },
		    { key: 'rect', value: arect, },
		],
	    });
	}
    }

    if (props.popup) {
	return (
	    <a href={href}>
		{dimmed(href.slice(1), props.rect)}
	    </a>
	);
    } else if (props.title !== null) {
	return (
	    <a
		ref={anchor}
		href={href}
		onMouseEnter={mouseHover}
		onMouseLeave={mouseHover}
		onClick={popupWork}
	    ><Thumbnail
		 popupWork={popupWork}
		 setEyeCatching={setEyeCatching}
		 eyeCatching={eyeCatching}
		 alt={props.title}
		 src={src}/></a>
	);
    } else {
	return <a href={href}>...</a>;
    }
}

function Thumbnail(props) {
    const {eyeCatching, setEyeCatching, popupWork} = props;
    const embed = useRef(null);

    useEffect(() => {
	if (eyeCatching === 1) {
	    embed.current.addEventListener('kirakira.click', (e) => {
		popupWork(e);
	    });
	    embed.current.addEventListener('kirakira.endEvent', (e) => {
		setEyeCatching(2);
	    });
	}
    }, [eyeCatching, setEyeCatching, popupWork]);

    const img = <img alt={props.alt} src={props.src}/>;
    if (eyeCatching === 1) {
	return (
	    <>
		{img}
		<embed
		    ref={embed}
		    title={props.alt}
		    type="image/svg+xml"
		    src={process.env.PUBLIC_URL + "/kirakira.svg"}/>
	    </>
	);
    }
    return img;
}

export default App;
