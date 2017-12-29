(function() {
    const sliderTemplate = document.createElement('template');
    sliderTemplate.innerHTML = `
        <link rel="stylesheet" href="slider.css">
        <div id="slider">
            <div class="navigation prev"> &#x2039; </div>
            <div id="sliderItems">
                <slot></slot>
            </div>
            <div class="navigation next"> &#x203A; </div>
        </div>
    `;

    class Slider extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open'});
            this.shadowRoot.appendChild(sliderTemplate.content.cloneNode(true));
            this._slot = this.shadowRoot.querySelector('slot');
            this._sliderItems = this.shadowRoot.querySelector('#sliderItems');
            this._slideIndex = 0;
            this._slideCount = 0;

            this._slot.addEventListener('slotchange', e => {
                this._slideCount = this.getChildren().length;
                this.setSlideWidth();
            });
        }

        getChildren() {
            return this._slot.assignedNodes({ flatten: true })
                .filter(child => child.nodeType !== Node.TEXT_NODE);
        }

        setSlideWidth() {
            const slideWidth = `${this._slideCount * 100}%`;
            this._sliderItems.style.width = slideWidth;
        }

        handleNavigationClick(e) {
            const isNext = e.target.classList.contains('next');
            const isPrev = e.target.classList.contains('prev');
            const isLastSlide = this._slideIndex === (this._slideCount - 1);
            const isFirstSlide = this._slideIndex === 0;
            const step = 100 / this._slideCount;

            if (isNext && !isLastSlide) {
                this._slideIndex += 1;
                this._sliderItems.style.transform = `translateX(-${step * this._slideIndex}%)`;
            }

            if (isPrev && !isFirstSlide) {
                this._slideIndex -= 1;
                this._sliderItems.style.transform = `translateX(-${step * this._slideIndex}%)`;
            }
        }

        attachNavigationListener() {
            Array.from(this.shadowRoot.querySelectorAll('.navigation')).forEach(elem => {
                elem.addEventListener('click', this.handleNavigationClick.bind(this));
            });
        }

        connectedCallback() {
            this.attachNavigationListener();
        }
    }

    window.customElements.define('x-slider', Slider);
})();
