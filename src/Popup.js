import { useRef, useEffect, useState, useContext } from 'react';
import { pageRect, ItemsDispatch } from './utils';


function Popup(props) {
    const refT = useRef(null);
    const refF = useRef(null);
    const [closable, setClosable] = useState(false);
    const timer = useRef(null);
    const savedRect = pageRect(props.rect);
    const itemsUpdate = useContext(ItemsDispatch);
    const {src, title, popupState} = props;
    const [closeAnimate, setCloseAnimate] = useState(popupState);

    useEffect(() => {
	const ppt = refT.current;
	const ppf = refF.current;
	if (timer.current === null && !!ppt && !!ppf) {
	    timer.current = setTimeout(() => {
		ppt.style.top = window.scrollY + 'px';
		ppt.style.left = window.scrollX + 'px';
		ppt.style.width = window.innerWidth + 'px';
		ppt.style.height = window.innerHeight + 'px';
		ppt.style.opacity = .5;

		ppf.style.opacity = 1;
	    }, 1);

	    if (popupState === 1) {
		ppf.addEventListener('transitionend', (e) => {
		    setClosable(true);
		    window.history.pushState(null, title, '?get=' + src);
		}, { once: true });
	    } else {
		setClosable(true);
	    }
	}
    }, [timer, src, title, popupState]);

    function close() {
	if (closeAnimate === 2) {
	    setCloseAnimate(1);
	}
	setClosable(false);

	refF.current.style.opacity = 0;
	const tnst = refT.current;
	setTimeout(() => {
	    tnst.style.top = savedRect.top;
	    tnst.style.left = savedRect.left;
	    tnst.style.width = savedRect.width;
	    tnst.style.height = savedRect.height;
	    tnst.style.opacity = 1;
	}, 250);

	tnst.addEventListener('transitionend', (e) => {
	    itemsUpdate({
		test: { key: 'src', value: props.src, },
		updates: [
		    { key: 'popupState', value: 0, },
		],
	    });
	    window.history.pushState(null, title, '/');
	}, { once: true });
    }
    return (
	<>
	    <img
		ref={refT}
		className={closeAnimate === 1 ? 'popuptransition' : 'popuptransition noanimate'}
		style={savedRect}
		src={src}
		alt=''/>
	    <iframe
		ref={refF}
		className={closeAnimate === 1 ? 'popupframe' : 'popupframe noanimate'}
		title={title}
		src={src}/>
	    {closable ? <Close close={close}/> : null}
	</>
    );
}

function Close(props) {
    const once = useRef(null);
    const embed = useRef(null);
    const close = props.close;

    useEffect(() => {
	if (once.current === null) {
	    embed.current.addEventListener('close.click', (e) => {
		close();
	    }, { once: true });
	    once.current = true;
	}
    }, [once, embed, close]);
    
    return (
	<embed
	    ref={embed}
	    className="popupclose"
	    type="image/svg+xml"
	    src={process.env.PUBLIC_URL + '/close.svg'}/>
    );
}

export default Popup;
