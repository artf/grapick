import EventEmitter from 'tiny-emitter'
import Handler from './Handler'
import {on} from './utils'

const comparator = (l, r) => {
  return l.position - r.position;
}

export default class Grapick extends EventEmitter {

  constructor(options = {}) {
    super();
    const pfx = 'grp';
    options = Object.assign({}, options);
    const defaults = {
      // Class prefix
      pfx,

      // HTMLElement/query string on which the gradient input will be attached
      el: `.${pfx}`,

      // Element to use for the custom color picker, eg. '<div class="my-custom-el"></div>'
      // Will be added inside the color picker container
      colorEl: '',

      // Minimum handler position, default: 0
      min: 0,

      // Maximum handler position, default: 100
      max: 100,

      // Any supported gradient direction: 'left' (default), 'top', 'bottom', 'right', '90deg', etc.
      direction: 'left',

      // Gradient type, available options: 'linear' (default) | 'radial' | 'repeating-linear' | 'repeating-radial'
      type: 'linear',

      // Gradient input height, default: '30px'
      height: '30px',

      // Gradient input width, default: '100%'
      width: '100%',
    };

    for (let name in defaults) {
      if (!(name in options))
        options[name] = defaults[name];
    }

    let el = options.el;
    el = typeof el == 'string' ? document.querySelector(el) : el;

    if (!(el instanceof HTMLElement)) {
      throw `Element not found, given ${el}`;
    }

    this.el = el;
    this.handlers = [];
    this.options = options;
    this.on('handler:color:change', (h, c) => this.change(c));
    this.on('handler:position:change', (h, c) => this.change(c));
    this.on('handler:remove', h => this.change(1));
    this.render();
  }

  /**
   * Set custom color picker
   * @param {Object} cp Color picker interface
   * @example
   * // TAKE IN ACCOUNT a single color picker instance
   * gi.setColorPicker(handler => {
   *    const colorEl = handler.getColorEl();
   *
   *    // Or you might face something like this
   *    colorPicker2({
   *      el: colorEl,
   *      startColoer: handler.getColor(),
   *      change(color) {
   *        handler.setColor(color);
   *      }
   *    });
   *
   *    // jQuery style color picker
   *    $(colorEl).colorPicker3({...}).on('change', () => {
   *      handler.setColor(this.value);
   *    })
   * })
   */
  setColorPicker(cp) {
    this.colorPicker = cp;
  }

  /**
   * Get the complete style value
   * @return {string}
   * @example
   * const ga = new Grapick({...});
   * ga.addHandler(0, '#000');
   * ga.addHandler(55, 'white');
   * console.log(ga.getValue());
   * // -> `linear-gradient(left, #000 0%, white 55%)`
   */
  getValue(type, angle) {
    const color = this.getColorValue();
    const t = type || this.getType();
    const a = angle || this.getDirection();
    return color ? `${t}-gradient(${a}, ${color})` : '';
  }

  /**
   * Get the gradient value with the browser prefix if necessary
   * @return {string}
   */
  getSafeValue(type, angle) {
    const previewEl = this.previewEl;
    const value = this.getValue(type, angle);
    !this.sandEl && (this.sandEl = document.createElement('div'))

    if (!previewEl || !value) {
      return '';
    }

    const style = this.sandEl.style;
    const values = [value, ...this.getPrefixedValues(type, angle)];

    for (let i = 0; i < values.length; i++) {
      let val = values[i];
      style.background = val;

      if (style.background == val) {
          break;
      }
    }

    return style.background;
  }

  /**
   * Get only colors value
   * @return {string}
   * @example
   * const ga = new Grapick({...});
   * ga.addHandler(0, '#000');
   * ga.addHandler(55, 'white');
   * console.log(ga.getColorValue());
   * // -> `#000 0%, white 55%`
   */
  getColorValue() {
    let handlers = this.handlers;
    handlers.sort(comparator);
    handlers = handlers.length == 1 ? [handlers[0], handlers[0]] : handlers;
    return handlers.map(handler => handler.getValue()).join(', ');
  }

  /**
   * Get an array with browser specific values
   * @return {Array}
   * @example
   * const ga = new Grapick({...});
   * ga.addHandler(0, '#000');
   * ga.addHandler(55, 'white');
   * console.log(ga.getPrefixedValues());
   * // -> [
   *  "-moz-linear-gradient(left, #000 0%, white 55%)",
   *  "-webkit-linear-gradient(left, #000 0%, white 55%)"
   *  "-o-linear-gradient(left, #000 0%, white 55%)"
   * ]
   */
  getPrefixedValues(type, angle) {
    const value = this.getValue(type, angle);
    return ['-moz-', '-webkit-', '-o-', '-ms-'].map(prefix =>
      `${prefix}${value}`);
  }
  /**
   * Trigger change
   * @param {Boolean} complete Indicates if the change is complete (eg. while dragging is not complete)
   */
  change(complete = 1) {
    this.updatePreview();
    this.emit('change', complete);
  }

  /**
   * Set gradient direction, eg. 'top', 'left', 'bottom', 'right', '90deg', etc.
   * @param {string} direction Any supported direction
   */
  setDirection(direction) {
    this.options.direction = direction;
    this.change();
  }

  /**
   * Set gradient direction, eg. 'top', 'left', 'bottom', 'right', '90deg', etc.
   * @param {string} direction Any supported direction
   */
  getDirection() {
    return this.options.direction;
  }

  /**
   * Set gradient type, available options: 'linear' or 'radial'
   * @param {string} direction Any supported direction
   */
  setType(type) {
    this.options.type = type;
    this.change();
  }

  /**
   * Get gradient type
   * @return {string}
   */
  getType() {
    return this.options.type;
  }

  /**
   * Add gradient handler
   * @param {integer} position Position integer in percentage
   * @param {string} color Color string, eg. red, #123, 'rgba(30,87,153,1)', etc..
   * @param {Boolean} select Select the handler once it's added
   * @return {Object} Handler object
   */
  addHandler(position, color, select = 1) {
    const handler = new Handler(this, position, color, select);
    this.change();
    return handler;
  }

  /**
   * Get handler by index
   * @param  {integer} index
   * @return {Object}
   */
  getHandler(index) {
    return this.handlers[index];
  }

  /**
   * Get all handlers
   * @return {Array}
   */
  getHandlers() {
    return this.handlers;
  }

  /**
   * Remove all handlers
   */
  clear() {
    const handlers = this.handlers;

    for (var i = handlers.length - 1; i >= 0; i--) {
       handlers[i].remove();
    }
  }

  /**
   * Return selected handler if one exists
   * @return {Handler|null}
   */
  getSelected() {
    const handlers = this.getHandlers();

    for (let i = 0; i < handlers.length; i++) {
      let handler = handlers[i];

      if (handler.isSelected()) {
        return handler;
      }
    }

    return null;
  }

  /**
   * Update preview element
   */
  updatePreview() {
    const previewEl = this.previewEl;
    previewEl && (previewEl.style.background = this.getSafeValue('linear', 'left'));
  }

  initEvents() {
    const opt = this.options;
    const min = opt.min;
    const max = opt.max;
    const pEl = this.previewEl;
    let percentage = 0;
    const elDim = {};
    pEl && on(pEl, 'click', e => {
      // First of all, find a position of the click in percentage
      elDim.w = pEl.clientWidth;
      elDim.h = pEl.clientHeight;
      const x = e.offsetX - pEl.clientLeft;
      const y = e.offsetY - pEl.clientTop;
      percentage = x / elDim.w * 100;

      if (percentage > max || percentage < min) {
        return;
      }

      // Now let's find the pixel color by using the canvas
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      canvas.width = elDim.w;
      canvas.height = elDim.h;
      let grad = context.createLinearGradient(0, 0, elDim.w, elDim.h);
      this.getHandlers().forEach(h => grad.addColorStop(h.position/100, h.color));
      context.fillStyle = grad;
      context.fillRect(0, 0, canvas.width, canvas.height);
      canvas.style.background = 'black';
      const rgba = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      const color = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
      this.addHandler(percentage, color);
    });
  }

  /**
   * Render the gradient picker
   */
  render() {
    const opt = this.options;
    const el = this.el;
    const pfx = opt.pfx;
    const height = opt.height;
    const width = opt.width;

    if (!el) {
      return;
    }

    const wrapperCls = `${pfx}-wrapper`;
    const previewCls = `${pfx}-preview`;
    el.innerHTML = `
      <div class="${wrapperCls}">
        <div class="${previewCls}"></div>
      </div>
    `;
    const wrapperEl = el.querySelector(`.${wrapperCls}`);
    const previewEl = el.querySelector(`.${previewCls}`);
    const styleWrap = wrapperEl.style;
    styleWrap.position = 'relative';
    this.wrapperEl = wrapperEl;
    this.previewEl = previewEl;

    if (height) {
      styleWrap.height = height;
    }

    if (width) {
      styleWrap.width = width;
    }

    this.initEvents();
    this.updatePreview();
  }
}
