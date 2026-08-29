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

// This component defines a carousel using the sub-components
// pattern. It provides a context for managing the state of 
// the carousel, including the active slide, the total number
// of slides, and functions for navigating between slides. 
// The carousel also supports autoplay functionality, 
// automatically advancing to the next slide every 5 
// seconds.

// create a context for the carousel to share state 
// and functions
const CarouselContext = createContext();

// custom hook to access the carousel context
function useCarousel() {
    const context = useContext(CarouselContext);

    // throw an error if the hook is used outside of the
    // Carousel Root component
    if (!context) {
        throw new Error(
            "useCarousel must be used within a Carousel Root component",
        );
    }

    return context;
}

// define the Root component of the carousel, which provides
// the context to its children and manages the state of the
// carousel
function Root({ children, asChild, ...props }) {
    // states to manage slide data and current slide index 
    const [slideLength, setSlideLength] = useState(0);
    const [activeSlide, setActiveSlide] = useState(1); // start at 1 for readability, since slides are 1-indexed

    // autoplayRef is used to store the interval ID 
    // for the autoplay functionality of the carousel
    const autoplayRef = useRef(null);

    // generate the component to render based on the asChild prop
    // this functionality uses the polymorphic Slot pattern from 
    // Radix UI to allow the component to render as a different 
    // HTML element or component if desired
    const Component = asChild ? Slot.Root : "div";

    // useEffect hook to set up the autoplay functionality
    // it clears any existing interval and sets up a new one 
    // that calls goToNextSlide every 5 seconds.
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

    // registerSlideLength()
    // This function is used to set the total number 
    // of slides in the carousel. It is called when 
    // the carousel is initialized or when the number 
    // of slides changes.
    function registerSlideLength(length) {
        setSlideLength(length);
    }

    // goToSlide()
    // This function is used to navigate to a specific 
    // slide in the carousel. It takes an index as an 
    // argument and updates the activeSlide state accordingly.
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

    // goToPrevSlide() and goToNextSlide() are helper functions
    // that call goToSlide() with the appropriate index to 
    // navigate to the previous or next slide, respectively.
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

// define the Track component of the carousel, which is responsible
// for rendering the slides and managing the active slide state
function Track({ children, asChild, ...props }) {
    // generate the component to render based on the asChild prop
    const Component = asChild ? Slot.Root : "div";

    // get the activeSlide and registerSlideLength functions 
    // from the carousel context
    let { activeSlide, registerSlideLength } = useCarousel();

    // useEffect hook to register the number of slides in 
    // the carousel, it counts the number of children (slides) 
    // and calls registerSlideLength
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

// define the Item component of the carousel, which represents an
// individual slide. It can be rendered as a different HTML 
// element or component if desired, using the asChild prop.
function Item({ children, asChild, ...props }) {
    // generate the component to render based on the asChild prop
    const Component = asChild ? Slot.Root : "div";

    return <Component {...props}>{children}</Component>;
}

// define the PrevButton and NextButton components of the carousel,
// which are used to navigate to the previous and next slides,
// respectively. They can be rendered as different HTML elements 
// or components if desired, using the asChild prop.
function PrevButton({ children, asChild, ...props }) {
    // generate the component to render based on the asChild prop
    const Component = asChild ? Slot.Root : "button";

    // get the goToPrevSlide function from the carousel context
    const { goToPrevSlide } = useCarousel();

    return <Component onClick={goToPrevSlide} {...props}>{children}</Component>;
}

// define the NextButton component of the carousel, which is used to
// navigate to the next slide. It can be rendered as a different
// HTML element or component if desired, using the asChild prop.
function NextButton({ children, asChild, ...props }) {
    const Component = asChild ? Slot.Root : "button";
    const { goToNextSlide } = useCarousel();

    return <Component onClick={goToNextSlide} {...props}>{children}</Component>;
}

// define the Indicators component of the carousel, which represents
// the navigation dots for each slide. It can be rendered as a different
// HTML element or component if desired, using the asChild prop.
function Indicators({ children, asChild, ...props }) {
    // generate the component to render based on the 
    // asChild prop
    const Component = asChild ? Slot.Root : "div";

    // get the activeSlide and goToSlide functions from 
    // the carousel context
    let { activeSlide, goToSlide } = useCarousel();

    return (
        <Component {...props}>
            {Children.map(children, (child, index) => {
                // if the child is not a valid React element,
                // return it as is, else, clone the child element 
                // and add additional props for managing the active 
                // state, styling and click behavior
                if (!isValidElement(child)) return child;

                // return cloned child element with additional props
                return cloneElement(child, {
                    "data-active-slide": index + 1 === activeSlide,   // props to indicate if the slide is active
                    "data-index": index + 1,   // props to indicate the index of the slide
                    // merge the existing onClick handler of the child with the 
                    // goToSlide function to navigate to the clicked slide
                    onClick: (e) => {
                        child.props.onClick?.(e);
                        goToSlide(index + 1);
                    },
                });
            })}
        </Component>
    );
}

// define the Indicator component of the carousel, which represents
// an individual navigation dot for a slide. It can be rendered as a 
// different HTML element or component if desired, using the asChild prop.
function Indicator({ children, asChild, ...props }) {
    // generate the component to render based on the asChild prop
    const Component = asChild ? Slot.Root : "button";

    return <Component {...props}>{children}</Component>;
}


// export the carousel components as a single object for easy import and usage
export default {
    Root,
    Track,
    Item,
    PrevButton,
    NextButton,
    Indicators,
    Indicator,
};
