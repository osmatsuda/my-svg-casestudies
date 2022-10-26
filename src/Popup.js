import { useRef, useEffect, useState, useContext } from 'react';
import { pageRect, ItemsDispatch } from './utils';


function Popup(props) {
    const refT = useRef(null);
    const refF = useRef(null);
    const [closable, setClosable] = useState(false);
    const timer = useRef(null);
    const savedRect = pageRect(props.rect);
    const itemsUpdate = useContext(ItemsDispatch);

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
	    }, 100);

	    ppf.addEventListener('transitionend', (e) => {
		setClosable(true);
	    }, { once: true });
	}
    }, [timer]);

    function close() {
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
		test: { key: 'path', value: props.src, },
		updates: [
		    { key: 'popup', value: false, },
		],
	    });
	}, { once: true });
    }
    return (
	<>
	    <img
		ref={refT}
		className='popuptransition'
		style={savedRect}
		src={props.src}
		alt=''/>
	    <iframe
		ref={refF}
		className='popupframe'
		title={props.title}
		src={props.src}/>
	    {closable ? <Close close={close}/> : null}
	</>
    );
}

function Close(props) {
    const once = useRef(null);
    const embed = useRef(null);
    const close = props.close;
    //const savedRect = props.savedRect;

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
