import React, { RefObject, useEffect, useRef, useState } from 'react';

import './App.css';

interface ISwipeProps {
    onSuccess: () => void;
    onFailure?: () => void;
    unlockText: string;
    lockText?: string;
    disabled?: boolean;
    color: string;
    loading: boolean;
}

const App = (props: ISwipeProps) => {
    const {  lockText, color, onSuccess: onSuccessCallback, onFailure, loading } = props;
    let startX = 0;
    const slider: RefObject<HTMLDivElement> = useRef(null);
    const container: RefObject<HTMLDivElement> = useRef(null);
    const isTouchDevice = 'ontouchstart' in document.documentElement;

    const [containerWidth, setContainerWidth] = useState(0);
    const [unlocked, setUnlocked] = useState(false);
    const [unmounted, setUnmounted] = useState(false);
    const [sliderLeft, setSliderLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);


    const updateSliderStyle = () => {
        console.log(unmounted, unlocked, "??????????????/", slider)
        if (unmounted || unlocked) return;
        if (slider.current) {
            console.log(sliderLeft, "==========>")
            slider.current.style.left = sliderLeft + 50 + 'px';
        }
    };

    const onDrag = (e: any) => {
        console.log("ondrag", "9999999", containerWidth);
            if (unmounted || unlocked) return;
            if (isTouchDevice) {
                const x = Math.min(Math.max(0, e.touches[0].clientX - startX), containerWidth);
                console.log(x, "xxxxxxxxx", e.touches, startX, containerWidth);
                
                setSliderLeft(x);
            } else {
                const x = Math.min(Math.max(0, e.clientX - startX), containerWidth);
                console.log(x, "yyyyyyyyy", e.touches, startX, containerWidth);
                
                setSliderLeft(x);

            }
        updateSliderStyle();
    };

    const stopDrag = () => {
        if (unmounted || unlocked) return;
        if (isDragging) {
            setIsDragging(false)
            if (sliderLeft > containerWidth * 0.9) {
                setSliderLeft(containerWidth)
                onSuccess();
                onSuccessCallback();
            } else {
                setSliderLeft(0);
                if (onFailure) {
                    onFailure();
                }
            }
            updateSliderStyle();
        }
    };

    const startDrag = (e: any) => {
        console.log("8888888888",  "startDrag");
        if (unmounted || unlocked) return;
        setIsDragging(true);
        if (isTouchDevice) {
            startX = e.touches[0].clientX;
        } else {
            startX = e.clientX;
        }
    };

    const onSuccess = () => {
        if (container.current) {
            container.current.style.width = container.current.clientWidth + 'px';
        }
        setUnlocked(true);
    };

    const getText = () => {
        return loading ? 'Loading' : lockText || 'SLIDE';
    };

    //const reset = () => {
    //    if (unmounted) return;
    //    setUnlocked(false);
    //};

    useEffect(() => {
        if (!unlocked) {
            setSliderLeft(0);
            updateSliderStyle();
        }
    }, [unlocked]);

    useEffect(() => {
        console.log("use effect ran");
        if (isTouchDevice) {
            document.addEventListener('touchmove', onDrag);
            document.addEventListener('touchend', stopDrag);
        } else {
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        }
        console.log(container.current?.clientWidth, "000000000000000");
        
        if (container.current) {
            setContainerWidth(container.current.clientWidth - 50)
        }

        return () => {
            setUnmounted(true);
        };
    }, []);

    return (
        <div className='ReactSwipeButton'>
            <div className={'rsbContainer'} ref={container}>
                <div
                    className='rsbcSlider'
                    ref={slider}
                    onMouseDown={startDrag}
                    style={{ background: color }}
                    onTouchStart={startDrag}
                >
                    <span className='rsbcSliderText'>{getText()}</span>
                    <span className='rsbcSliderArrow'></span>
                    <span className='rsbcSliderCircle' style={{ background: color }}></span>
                </div>
                <div className='rsbcText'>{getText()}</div>
            </div>
        </div>
    );
};

export default App;
