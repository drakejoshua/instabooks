import {
    Children,
    cloneElement,
    createContext,
    isValidElement,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { Slot } from "radix-ui";
import { useMemo } from "react";

const CarouselContext = createContext();

function useCarousel() {
    const context = useContext(CarouselContext);

    if (!context) {
        throw new Error(
            "useCarousel must be used within a Carousel Root component",
        );
    }

    return context;
}

function Root({ children, asChild, ...props }) {
    const [slideLength, setSlideLength] = useState(0);
    const [activeSlide, setActiveSlide] = useState(1); // start at 1 for readability, since slides are 1-indexed
    const autoplayRef = useRef(null);

    const Component = asChild ? Slot.Root : "div";

    useEffect(() => {
        // clear any existing interval
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
        }

        // set up a new interval to go to the next slide every 5 seconds
        autoplayRef.current = setInterval(() => {
            goToNextSlide();
        }, 5000);

        // clean up the interval on unmount
        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
            }
        };
    }, [activeSlide, slideLength]);

    function registerSlideLength(length) {
        setSlideLength(length);
    }

    function goToSlide(index) {
        // if the index is less than 1, set it to the
        // last slide
        if (index < 1) {
            setActiveSlide(slideLength);
            // if the index is greater than the number of slides,
            // set it to the first slide
        } else if (index > slideLength) {
            setActiveSlide(1);
        } else {
            // otherwise, set the active slide to the index
            setActiveSlide(index);
        }
    }

    function goToPrevSlide() {
        goToSlide(activeSlide - 1);
    }

    function goToNextSlide() {
        goToSlide(activeSlide + 1);
    }

    return (
        <CarouselContext.Provider
            value={useMemo(
                () => ({
                    slideLength,
                    activeSlide,
                    registerSlideLength,
                    goToSlide,
                    goToPrevSlide,
                    goToNextSlide,
                }),
                [slideLength, activeSlide])}
        >
            <Component {...props}>{children}</Component>
        </CarouselContext.Provider>
    );
}

function Track({ children, asChild, ...props }) {
    const Component = asChild ? Slot.Root : "div";
    let { activeSlide, registerSlideLength } = useCarousel();

    useEffect(() => {
        registerSlideLength(Children.count(children));
    }, [children]);

    return (
        <Component 
            style={{ "--active-slide": activeSlide - 1 }}
            {...props}
        >
            {children}
        </Component>
    );
}

function Item({ children, asChild, ...props }) {
    const Component = asChild ? Slot.Root : "div";

    return <Component {...props}>{children}</Component>;
}

function PrevButton({ children, asChild, ...props }) {
    const Component = asChild ? Slot.Root : "button";
    const { goToPrevSlide } = useCarousel();

    return <Component onClick={goToPrevSlide} {...props}>{children}</Component>;
}

function NextButton({ children, asChild, ...props }) {
    const Component = asChild ? Slot.Root : "button";
    const { goToNextSlide } = useCarousel();

    return <Component onClick={goToNextSlide} {...props}>{children}</Component>;
}

function Indicators({ children, asChild, ...props }) {
    const Component = asChild ? Slot.Root : "div";
    let { activeSlide, goToSlide } = useCarousel();

    return (
        <Component {...props}>
            {Children.map(children, (child, index) => {
                if (!isValidElement(child)) return child;

                return cloneElement(child, {
                    "data-active-slide": index + 1 === activeSlide,
                    "data-index": index + 1,
                    onClick: (e) => {
                        child.props.onClick?.(e);
                        goToSlide(index + 1);
                    },
                });
            })}
        </Component>
    );
}

function Indicator({ children, asChild, ...props }) {
    const Component = asChild ? Slot.Root : "button";

    return <Component {...props}>{children}</Component>;
}

export default {
    Root,
    Track,
    Item,
    PrevButton,
    NextButton,
    Indicators,
    Indicator,
};
