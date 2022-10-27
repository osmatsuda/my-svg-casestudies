import React, { useRef, useState, useEffect, useContext } from 'react';
import { getSvgTitle, dimmed, ItemsDispatch, filename } from './utils';
import Popup from './Popup';


function ItemList(props) {
    const lis = [];
    let popup;
    for (const item of props.items) {
	if (item.popupState > 0) {
	    popup = <Popup {...item}/>;
	}
	lis.push(<li key={item.src}><Item {...item}/></li>);
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
    const href = '?get=' + filename(props.src);
    const src = props.src;
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
		    test: { key: 'src', value: src, },
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
		test: { key: 'src', value: src, },
		updates: [
		    { key: 'popupState', value: 1, },
		    { key: 'rect', value: arect, },
		],
	    });
	}
	setEyeCatching(0);
    }

    if (props.popupState > 0) {
	return (
	    <a href={href}>
		{dimmed(filename(props.src), props.rect)}
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
	    }, { once: true });
	    embed.current.addEventListener('kirakira.endEvent', (e) => {
		setEyeCatching(2);
	    }, { once: true });
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

export default ItemList;
