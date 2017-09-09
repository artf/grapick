import Handler from './Handler'

export default class Grapick {

  constructor(options = {}) {
    this.handlers = [];
    const defaults = {
      // HTMLElement - string
      el: '',

      colorEl: '',

      // Any supported direction: top, left, bottom, right, 90deg, etc.
      direction: 'left',

      // Gradient type, available options: 'linear' or 'radial'
      type: 'linear',

      // Gradient input height
      height: '20px',

      // Gradient input width
      width: '100%',

      // Initial handlers
      handlers: [
        {color: '#000', position: 0},
        {color: '#fff', position: 100},
      ],
    };

    for (let name in defaults) {
      if (!(name in options))
        options[name] = defaults[name];
    }
    this.options = options;
    this.render();
  }

  /**
   * Set custom color picker
   * @param {Object} cp Color picker interface
   * @example
   * // TAKE IN ACCOUNT a single color picker instance
   * gi.setColorPicker({
   *  init(handler) {
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
   *  },
   * })
   */
  setColorPicker(cp) {
    this.colorPicker = cp;
  }

  /**
   * Get the complete style value
   * @return {string}
   */
  getValue() {
    return `${this.getType()}-gradient(${this.getDirection()}, ${this.getColorValue()});`;
  }

  /**
   * Get only colors value
   * @return {string}
   */
  getColorValue() {
    return 'rgba(30,87,153,1) 0%,rgba(32,124,202,1) 24%,rgba(32,124,202,1) 59%,rgba(32,124,202,1) 76%,rgba(125,185,232,1) 91%';
  }

  /**
   * Get an array with browser specific values
   * @return {Array}
   */
  getPrefixedValues() {
    return ['-moz-', '-webkit-'].map(prefix => {
      `${prefix}${this.getValue()}`
    });
  }

  /**
   * Set on change callback
   * @param  {Function} clb Callback function
   */
  onChange(clb) {
    this.onChangeClb = clb;
  }

  /**
   * Set on handle select callback
   * @param  {Function} clb Callback function
   */
  onHandleSelect(clb) {
    this.onHandleSelect = clb
  }

  /**
   * Trigger change
   * @param {Boolean} complete Indicates if the change is complete (eg. while dragging is not complete)
   */
  change(complete = 1) {
    const onChange = this.onChangeClb;
    onChange && onChange(this, complete);
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
   * @return {Object} Handler object
   */
  addHandler(position, color) {
    const handler = new Handler(this, position, color);
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
   * Render the preview picker
   */
  render() {

  }
}
