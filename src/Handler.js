import {on, off} from './utils'

/**
 * Handler is the color stop of the gradient
 */
export default class Handler {

  constructor(Grapick, position = 0, color = 'black', select = 1) {
    Grapick.getHandlers().push(this);
    this.gp = Grapick;
    this.position = position;
    this.color = color;
    this.selected = 0;
    this.render();
    select && this.select();
  }

  toJSON() {
    return {
      position: this.position,
      selected: this.selected,
      color: this.color,
    };
  }

  /**
   * Set color
   * @param {string} color Color string, eg. red, #123, 'rgba(30,87,153,1)', etc..
   * @param {Boolean} complete Indicates if the action is complete
   * @example
   * handler.setColor('red');
   */
  setColor(color, complete = 1) {
    this.color = color;
    this.emit('handler:color:change', this, complete);
  }

  /**
   * Set color
   * @param {integer} position Position integer in percentage, eg. 20, 50, 100
   * @param {Boolean} complete Indicates if the action is complete
   * @example
   * handler.setPosition(55);
   */
  setPosition(position, complete = 1) {
    const el = this.getEl();
    this.position = position;
    el && (el.style.left = `${position}%`);
    this.emit('handler:position:change', this, complete);
  }

  /**
   * Get color of the handler
   * @return {string} Color string
   */
  getColor() {
    return this.color;
  }

  /**
   * Get position of the handler
   * @return {integer} Position integer
   */
  getPosition() {
    return this.position;
  }

  /**
   * Indicates if the handler is the selected one
   * @return {Boolean}
   */
  isSelected() {
    return !!this.selected;
  }

  /**
   * Get value of the handler
   * @return {string}
   * @example
   * handler.getValue(); // -> `black 0%`
   */
  getValue() {
    return `${this.getColor()} ${this.getPosition()}%`;
  }

  /**
   * Select the current handler and deselect others
   */
  select() {
    const el = this.getEl();
    const handlers = this.gp.getHandlers();
    handlers.forEach(handler => handler.deselect());
    this.selected = 1;
    const clsNameSel = this.getSelectedCls();
    el && (el.className += ` ${clsNameSel}`);
    this.emit('handler:select', this);
  }

  /**
   * Deselect the current handler
   */
  deselect() {
    const el = this.getEl();
    this.selected = 0;
    const clsNameSel = this.getSelectedCls();
    el && (el.className = el.className.replace(clsNameSel, '').trim());
    this.emit('handler:deselect', this);
  }

  getSelectedCls() {
    const pfx = this.gp.options.pfx;
    return `${pfx}-handler-selected`;
  }

  /**
   * Remove the current handler
   * @param {Object} [options={}] Options
   * @param {Boolean} [options.silent] Don't trigger events
   * @return {Handler} Removed handler (itself)
   */
  remove(options = {}) {
    const el = this.getEl();
    const handlers = this.gp.getHandlers();
    const removed = handlers.splice(handlers.indexOf(this), 1)[0];
    el && el.parentNode.removeChild(el);
    !options.silent && this.emit('handler:remove', removed);
    return removed;
  }

  /**
   * Get handler element
   * @return {HTMLElement}
   */
  getEl() {
    return this.el;
  }

  initEvents() {
    const eventDown = 'touchstart mousedown';
    const eventMove = 'touchmove mousemove';
    const eventUp = 'touchend mouseup';
    const el = this.getEl();
    const previewEl = this.gp.previewEl;
    const options = this.gp.options;
    const min = options.min;
    const max = options.max;
    const closeEl = el.querySelector('[data-toggle=handler-close]');
    const colorContEl = el.querySelector('[data-toggle=handler-color-c]');
    const colorWrapEl = el.querySelector('[data-toggle=handler-color-wrap]');
    const colorEl = el.querySelector('[data-toggle=handler-color]');
    const dragEl = el.querySelector('[data-toggle=handler-drag]');
    colorContEl && on(colorContEl, 'click', e => e.stopPropagation());
    closeEl && on(closeEl, 'click', e => {
      e.stopPropagation();
      this.remove()
    });
    colorEl && on(colorEl, 'change', e => {
      const target = e.target;
      const value = target.value;
      this.setColor(value);
      colorWrapEl && (colorWrapEl.style.backgroundColor = value);
    });

    if (dragEl) {
      let pos = 0;
      let posInit = 0;
      let dragged = 0;
      const elDim = {};
      const startPos = {};
      const deltaPos = {};
      const axis = 'x';
      const drag = e => {
        dragged = 1;
        deltaPos.x = e.clientX - startPos.x;
        deltaPos.y = e.clientY - startPos.y;
        pos = (axis == 'x' ? deltaPos.x : deltaPos.y) * 100;
        pos = pos / (axis == 'x' ? elDim.w : elDim.h);
        pos = posInit + pos;
        pos = pos < min ? min : pos;
        pos = pos > max ? max : pos;
        this.setPosition(pos, 0);
        this.emit('handler:drag', this, pos);
        // In case the mouse button was released outside of the window
        e.which === 0 && stopDrag(e);
      };
      const stopDrag = e => {
        if (!dragged) {
          return;
        }
        dragged = 0;
        this.setPosition(pos);
        off(document, eventMove, drag);
        off(document, eventUp, stopDrag);
        this.emit('handler:drag:end', this, pos);
      };
      const initDrag = e => {
        //Right or middel click
        if (e.button !== 0) {
          return;
        }
        this.select();
        posInit = this.position;
        elDim.w = previewEl.clientWidth;
        elDim.h = previewEl.clientHeight;
        startPos.x = e.clientX;
        startPos.y = e.clientY;
        on(document, eventMove, drag);
        on(document, eventUp, stopDrag);
        this.emit('handler:drag:start', this);
      };

      on(dragEl, eventDown, initDrag);
      on(dragEl, 'click', e => e.stopPropagation());
    }
  }

  emit() {
    this.gp.emit(...arguments);
  }

  /**
   * Render the handler
   * @return {HTMLElement} Rendered element
   */
  render() {
    const gp = this.gp;
    const opt = gp.options;
    const previewEl = gp.previewEl;
    const colorPicker = gp.colorPicker;
    const pfx = opt.pfx;
    const colorEl = opt.colorEl;
    const color = this.getColor();

    if (!previewEl) {
      return;
    }

    const hEl = document.createElement('div');
    const style = hEl.style;
    const baseCls = `${pfx}-handler`;
    hEl.className = baseCls;
    hEl.innerHTML = `
      <div class="${baseCls}-close-c">
        <div class="${baseCls}-close" data-toggle="handler-close">&Cross;</div>
      </div>
      <div class="${baseCls}-drag" data-toggle="handler-drag"></div>
      <div class="${baseCls}-cp-c" data-toggle="handler-color-c">
        ${colorEl || `
          <div class="${baseCls}-cp-wrap" data-toggle="handler-color-wrap" style="background-color: ${color}">
            <input type="color" data-toggle="handler-color" value="${color}">
          </div>`}
      </div>
    `;
    style.position = 'absolute';
    style.top = 0;
    style.left = `${this.position}%`;
    previewEl.appendChild(hEl);
    this.el = hEl;
    this.initEvents();
    colorPicker && colorPicker(this);
    return hEl;
  }
}
